import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from "openai";
import cosineSimilarity from "compute-cosine-similarity";

dotenv.config({ path: "./.env" });

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function createTextEmbedding(wikipage) {
    for (let x = 0; x < wikipage.length; x++) {
        let section = wikipage[x];

        let vectors = [];

        for (let y = 0; y < section.tokenText.length; y++) {
            let result = await openai.createEmbedding({
                input: section.tokenText[y],
                model: "text-embedding-ada-002"
            });

            vectors.push(result.data.data[0].embedding);
        }

        section["embedding"] = vectors;
    }

    return wikipage;
}

async function searchEmbedding(search, wikipage) {
    let result = await openai.createEmbedding({
        input: search,
        model: "text-embedding-ada-002"
    });

    let searchQuery = result.data.data[0].embedding;

    let maxPercent = { page: wikipage[0], similarity: 0, embeddingIndex: 0 };

    for (let x = 0; x < wikipage.length; x++) {
        let page = wikipage[x];

        for (let y = 0; y < page.embedding.length; y++) {
            let similarity = cosineSimilarity(page.embedding[y], searchQuery);

            if (maxPercent.similarity < similarity) {
                maxPercent.page = page;
                maxPercent.similarity = similarity;
                maxPercent.embeddingIndex = y;
            }
        }
    }

    return maxPercent;
}

export { searchEmbedding, createTextEmbedding };