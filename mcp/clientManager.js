import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import servers from "./servers.js";

const clients = {};

export async function connectAllServers() {

    for (const [serverName, config] of Object.entries(servers)) {

        const transport = new StdioClientTransport({

            command: config.command,

            args: config.args

        });

        const client = new Client({

            name: "ai-agent",

            version: "1.0.0"

        });

        await client.connect(transport);

        clients[serverName] = client;

        console.log(`✅ ${serverName} connected`);

    }

}

export async function listAllTools() {

    const allTools = [];

    for (const [serverName, client] of Object.entries(clients)) {

        const response = await client.listTools();

        for (const tool of response.tools) {

            allTools.push({

                server: serverName,

                name: tool.name,

                description: tool.description

            });

        }

    }

    return allTools;

}

export async function callTool(
    serverName,
    toolName,
    args = {}
) {

    const client = clients[serverName];

    const result = await client.callTool({

        name: toolName,

        arguments: args

    });

    return result.content[0].text;

}