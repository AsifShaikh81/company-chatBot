/**
 * Implementation plan
 * Stage 1: Indexing 
 * 1. Load the document - pdf, text - completed
 * 2. Chunk the document - completed
 * 3. Generate vector embeddings - completed
 * 4. store vectors embeddings 

 *
 * Stage 2: Using the chatbot
 * 1. Setup LLM 
 * 2. Add retrieval step
 * 3. Pass input + relevant information to LLM
 * 4. Congratulations
 */

import {chat} from "./LLM.js"
import { indexTheDocument } from "./rag.js";

const filePath = "./AS-c.pdf";

async function start() {
  console.log("Indexing document... ⏳");
  await indexTheDocument(filePath);
  console.log("Indexing complete ✅");

  console.log("Starting chatbot... 🤖");
  await chat();
}

start()

// node --env-file=.env main.js