import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from "openai";

dotenv.config({ path: "./.env" });

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Look at https://github.com/openai/openai-node/issues/107
export default async function (promptStr) {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: promptStr }],
        max_tokens: parseInt(process.env.OPENAI_API_MAX_TOKENS),
        temperature: 0.1,
        stream: false,
    });

    return completion;
}

