import * as dotenv from 'dotenv';
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const modelType = process.env.OPENAI_API_MODEL;

const openai = new OpenAIApi(configuration);

// Look at https://github.com/openai/openai-node/issues/107
export default async function (promptStr) {
    const completion = await openai.createCompletion({
        "model": modelType,
        "prompt": promptStr,
        "max_tokens": 100,
        "temperature": 0,
        "top_p": 1,
        "n": 1,
        "stream": true,
        "logprobs": null,
        "stop": "\n"
    }, { responseType: "stream" });

    return completion;
}

