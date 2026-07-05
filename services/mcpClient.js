import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

let client;

export async function connectMCP() {

    if (client) return;

    const transport = new StdioClientTransport({
        command: "node",
        args: ["../mcp-server/server.js"]
    });

    client = new Client({
        name: "ai-agent",
        version: "1.0.0"
    });

    await client.connect(transport);

    console.log("✅ MCP Connected");
}

export async function listTools() {

    return await client.listTools();

}

export async function callTool(toolName, args = {}) {

    const result = await client.callTool({

        name: toolName,

        arguments: args

    });

    return result.content[0].text;

}