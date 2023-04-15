import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from "openai";

import { chunkText, checkTextSize } from './token';

dotenv.config({ path: "./.env" });

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


function combineJSONText(json) {
    let result = "";

    result += json.title + "\n";

    for (let text in json.sections) {
        result += text + "\n";
    }

    return result;
}

async function createTextEmbedded(text) {
    let result = await openai.createEmbedding({
        input: text.replaceAll("/n", " "),
        model: "text-embedding-ada-002"
    });

    result.data[0].embedding;
}