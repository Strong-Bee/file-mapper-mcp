import { z } from "zod";
import { resolveSafePath, assertExists } from "../utils/security.js";
import { listDirectoryShallow } from "../utils/filesystem.js";
import { entriesToMarkdownTable } from "../utils/markdown.js";

export const listDirectoryInputShape = {
  path: z
    .string()
    .default(".")
    .describe("Path direktori yang ingin dilihat isinya (satu tingkat, tidak rekursif)."),
  includeHidden: z
    .boolean()
    .default(false)
    .describe("Sertakan file/folder tersembunyi (diawali titik)."),
  format: z
    .enum(["markdown", "json"])
    .default("markdown")
    .describe("Format output: 'markdown' (tabel yang enak dibaca, default) atau 'json' (data mentah)."),
};

const listDirectoryInput = z.object(listDirectoryInputShape);

export const listDirectoryTool = {
  name: "list_directory",
  description:
    "Menampilkan daftar file dan folder pada satu tingkat direktori (tidak rekursif), " +
    "beserta ukuran dan waktu modifikasi. Output default berupa tabel Markdown.",
  inputSchema: listDirectoryInputShape,
  handler: async (rawInput: unknown) => {
    const input = listDirectoryInput.parse(rawInput);
    const safePath = resolveSafePath(input.path);
    assertExists(safePath);

    const entries = listDirectoryShallow(safePath, input.includeHidden);

    const text =
      input.format === "json"
        ? JSON.stringify({ path: safePath, entries }, null, 2)
        : entriesToMarkdownTable(safePath, entries);

    return {
      content: [{ type: "text" as const, text }],
    };
  },
};
