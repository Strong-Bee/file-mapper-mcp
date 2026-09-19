import path from "node:path";
import fs from "node:fs";

/**
 * Root direktori yang diizinkan untuk diakses oleh server ini.
 * Diambil dari environment variable FILE_MAPPER_ROOT, atau
 * jika tidak diset, memakai direktori kerja saat proses dijalankan.
 */
export const ALLOWED_ROOT = path.resolve(
  process.env.FILE_MAPPER_ROOT?.trim() || process.cwd()
);

/** Ekstensi file yang dianggap "teks" dan aman untuk dibaca sebagai string. */
const TEXT_FILE_EXTENSIONS = new Set([
  ".txt", ".md", ".mdx", ".json", ".yaml", ".yml", ".xml", ".csv",
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".rb", ".go", ".rs", ".java", ".c", ".cpp", ".h", ".hpp",
  ".css", ".scss", ".html", ".sql", ".sh", ".env.example",
  ".toml", ".ini", ".cfg", ".conf", ".log",
]);

/** Nama folder yang selalu dilewati saat penelusuran rekursif. */
export const DEFAULT_IGNORED_DIRS = new Set([
  "node_modules", ".git", ".svn", ".hg", "dist", "build",
  ".next", ".cache", "__pycache__", ".venv", "venv",
]);

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecurityError";
  }
}

/**
 * Mengubah path yang diminta (relatif maupun absolut) menjadi path absolut
 * yang telah divalidasi, lalu memastikan path tersebut tetap berada
 * di dalam ALLOWED_ROOT. Melempar SecurityError bila terjadi
 * upaya path traversal (mis. menggunakan "..") keluar dari root.
 */
export function resolveSafePath(requestedPath: string): string {
  const inputPath = requestedPath?.trim() || ".";

  const resolved = path.isAbsolute(inputPath)
    ? path.resolve(inputPath)
    : path.resolve(ALLOWED_ROOT, inputPath);

  const normalizedRoot = ALLOWED_ROOT.endsWith(path.sep)
    ? ALLOWED_ROOT
    : ALLOWED_ROOT + path.sep;

  const isInsideRoot =
    resolved === ALLOWED_ROOT || resolved.startsWith(normalizedRoot);

  if (!isInsideRoot) {
    throw new SecurityError(
      `Akses ditolak: path "${requestedPath}" berada di luar direktori yang diizinkan (${ALLOWED_ROOT}).`
    );
  }

  return resolved;
}

/** Memastikan path yang sudah aman itu benar-benar ada di filesystem. */
export function assertExists(absolutePath: string): void {
  if (!fs.existsSync(absolutePath)) {
    throw new SecurityError(`Path tidak ditemukan: ${absolutePath}`);
  }
}

/** Mengecek apakah sebuah ekstensi file dianggap file teks. */
export function isLikelyTextFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  if (TEXT_FILE_EXTENSIONS.has(ext)) return true;
  // File tanpa ekstensi (mis. "Dockerfile", "README") tetap dicoba sebagai teks.
  return ext === "";
}

/** Mengecek apakah nama folder harus diabaikan secara default. */
export function isIgnoredDir(name: string): boolean {
  return DEFAULT_IGNORED_DIRS.has(name) || name.startsWith(".");
}
