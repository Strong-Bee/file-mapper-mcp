import fs from "node:fs";
import path from "node:path";
import { isIgnoredDir, isLikelyTextFile } from "./security.js";

export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "directory" | "symlink" | "other";
  size?: number;
  modifiedAt?: string;
}

export interface DirectoryNode extends FileEntry {
  children?: DirectoryNode[];
  truncated?: boolean;
}

function statToType(stat: fs.Stats): FileEntry["type"] {
  if (stat.isDirectory()) return "directory";
  if (stat.isFile()) return "file";
  if (stat.isSymbolicLink()) return "symlink";
  return "other";
}

/** Mengambil metadata satu file/folder. */
export function getEntryStats(absolutePath: string): FileEntry {
  const stat = fs.lstatSync(absolutePath);
  return {
    name: path.basename(absolutePath),
    path: absolutePath,
    type: statToType(stat),
    size: stat.isFile() ? stat.size : undefined,
    modifiedAt: stat.mtime.toISOString(),
  };
}

/** Listing satu tingkat (tidak rekursif) dari sebuah direktori. */
export function listDirectoryShallow(
  absolutePath: string,
  includeHidden = false
): FileEntry[] {
  const names = fs.readdirSync(absolutePath);
  const entries: FileEntry[] = [];

  for (const name of names) {
    if (!includeHidden && name.startsWith(".")) continue;
    const fullPath = path.join(absolutePath, name);
    try {
      entries.push(getEntryStats(fullPath));
    } catch {
      // Lewati entry yang tidak bisa diakses (mis. broken symlink, permission).
    }
  }

  // Folder dulu, lalu file, masing-masing urut alfabet.
  entries.sort((a, b) => {
    if (a.type !== b.type) {
      if (a.type === "directory") return -1;
      if (b.type === "directory") return 1;
    }
    return a.name.localeCompare(b.name);
  });

  return entries;
}

export interface WalkOptions {
  maxDepth: number;
  includeHidden?: boolean;
  maxEntriesPerDir?: number;
}

/** Membangun pohon direktori secara rekursif hingga maxDepth. */
export function walkDirectory(
  absolutePath: string,
  options: WalkOptions,
  currentDepth = 0
): DirectoryNode {
  const base = getEntryStats(absolutePath);

  if (base.type !== "directory") {
    return base;
  }

  if (currentDepth >= options.maxDepth) {
    return { ...base, truncated: true };
  }

  let names: string[];
  try {
    names = fs.readdirSync(absolutePath);
  } catch {
    return { ...base, children: [] };
  }

  const maxEntries = options.maxEntriesPerDir ?? 200;
  let truncated = false;
  if (names.length > maxEntries) {
    names = names.slice(0, maxEntries);
    truncated = true;
  }

  const children: DirectoryNode[] = [];
  for (const name of names) {
    if (!options.includeHidden && name.startsWith(".")) continue;
    if (isIgnoredDir(name)) continue;

    const fullPath = path.join(absolutePath, name);
    try {
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory()) {
        children.push(walkDirectory(fullPath, options, currentDepth + 1));
      } else {
        children.push(getEntryStats(fullPath));
      }
    } catch {
      // Lewati entry bermasalah.
    }
  }

  children.sort((a, b) => {
    if (a.type !== b.type) {
      if (a.type === "directory") return -1;
      if (b.type === "directory") return 1;
    }
    return a.name.localeCompare(b.name);
  });

  return { ...base, children, truncated: truncated || undefined };
}

export interface SearchOptions {
  namePattern?: string;
  contentPattern?: string;
  maxResults?: number;
  includeHidden?: boolean;
}

export interface SearchResult {
  path: string;
  name: string;
  type: FileEntry["type"];
  matchedLine?: { line: number; text: string };
}

function globToRegExp(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`, "i");
}

/** Mencari file berdasarkan pola nama (glob sederhana: *, ?) dan/atau isi konten. */
export function searchFiles(
  rootAbsolutePath: string,
  options: SearchOptions
): SearchResult[] {
  const results: SearchResult[] = [];
  const maxResults = options.maxResults ?? 100;
  const nameRegex = options.namePattern
    ? globToRegExp(options.namePattern)
    : null;
  const contentNeedle = options.contentPattern?.toLowerCase();

  function visit(dirPath: string) {
    if (results.length >= maxResults) return;

    let names: string[];
    try {
      names = fs.readdirSync(dirPath);
    } catch {
      return;
    }

    for (const name of names) {
      if (results.length >= maxResults) return;
      if (!options.includeHidden && name.startsWith(".")) continue;
      if (isIgnoredDir(name)) continue;

      const fullPath = path.join(dirPath, name);
      let stat: fs.Stats;
      try {
        stat = fs.lstatSync(fullPath);
      } catch {
        continue;
      }

      if (stat.isDirectory()) {
        visit(fullPath);
        continue;
      }

      if (!stat.isFile()) continue;

      const nameMatches = nameRegex ? nameRegex.test(name) : true;

      if (contentNeedle && isLikelyTextFile(fullPath) && stat.size < 5_000_000) {
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          const lines = content.split("\n");
          const lineIndex = lines.findIndex((l) =>
            l.toLowerCase().includes(contentNeedle)
          );
          if (lineIndex !== -1 && nameMatches) {
            results.push({
              path: fullPath,
              name,
              type: "file",
              matchedLine: { line: lineIndex + 1, text: lines[lineIndex].trim() },
            });
          }
        } catch {
          // Lewati file yang gagal dibaca (biner, permission, dll).
        }
      } else if (nameMatches && !contentNeedle) {
        results.push({ path: fullPath, name, type: "file" });
      }
    }
  }

  visit(rootAbsolutePath);
  return results;
}

export interface ReadFileResult {
  path: string;
  content: string;
  truncated: boolean;
  totalBytes: number;
}

/** Membaca isi file sebagai teks, dengan batas ukuran untuk keamanan/performa. */
export function readFileSafely(
  absolutePath: string,
  maxBytes = 200_000
): ReadFileResult {
  const stat = fs.statSync(absolutePath);
  if (!stat.isFile()) {
    throw new Error(`Bukan file: ${absolutePath}`);
  }
  if (!isLikelyTextFile(absolutePath)) {
    throw new Error(
      `File "${path.basename(absolutePath)}" tampaknya bukan file teks dan tidak dibaca demi keamanan.`
    );
  }

  const buffer = fs.readFileSync(absolutePath);
  const truncated = buffer.length > maxBytes;
  const content = buffer.subarray(0, maxBytes).toString("utf-8");

  return {
    path: absolutePath,
    content,
    truncated,
    totalBytes: buffer.length,
  };
}
