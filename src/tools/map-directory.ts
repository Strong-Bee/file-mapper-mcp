import { z } from "zod";
import { resolveSafePath, assertExists } from "../utils/security.js";
import { walkDirectory } from "../utils/filesystem.js";
import { directoryTreeHeader } from "../utils/markdown.js";

export const mapDirectoryInputShape = {
  path: z
    .string()
    .default(".")
    .describe("Path direktori yang ingin dipetakan (relatif terhadap root, atau absolut jika di dalam root)."),
  maxDepth: z
    .number()
    .int()
    .min(1)
    .max(10)
    .default(3)
    .describe("Kedalaman maksimum penelusuran folder (default 3)."),
  includeHidden: z
    .boolean()
    .default(false)
    .describe("Sertakan file/folder tersembunyi (diawali titik)."),
  format: z
    .enum(["markdown", "json"])
    .default("markdown")
    .describe("Format output: 'markdown' (tree yang enak dibaca, default) atau 'json' (data mentah)."),
};

const mapDirectoryInput = z.object(mapDirectoryInputShape);

export const mapDirectoryTool = {
  name: "map_directory",
  description:
    "Memetakan struktur pohon (tree) sebuah direktori secara rekursif hingga kedalaman tertentu. " +
    "Berguna untuk memahami struktur project secara keseluruhan. Output default berupa Markdown.",
  inputSchema: mapDirectoryInputShape,
  handler: async (rawInput: unknown) => {
    const input = mapDirectoryInput.parse(rawInput);
    const safePath = resolveSafePath(input.path);
    assertExists(safePath);

    const tree = walkDirectory(safePath, {
      maxDepth: input.maxDepth,
      includeHidden: input.includeHidden,
    });

    const text =
      input.format === "json"
        ? JSON.stringify(tree, null, 2)
        : directoryTreeHeader(safePath, tree);

    return {
      content: [{ type: "text" as const, text }],
    };
  },
};
