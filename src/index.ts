#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SecurityError, ALLOWED_ROOT } from "./utils/security.js";

import { mapDirectoryTool } from "./tools/map-directory.js";
import { listDirectoryTool } from "./tools/list-directory.js";
import { searchFilesTool } from "./tools/search-files.js";
import { fileInfoTool } from "./tools/file-info.js";
import { readFileTool } from "./tools/read-file.js";

const server = new McpServer({
  name: "file-mapper-mcp",
  version: "1.0.0",
});

const tools = [
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
  console.error(`file-mapper-mcp berjalan (root: ${ALLOWED_ROOT})`);
}

main().catch((error) => {
  console.error("Fatal error saat menjalankan file-mapper-mcp:", error);
  process.exit(1);
});
