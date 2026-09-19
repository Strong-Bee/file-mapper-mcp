import { z } from "zod";
import { resolveSafePath, assertExists } from "../utils/security.js";
import { analyzeArchitecture } from "../utils/architecture.js";
import { architectureToMarkdown } from "../utils/markdown.js";

export const analyzeArchitectureInputShape = {
  path: z
    .string()
    .default(".")
    .describe("Path root project yang ingin dianalisis arsitekturnya."),
  maxDepth: z
    .number()
    .int()
    .min(1)
    .max(10)
    .default(4)
    .describe("Kedalaman maksimum penelusuran folder saat menghitung komposisi kode (default 4)."),
  format: z
    .enum(["markdown", "json"])
    .default("markdown")
    .describe("Format output: 'markdown' (laporan yang enak dibaca, default) atau 'json' (data mentah)."),
};

const analyzeArchitectureInput = z.object(analyzeArchitectureInputShape);

export const analyzeArchitectureTool = {
  name: "analyze_architecture",
  description:
    "Menganalisis arsitektur sebuah codebase: mendeteksi tech stack & framework (dari package.json, " +
    "requirements.txt, go.mod, Cargo.toml, dll), entry point aplikasi, komposisi kode per bahasa " +
    "(jumlah file & baris), file konfigurasi yang ada, serta sinyal infrastruktur (Docker, CI/CD, testing). " +
    "Gunakan tool ini di awal ketika ingin memahami sebuah project secara cepat sebelum menyelami detail kode.",
  inputSchema: analyzeArchitectureInputShape,
  handler: async (rawInput: unknown) => {
    const input = analyzeArchitectureInput.parse(rawInput);
    const safePath = resolveSafePath(input.path);
    assertExists(safePath);

    const analysis = analyzeArchitecture(safePath, input.maxDepth);

    const text =
      input.format === "json"
        ? JSON.stringify(analysis, null, 2)
        : architectureToMarkdown(analysis);

    return {
      content: [{ type: "text" as const, text }],
    };
  },
};
