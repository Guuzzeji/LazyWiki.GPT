import express from 'express';
import bodyParser from 'body-parser';

import { createGeneralQS, createContextQS } from '../GPT/prompt.js';
import { createTextEmbedding, searchEmbedding } from '../GPT/embedding.js';
import openaiApi from '../GPT/openai-api.js';

import { getWikiPage } from '../fetch/wiki-page.js';

import requestLimter from './request-limiter.js';

const router = express.Router();
router.use(bodyParser.json());

router.post('/general-question', requestLimter, async (req, res) => {
    let jsonReq = req.body;
    let prompt = await createGeneralQS(jsonReq.question);
    let openAIRes = await openaiApi(prompt);

    console.log(prompt);
    console.log(openAIRes.data);

    // Try to parse json from gpt
    try {
        let resJson = JSON.parse(openAIRes.data.choices[0].message.content.replace("```json", "").replace("```", ""));
        res.send(resJson);
    } catch {
        res.send(openAIRes.data.choices[0].message.content);
    }
});

router.post('/wikipage-question', requestLimter, async (req, res) => {
    let jsonReq = req.body;

    let page = await getWikiPage(jsonReq.wikiTitle);
    page.sections = await createTextEmbedding(page.sections);
    let wikiText = await searchEmbedding(jsonReq.question, page.sections);

    let prompt = await createContextQS(jsonReq.question, wikiText.page.tokenText[wikiText.embeddingIndex]);
    let openAIRes = await openaiApi(prompt);

    console.log(prompt);
    console.log(openAIRes.data);

    // Try to parse json from gpt
    try {
        let resJson = JSON.parse(openAIRes.data.choices[0].message.content.replace("```json", "").replace("```", ""));
        res.send(resJson);
    } catch {
        res.send(openAIRes.data.choices[0].message.content);
    }
});

export { router };