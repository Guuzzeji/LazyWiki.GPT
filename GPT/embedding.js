import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from "openai";

dotenv.config({ path: "./.env" });

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function createTextEmbedded(text) {
    let result = await openai.createEmbedding({
        input: text.replaceAll("/n", " "),
        model: "text-embedding-ada-002"
    });

    result.data[0].embedding;
}