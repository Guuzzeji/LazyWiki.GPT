import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from "openai";
import cosineSimilarity from "compute-cosine-similarity";

dotenv.config({ path: "./.env" });

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function createTextEmbedding(tokenText) {
    let vectors = [];

    for (let y = 0; y < tokenText.length; y++) {
        let result = await openai.createEmbedding({
            input: tokenText[y],
            model: "text-embedding-ada-002"
        });

        vectors.push(result.data.data[0].embedding);
    }

    return vectors;
}

async function searchEmbedding(search, embedding) {
    let result = await openai.createEmbedding({
        input: search,
        model: "text-embedding-ada-002"
    });

    let searchQuery = result.data.data[0].embedding;
    let maxPercent = { index: 0, similarity: 0, }; // Used to keep track of best embedding result

    for (let y = 0; y < embedding.length; y++) {
        let similarity = cosineSimilarity(embedding[y], searchQuery);

        if (maxPercent.similarity < similarity) {
            maxPercent.index = y;
            maxPercent.similarity = similarity;
        }
    }

    return maxPercent;
}

export { searchEmbedding, createTextEmbedding };