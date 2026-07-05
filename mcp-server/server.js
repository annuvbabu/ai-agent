import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { calculate } from "./tools/calculator.js";
import {
    getCurrentDate,
    getCurrentTime,
    getCurrentDateTime
} from "./tools/dateTime.js";

const server = new McpServer({
    name: "ai-tools-server",
    version: "1.0.0"
});

/* ----------------------------------
   Calculator Tool
-----------------------------------*/

server.tool(
    "calculator",
    "Evaluate a mathematical expression",
    {
        expression: z.string()
    },
    async ({ expression }) => {

        const result = calculate(expression);

        return {
            content: [
                {
                    type: "text",
                    text: result
                }
            ]
        };

    }
);

/* ----------------------------------
   Current Date
-----------------------------------*/

server.tool(
    "current_date",
    "Get today's date",
    {},
    async () => {

        return {
            content: [
                {
                    type: "text",
                    text: getCurrentDate()
                }
            ]
        };

    }
);

/* ----------------------------------
   Current Time
-----------------------------------*/

server.tool(
    "current_time",
    "Get current time",
    {},
    async () => {

        return {
            content: [
                {
                    type: "text",
                    text: getCurrentTime()
                }
            ]
        };

    }
);

/* ----------------------------------
   Current Date Time
-----------------------------------*/

server.tool(
    "current_datetime",
    "Get current date and time",
    {},
    async () => {

        return {
            content: [
                {
                    type: "text",
                    text: getCurrentDateTime()
                }
            ]
        };

    }
);

/* ----------------------------------
   Start Server
-----------------------------------*/

const transport = new StdioServerTransport();

await server.connect(transport);

console.error("🚀 MCP Server Started");