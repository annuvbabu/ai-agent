import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

const server = new McpServer({
    name: "Weather MCP",
    version: "1.0.0"
});

server.tool(

    "weather",

    "Get current weather of any city.",

    {
        city: z.string()
    },

    async ({ city }) => {

        try {

            // STEP 1
            // Convert city -> latitude longitude

            const geoResponse =
                await axios.get(

                    "https://geocoding-api.open-meteo.com/v1/search",

                    {

                        params: {

                            name: city,

                            count: 1

                        }

                    }

                );

            if (
                !geoResponse.data.results ||
                geoResponse.data.results.length === 0
            ) {

                return {

                    content: [

                        {

                            type: "text",

                            text: "City not found."

                        }

                    ]

                };

            }

            const location =
                geoResponse.data.results[0];

            const latitude =
                location.latitude;

            const longitude =
                location.longitude;

            // STEP 2
            // Fetch weather

            const weatherResponse =
                await axios.get(

                    "https://api.open-meteo.com/v1/forecast",

                    {

                        params: {

                            latitude,

                            longitude,

                            current: "temperature_2m,weather_code"

                        }

                    }

                );

            const current =
                weatherResponse.data.current;

            return {

                content: [

                    {

                        type: "text",

                        text:

`Current temperature in ${location.name}, ${location.country} is ${current.temperature_2m}°C.`

                    }

                ]

            };

        }

        catch (err) {

            console.error(err.message);

            return {

                content: [

                    {

                        type: "text",

                        text: "Unable to fetch weather."

                    }

                ]

            };

        }

    }

);

const transport =
    new StdioServerTransport();

await server.connect(transport);