import { z } from "zod";
import { resolveSafePath, assertExists } from "../utils/security.js";
import { readFileSafely } from "../utils/filesystem.js";
import { fileContentToMarkdown } from "../utils/markdown.js";

export const readFileInputShape = {
  path: z.string().describe("Path file teks yang ingin dibaca."),
  maxBytes: z
    .number()
    .int()
    .min(1)
    .max(1_000_000)
    .default(200_000)
    .describe("Batas maksimum jumlah byte yang dibaca (default 200.000)."),
  format: z
    .enum(["markdown", "raw"])
    .default("markdown")
    .describe(
      "Format output: 'markdown' (dibungkus fenced code block dengan syntax highlighting, default) atau 'raw' (teks polos apa adanya)."
    ),
};

const readFileInput = z.object(readFileInputShape);

export const readFileTool = {
  name: "read_file",
  description:
    "Membaca isi sebuah file teks (kode, markdown, JSON, dll). File biner ditolak demi keamanan. " +
    "Isi file yang sangat besar akan dipotong sesuai maxBytes.",
  inputSchema: readFileInputShape,
  handler: async (rawInput: unknown) => {
    const input = readFileInput.parse(rawInput);
    const safePath = resolveSafePath(input.path);
    assertExists(safePath);

    const result = readFileSafely(safePath, input.maxBytes);

    const text =
      input.format === "raw"
        ? result.truncated
          ? `[File dipotong: menampilkan ${input.maxBytes} dari ${result.totalBytes} byte]\n\n${result.content}`
          : result.content
        : fileContentToMarkdown(
            safePath,
            result.content,
            result.truncated,
            result.totalBytes,
            input.maxBytes
          );

    return {
      content: [{ type: "text" as const, text }],
    };
  },
};
