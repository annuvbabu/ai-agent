import { callTool } from "../services/mcpClient.js";
import { getWeather } from "../tools/weather.js";
import { saveMemory, getMemory } from "../memory/memory.js";

export async function executeTool(decision) {

    switch (decision.action) {

        case "calculator": {

            const result = await callTool(
                "calculator",
                {
                    expression: decision.input
                }
            );

            return {
                tool: "calculator",
                result: `${decision.input} = ${result}`
            };
        }

        case "weather": {

            let city = decision.city;

            // If no city was supplied by the LLM,
            // try loading it from memory.
            if (!city) {
                city = getMemory("city");
            }

            if (!city) {
                return {
                    error: "I don't know your city yet. Tell me something like 'My city is Kochi'."
                };
            }

            const temperature = await getWeather(city);

            return {
                tool: "weather",
                result: `City: ${city}
Temperature: ${temperature}°C`
            };
        }

        case "save_memory": {

            saveMemory(
                decision.key,
                decision.value
            );

            return {
                tool: "memory",
                result: `I'll remember that your ${decision.key} is ${decision.value}.`
            };
        }

        case "get_memory": {

            const value = getMemory(decision.key);

            if (!value) {
                return {
                    error: `I don't know your ${decision.key} yet.`
                };
            }

            return {
                tool: "memory",
                result: `Your ${decision.key} is ${value}.`
            };
        }

        case "current_date": {

            const date = await callTool(
                "current_date",
                {}
            );

            return {
                tool: "date",
                result: date
            };
        }

        case "current_time": {

            const time = await callTool(
                "current_time",
                {}
            );

            return {
                tool: "time",
                result: time
            };
        }

        case "current_datetime": {

            const dateTime = await callTool(
                "current_datetime",
                {}
            );

            return {
                tool: "datetime",
                result: dateTime
            };
        }

        default:

            return null;
    }

}