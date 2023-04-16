import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from "openai";

import { chunkText, checkTextSize } from './token.js';

dotenv.config({ path: "../.env" });

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function createTextEmbedded(wikipage) {
    let embed = [];

    for (let x = 0; x < wikipage.sections.length - 5; x++) {
        let section = wikipage.sections[x];

        let vectors = [];

        for (let y = 0; y < section.text.length; y++) {
            let result = await openai.createEmbedding({
                input: section.text[y],
                model: "text-embedding-ada-002"
            });

            vectors.push(result.data.data[0].embedding);
        }

        embed.push({
            title: section.line,
            vectors: vectors
        });
    }

    return embed;
}

async function searchEmbedding(search) {
    let result = await openai.createEmbedding({
        input: search,
        model: "text-embedding-ada-002"
    });

    return result.data.data[0].embedding;
}

// Testing
import { getWikiPage } from '../fetch/wiki-page.js';
import fs from "fs";
import cosineSimilarity from "compute-cosine-similarity";

async function main() {
    // let page = await getWikiPage("Apple inc.");

    // console.log(page.sections[0].text.length);

    // fs.writeFileSync("./wikipage.json", JSON.stringify(page));

    let page = fs.readFileSync("./wikipage.json");
    page = JSON.parse(page);

    // let emebeding = await createTextEmbedded(page);

    // let jsonWiki = { embedding: emebeding };

    // fs.writeFileSync("./cacheData.json", JSON.stringify(jsonWiki));

    let result = await searchEmbedding("Who was the CEO in 1980");

    let jsonSearch = { embedding: result };

    fs.writeFileSync("./searchCacheData.json", JSON.stringify(jsonSearch));

    let data = fs.readFileSync("./cacheData.json");
    let search = fs.readFileSync("./searchCacheData.json");
    data = JSON.parse(data);
    search = JSON.parse(search);

    let max = { titleIndex: 0, indexVector: 0, similarity: 0 };
    for (let x = 0; x < data.embedding.length; x++) {
        let embedding = data.embedding[x];
        for (let y = 0; y < embedding.vectors.length; y++) {
            let similarity = cosineSimilarity(embedding.vectors[y], search.embedding);
            if (max.similarity < similarity) {
                max.titleIndex = x;
                max.indexVector = y;
                max.similarity = similarity;
            }
        }
    }

    console.log(max);
    console.log(page.sections[max.titleIndex].line);
    console.log(page.sections[max.titleIndex].text[max.indexVector]);
}

main();