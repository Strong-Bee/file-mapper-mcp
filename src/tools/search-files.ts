import { z } from "zod";
import { resolveSafePath, assertExists } from "../utils/security.js";
import { searchFiles } from "../utils/filesystem.js";
import { searchResultsToMarkdown } from "../utils/markdown.js";

export const searchFilesInputShape = {
  path: z
    .string()
    .default(".")
    .describe("Direktori awal pencarian."),
  namePattern: z
    .string()
    .optional()
    .describe("Pola nama file, mendukung wildcard sederhana * dan ? (contoh: '*.ts')."),
  contentPattern: z
    .string()
    .optional()
    .describe("Teks yang dicari di dalam isi file (pencarian tidak case-sensitive)."),
  maxResults: z
    .number()
    .int()
    .min(1)
    .max(500)
    .default(100)
    .describe("Jumlah maksimum hasil yang dikembalikan."),
  includeHidden: z
    .boolean()
    .default(false)
    .describe("Sertakan file/folder tersembunyi (diawali titik)."),
  format: z
    .enum(["markdown", "json"])
    .default("markdown")
    .describe("Format output: 'markdown' (list yang enak dibaca, default) atau 'json' (data mentah)."),
};

const searchFilesInput = z.object(searchFilesInputShape).refine(
  (data) => data.namePattern || data.contentPattern,
  { message: "Harus mengisi minimal salah satu dari namePattern atau contentPattern." }
);

export const searchFilesTool = {
  name: "search_files",
  description:
    "Mencari file secara rekursif berdasarkan pola nama (wildcard) dan/atau kecocokan isi teks. " +
    "Minimal satu dari namePattern atau contentPattern harus diisi.",
  inputSchema: searchFilesInputShape,
  handler: async (rawInput: unknown) => {
    const input = searchFilesInput.parse(rawInput);
    const safePath = resolveSafePath(input.path);
    assertExists(safePath);

    const results = searchFiles(safePath, {
      namePattern: input.namePattern,
      contentPattern: input.contentPattern,
      maxResults: input.maxResults,
      includeHidden: input.includeHidden,
    });

    const text =
      input.format === "json"
        ? JSON.stringify({ query: input, resultCount: results.length, results }, null, 2)
        : searchResultsToMarkdown(input, results);

    return {
      content: [{ type: "text" as const, text }],
    };
  },
};
