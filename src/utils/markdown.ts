import path from "node:path";
import type { DirectoryNode, FileEntry, SearchResult } from "./filesystem.js";

/** Ikon sederhana berdasarkan tipe entry, biar tree enak dibaca. */
function iconFor(type: FileEntry["type"]): string {
  if (type === "directory") return "📁";
  if (type === "symlink") return "🔗";
  if (type === "file") return "📄";
  return "❔";
}

function formatBytes(bytes?: number): string {
  if (bytes === undefined) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Merender DirectoryNode menjadi Markdown berbentuk pohon (nested bullet list).
 * Contoh:
 * - 📁 **src**
 *   - 📁 tools
 *     - 📄 map-directory.ts (2.1 KB)
 */
export function directoryTreeToMarkdown(node: DirectoryNode, depth = 0): string {
  const indent = "  ".repeat(depth);
  const icon = iconFor(node.type);
  const label = node.type === "directory" ? `**${node.name}**` : node.name;
  const meta =
    node.type === "file" && node.size !== undefined
      ? ` \`(${formatBytes(node.size)})\``
      : node.truncated
      ? " `(dipotong, terlalu banyak isi)`"
      : "";

  let line = `${indent}- ${icon} ${label}${meta}\n`;

  if (node.children) {
    for (const child of node.children) {
      line += directoryTreeToMarkdown(child, depth + 1);
    }
  }

  return line;
}

export function directoryTreeHeader(rootPath: string, node: DirectoryNode): string {
  const childCount = node.children?.length ?? 0;
  return (
    `## 🗂️ Peta direktori: \`${rootPath}\`\n\n` +
    `${directoryTreeToMarkdown(node)}\n` +
    (childCount === 0 && node.type === "directory" ? "_(direktori kosong)_\n" : "")
  );
}

/** Merender daftar entry (hasil list_directory) sebagai tabel Markdown. */
export function entriesToMarkdownTable(rootPath: string, entries: FileEntry[]): string {
  if (entries.length === 0) {
    return `## 📁 Isi direktori: \`${rootPath}\`\n\n_(kosong)_\n`;
  }

  const rows = entries
    .map((e) => {
      const icon = iconFor(e.type);
      const modified = e.modifiedAt ? e.modifiedAt.split("T")[0] : "-";
      return `| ${icon} ${e.name} | ${e.type} | ${formatBytes(e.size)} | ${modified} |`;
    })
    .join("\n");

  return (
    `## 📁 Isi direktori: \`${rootPath}\`\n\n` +
    `| Nama | Tipe | Ukuran | Terakhir diubah |\n` +
    `|---|---|---|---|\n` +
    `${rows}\n`
  );
}

/** Merender hasil pencarian (search_files) sebagai list Markdown. */
export function searchResultsToMarkdown(
  query: { namePattern?: string; contentPattern?: string },
  results: SearchResult[]
): string {
  const parts: string[] = [];
  if (query.namePattern) parts.push(`nama cocok \`${query.namePattern}\``);
  if (query.contentPattern) parts.push(`isi mengandung \`"${query.contentPattern}"\``);
  const queryDesc = parts.join(" & ") || "semua file";

  let md = `## 🔍 Hasil pencarian (${queryDesc})\n\n`;
  md += `Ditemukan **${results.length}** hasil.\n\n`;

  if (results.length === 0) {
    return md;
  }

  for (const r of results) {
    md += `- 📄 \`${r.path}\`\n`;
    if (r.matchedLine) {
      md += `  - baris ${r.matchedLine.line}: \`${r.matchedLine.text.slice(0, 200)}\`\n`;
    }
  }
  md += "\n";

  return md;
}

/** Merender metadata satu file/folder (file_info) sebagai definisi Markdown. */
export function fileInfoToMarkdown(
  info: FileEntry & { likelyTextFile?: boolean }
): string {
  const icon = iconFor(info.type);
  let md = `## ${icon} \`${info.name}\`\n\n`;
  md += `| Properti | Nilai |\n|---|---|\n`;
  md += `| Path | \`${info.path}\` |\n`;
  md += `| Tipe | ${info.type} |\n`;
  if (info.size !== undefined) md += `| Ukuran | ${formatBytes(info.size)} |\n`;
  if (info.modifiedAt) md += `| Terakhir diubah | ${info.modifiedAt} |\n`;
  if (info.likelyTextFile !== undefined) {
    md += `| Bisa dibaca sebagai teks | ${info.likelyTextFile ? "Ya" : "Tidak"} |\n`;
  }
  return md;
}

/** Menentukan bahasa untuk fenced code block Markdown berdasarkan ekstensi file. */
export function languageForCodeBlock(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    ".ts": "typescript",
    ".tsx": "tsx",
    ".js": "javascript",
    ".jsx": "jsx",
    ".mjs": "javascript",
    ".cjs": "javascript",
    ".json": "json",
    ".md": "markdown",
    ".mdx": "markdown",
    ".py": "python",
    ".rb": "ruby",
    ".go": "go",
    ".rs": "rust",
    ".java": "java",
    ".c": "c",
    ".cpp": "cpp",
    ".h": "c",
    ".hpp": "cpp",
    ".css": "css",
    ".scss": "scss",
    ".html": "html",
    ".xml": "xml",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".sql": "sql",
    ".sh": "bash",
    ".toml": "toml",
    ".ini": "ini",
  };
  return map[ext] ?? "";
}

/** Merender isi file (read_file) sebagai fenced code block Markdown. */
export function fileContentToMarkdown(
  filePath: string,
  content: string,
  truncated: boolean,
  totalBytes: number,
  shownBytes: number
): string {
  const lang = languageForCodeBlock(filePath);
  const fence = "```";
  let md = `## 📄 \`${filePath}\`\n\n`;
  if (truncated) {
    md += `> ⚠️ Ditampilkan ${formatBytes(shownBytes)} dari total ${formatBytes(
      totalBytes
    )} (dipotong).\n\n`;
  }
  md += `${fence}${lang}\n${content}\n${fence}\n`;
  return md;
}
