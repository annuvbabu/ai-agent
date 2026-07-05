import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { calculate } from "./tools/calculator.js";
import { getWeather } from "./tools/weather.js";
import { callLLM } from "./services/llm.js";
import {
    saveMemory,
    getMemory
} from "./memory/memory.js";
import { extractMemory } from "./services/llm.js";
import { executeTool } from "./agent/toolManager.js";
import { connectMCP } from "./services/mcpClient.js";
import { executeDynamicAgent } from "./agent/dynamicAgent.js";
import { connectAllServers } from "./mcp/clientManager.js";
import { runPlanningAgent } from "./agent/planningAgent.js";




dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

async function decideAction(userMessage) {

    const prompt = `
You are an AI Agent.

Your ONLY job is to decide which action should be executed.

Return ONLY valid JSON.

Never explain.

Never answer the user.

Never return markdown.

Available actions:

calculator
weather
current_date
current_time
current_datetime
save_memory
get_memory
answer

Rules:

- If the user tells you ANY personal information about themselves, use save_memory.
- If the user asks about previously stored personal information, use get_memory.
- If the user asks for arithmetic, use calculator.
- If the user asks about weather, use weather.
- Only use answer if none of the above applies.
- If the user asks for the current time, use current_time.
- If the user asks for today's date, use current_date.
- If the user asks for both date and time, use current_datetime.

Examples:

User: My name is Annu
{"action":"save_memory","key":"name","value":"Annu"}

User: My name is John
{"action":"save_memory","key":"name","value":"John"}

User: I am Vishnu
{"action":"save_memory","key":"name","value":"Vishnu"}

User: Call me Alex
{"action":"save_memory","key":"name","value":"Alex"}

User: My city is Kochi
{"action":"save_memory","key":"city","value":"Kochi"}

User: I live in Delhi
{"action":"save_memory","key":"city","value":"Delhi"}

User: My profession is Software Engineer
{"action":"save_memory","key":"profession","value":"Software Engineer"}

User: My career goal is AI Engineer
{"action":"save_memory","key":"career_goal","value":"AI Engineer"}

User: What is my name?
{"action":"get_memory","key":"name"}

User: What is my city?
{"action":"get_memory","key":"city"}

User: What is my profession?
{"action":"get_memory","key":"profession"}

User: What is my career goal?
{"action":"get_memory","key":"career_goal"}

User: 25*45
{"action":"calculator","input":"25*45"}

User: Weather in Delhi
{"action":"weather","city":"Delhi"}

User: What is the temperature now?
{"action":"weather"}

User: What's the weather?
{"action":"weather"}

User: Is it hot today?
{"action":"weather"}
User: What is the current time?
{"action":"current_time"}

User: What's the time?
{"action":"current_time"}

User: Tell me the time
{"action":"current_time"}

User: Current time
{"action":"current_time"}

User: What is today's date?
{"action":"current_date"}

User: Today's date
{"action":"current_date"}

User: Current date
{"action":"current_date"}

User: What is the current date and time?
{"action":"current_datetime"}

User: Date and time
{"action":"current_datetime"}

`;






    const decision = await callLLM([
        {
            role: "system",
            content: prompt
        },
        {
            role: "user",
            content: userMessage
        }
    ]);
    console.log("Raw Decision:");
    console.log(decision);

    return decision;
}

async function generateFinalResponse(
    userMessage,
    toolName,
    toolResult
) {

    return await callLLM([
        {
            role: "system",
            content: `You are a helpful assistant.

A tool has already been executed.

Tool: ${toolName}

Tool Result:

${toolResult}

Answer the user naturally.

Do not mention tools.
Do not mention internal processing.`
        },
        {
            role: "user",
            content: userMessage
        }
    ]);
}

app.post("/chat", async (req, res) => {

    try {

        const { message } = req.body;

        const decisionText =
            await decideAction(message);

        console.log(decisionText);

        let decision;

        try {
            decision = JSON.parse(decisionText);
        }
        catch {

            return res.json({
                reply: "Invalid JSON from decision LLM"
            });

        }


        // const toolResult =
        //     await executeTool(
        //         decision,
        //         message
        //     );
        // const toolResult =
        //     await executeDynamicAgent(message);

        // if (toolResult?.error) {

        //     return res.json({

        //         reply:
        //             toolResult.error

        //     });

        // }
        // if (toolResult) {

        //     const reply =
        //         await generateFinalResponse(

        //             message,

        //             toolResult.tool,

        //             toolResult.result

        //         );

        //     return res.json({

        //         reply

        //     });

        // }
        const reply =
    await runPlanningAgent(message);

return res.json({

    reply

});

        // Normal LLM
        const answer =
            await callLLM([
                {
                    role: "user",
                    content: message
                }
            ]);

        return res.json({
            reply: answer
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            reply: "Server Error"
        });

    }

});

app.get("/", (req, res) => {

    res.send("AI Agent Backend Running 🚀");

});
//await connectMCP();
await connectAllServers();

app.listen(3000, () => {

    console.log(
        "🚀 Server running at http://localhost:3000"
    );

});