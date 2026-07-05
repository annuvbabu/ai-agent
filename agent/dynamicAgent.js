import { listAllTools, callTool } from "../mcp/clientManager.js";
import { callLLM } from "../services/llm.js";

export async function executeDynamicAgent(userMessage) {

    // Get every tool from every server

    const tools = await listAllTools();

    // Build prompt

    const toolPrompt =
        tools.map(tool => {

            return `

Server: ${tool.server}

Tool: ${tool.name}

Description: ${tool.description}

`;

        }).join("\n");

    const prompt = `

You are an AI Agent.

Available MCP Servers and Tools:

${toolPrompt}

Choose the BEST tool.

Return ONLY JSON.

Example:

{
    "server":"calculator",
    "tool":"calculator",
    "arguments":{
        "expression":"9/3"
    }
}

Another Example:

{
    "server":"weather",
    "tool":"weather",
    "arguments":{
        "city":"Kochi"
    }
}

User:

${userMessage}

`;

    const decisionText =
        await callLLM([
            {
                role: "system",
                content: prompt
            }
        ]);

    console.log("LLM Decision");

    console.log(decisionText);

    const decision =
        JSON.parse(decisionText);

    const result =
        await callTool(

            decision.server,

            decision.tool,

            decision.arguments

        );

    return {

        tool: decision.tool,

        result

    };

}