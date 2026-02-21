import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
// import { OpenAIEmbeddings } from '@langchain/openai';
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

import { PineconeStore } from '@langchain/pinecone';
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone';
 
//*note
 // api key will automatically retrive from env file , u dont need to pass it manually everywhere

//* step 4 :using langchain embedding model 
/* https://docs.langchain.com/oss/javascript/integrations/vectorstores#openai
const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
     dimensions : u can set custom dimension
    apiKey:process.env.OPENAI_API_KEY  // optional
});
 */
const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",

});

//* step 5: using langchain/pinecone DB to store vectors
//https://docs.langchain.com/oss/javascript/integrations/vectorstores/pinecone
const pinecone = new PineconeClient({apiKey:process.env.PINECONE_API_KEY}); // optional api key

//*for pincone index read below doc
//https://app.pinecone.io/organizations/-OlpstkGj5g3n3HDm1fH/projects/67f77fd9-aee3-4028-86c2-61d21466fcd6/index-quickstart
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
 
export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
});

export async function indexTheDocument(filePath) {
   //* step 1 : loading document -pdf
   //https://docs.langchain.com/oss/javascript/integrations/document_loaders/file_loaders/pdf
    const loader = new PDFLoader(filePath, { splitPages: false });
    const doc = await loader.load();
     
    // console.log("pdf doc: ",doc)
    // console.log("pdf doc: ",doc[0].pageContent)
    // console.log("pdf doc length check : ",doc.length)

    //*step 2: chunking doc 
    //https://docs.langchain.com/oss/javascript/integrations/splitters
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 300,
        chunkOverlap: 100,
    });

    const texts = await textSplitter.splitText(doc[0].pageContent);
    //  console.log("chunks: ", texts)
    //  console.log("chunks len: ", texts.length)
    const documents = texts.map((chunk) => {
        return {
            pageContent: chunk,
            metadata: doc[0].metadata,
        };
    });
    //*step 5 : using vector store (pinecone)
    await vectorStore.addDocuments(documents);
    // console.log(documents);
}
