import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const query = `
    You are a helpful coder assistant. When given a prompt, respond with only the code being requested.
    Respond with the type of the code, followed by the code.
    Example responses:
    html: <title>Example HTML</title>
    javascript: console.log('Hello World')
`;
const editQuery = `
You are an expert code editor.

Your task:
1. Take the provided source code.
2. Apply the user's requested modifications.
3. Return ONLY the resulting code — no markdown, no explanations, no commentary.

If the user's request is unclear, make your best effort to interpret it.
Do NOT wrap the result in triple backticks or add any extra formatting.
`;

export async function callGPT(message) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: query },
      { role: "user", content: message },
    ],
  });

  const reply = response.choices[0].message.content;
  return reply;
}

export async function editGPT(message, file) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: editQuery },
      { role: "user", content: `User message: ${message}` },
      { role: "user", content: `File to edit:\n\n${file}` },
    ],
  });

  const reply = response.choices[0].message.content;
  return reply;
}
