#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SecurityError, ALLOWED_ROOT } from "./utils/security.js";

import { analyzeArchitectureTool } from "./tools/analyze-architecture.js";
import { mapDirectoryTool } from "./tools/map-directory.js";
import { listDirectoryTool } from "./tools/list-directory.js";
import { searchFilesTool } from "./tools/search-files.js";
import { fileInfoTool } from "./tools/file-info.js";
import { readFileTool } from "./tools/read-file.js";

const server = new McpServer({
  name: "codebase-architect-mcp",
  version: "1.1.0",
  title: "Codebase Architect",
});

const tools = [
  analyzeArchitectureTool,
  mapDirectoryTool,
  listDirectoryTool,
  searchFilesTool,
  fileInfoTool,
  readFileTool,
];

for (const tool of tools) {
  server.tool(
    tool.name,
    tool.description,
    tool.inputSchema,
    async (args: unknown) => {
      try {
        return await tool.handler(args);
      } catch (error) {
        const message =
          error instanceof SecurityError
            ? error.message
            : error instanceof Error
            ? error.message
            : String(error);

        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: ${message}` }],
        };
      }
    }
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Codebase Architect MCP berjalan (root: ${ALLOWED_ROOT})`);
}

main().catch((error) => {
  console.error("Fatal error saat menjalankan Codebase Architect MCP:", error);
  process.exit(1);
});
