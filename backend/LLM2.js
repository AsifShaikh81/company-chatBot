
import Groq from "groq-sdk";
import { vectorStore } from "./rag.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat(userMessage) {
  

  
    

    //* retrieval
    const relevantChunks = await vectorStore.similaritySearch(userMessage, 5);
    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");
    // console.log(context);

    const SYSTEM_PROMPT = [
      {
          role:"system",
          content:`You are a strict company policy assistant.

          Rules:
          1. Answer ONLY from the provided context.
          2. If the answer is not explicitly written in the context, say "I don't know."
          3. Do not assume or generate information.
          4. Keep answers short and factual.`
      }


    ]

    const userQuery = `Question: ${userMessage}
        Relevant context: ${context}
        Answer:`;
      
    const messages = SYSTEM_PROMPT
    messages.push({
      role:"user",
      content:userQuery
    })

    //*LLM call
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
    });

    const reply = completion.choices[0].message.content
      console.log(`Assistant: ${reply}`);
      return reply

   
  


}
