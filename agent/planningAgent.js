import { listAllTools, callTool } from "../mcp/clientManager.js";
import { callLLM } from "../services/llm.js";

export async function runPlanningAgent(userMessage) {

    const tools = await listAllTools();

    const toolDescriptions =
        tools.map(tool => {

            return `
Server : ${tool.server}

Tool : ${tool.name}

Description : ${tool.description}
`;

        }).join("\n");

    const messages = [

        {

            role: "system",

            content: `

You are an AI Agent.

You can use tools.

Available tools:

${toolDescriptions}

You MUST think step by step.

Whenever you need a tool return ONLY JSON.

Example:

{
    "type":"tool",
    "server":"calculator",
    "tool":"calculator",
    "arguments":{
        "expression":"9/3"
    }
}
    If one tool is enough,
DO NOT call another tool.

Never invent calculations.

Never modify tool results.

Only call another tool if absolutely necessary.

Every tool call costs money.

Minimize tool calls.

Use the minimum number of tools required.

If you already have enough information to answer, return

{
    "type":"final",
    "answer":"..."
}

Never return markdown.

Never explain.

Only JSON.

`

        },

        {

            role: "user",

            content: userMessage

        }

    ];

    const MAX_ITERATIONS = 10;

    let iteration = 0;

    while (iteration < MAX_ITERATIONS) {

        iteration++;

        const response =
            await callLLM(messages);

        console.log(response);

        const decision =
            JSON.parse(response);

        if (decision.type === "final") {

            return decision.answer;

        }


        const toolResult =
            await callTool(

                decision.server,

                decision.tool,

                decision.arguments

            );

        console.log(toolResult);

        messages.push({

            role: "assistant",

            content: response

        });

        messages.push({

            role: "user",

            content: `

Tool Result:

${toolResult}

Original User Question:

${userMessage}

IMPORTANT:

If this tool result completely answers the original question,
return:

{
  "type":"final",
  "answer":"..."
}

Only call another tool if the original question CANNOT be answered yet.

Return JSON only.

`

        });

    }
    throw new Error(
        "Maximum planning iterations exceeded."
    );

}