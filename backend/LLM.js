import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { vectorStore } from "./rag.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
  //*getting input from user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const question = await rl.question("You: ");
    if (question === "/bye") {
      break;
    }

    //* retrieval
    const relevantChunks = await vectorStore.similaritySearch(question, 5);
    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");
    console.log(context);

    const SYSTEM_PROMPT = `
          You are a strict company policy assistant.

          Rules:
          1. Answer ONLY from the provided context.
          2. If the answer is not explicitly written in the context, say "I don't know."
          3. Do not assume or generate information.
          4. Keep answers short and factual.
`;

    const userQuery = `Question: ${question}
        Relevant context: ${context}
        Answer:`;

    //*LLM setup
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    console.log(`Assistant: ${completion.choices[0].message.content}`);
  }

  rl.close();
}
