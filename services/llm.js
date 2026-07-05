const BASE_URL =
    "https://api.groq.com/openai/v1/chat/completions";

const MODEL =
    "llama-3.1-8b-instant";

export async function callLLM(messages) {

    const response =
        await fetch(BASE_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization:
                    `Bearer ${process.env.GROQ_API_KEY}`
            },

            body: JSON.stringify({
                model: MODEL,
                temperature: 0,
                messages
            })
        });

    const data =
        await response.json();

    return data.choices[0].message.content;
}
export async function extractMemory(message) {

    const prompt = `
You extract personal information from user messages.

Return ONLY valid JSON.

If nothing should be remembered, return:

{}

Examples:

User: My name is Annu

{
    "name":"Annu"
}

User: I live in Trivandrum

{
    "city":"Trivandrum"
}

User: My profession is Software Engineer

{
    "profession":"Software Engineer"
}

User: My career goal is AI Engineer

{
    "career_goal":"AI Engineer"
}

User: My favorite language is JavaScript

{
    "favorite_language":"JavaScript"
}

User: I like React

{
    "likes":"React"
}
`;

    const response = await callLLM([
        {
            role: "system",
            content: prompt
        },
        {
            role: "user",
            content: message
        }
    ]);

    return response;
}