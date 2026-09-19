import { z } from "zod";
import { resolveSafePath, assertExists, isLikelyTextFile } from "../utils/security.js";
import { getEntryStats } from "../utils/filesystem.js";
import { fileInfoToMarkdown } from "../utils/markdown.js";

export const fileInfoInputShape = {
  path: z.string().describe("Path file atau folder yang ingin diambil metadatanya."),
  format: z
    .enum(["markdown", "json"])
    .default("markdown")
    .describe("Format output: 'markdown' (tabel yang enak dibaca, default) atau 'json' (data mentah)."),
};

const fileInfoInput = z.object(fileInfoInputShape);

export const fileInfoTool = {
  name: "file_info",
  description:
    "Mengambil metadata sebuah file atau folder: tipe, ukuran, waktu modifikasi, " +
    "dan apakah file tersebut kemungkinan dapat dibaca sebagai teks.",
  inputSchema: fileInfoInputShape,
  handler: async (rawInput: unknown) => {
    const input = fileInfoInput.parse(rawInput);
    const safePath = resolveSafePath(input.path);
    assertExists(safePath);

    const info = getEntryStats(safePath);
    const extra =
      info.type === "file" ? { likelyTextFile: isLikelyTextFile(safePath) } : {};
    const fullInfo = { ...info, ...extra };

    const text =
      input.format === "json"
        ? JSON.stringify(fullInfo, null, 2)
        : fileInfoToMarkdown(fullInfo);

    return {
      content: [{ type: "text" as const, text }],
    };
  },
};
