import express from 'express';
import bodyParser from 'body-parser';

import { createGeneralQS, createContextQS } from '../GPT/prompt.js';
import openaiApi from '../GPT/openai-api.js';

import requestLimter from './request-limiter.js';

const router = express.Router();
router.use(bodyParser.json());

router.post('/general_question', requestLimter, async (req, res) => {
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

router.post('/wikipage_question', requestLimter, async (req, res) => {
    let jsonReq = req.body;

    let page = await getWikiPage(jsonReq.wikiTitle);
    page.sections = await createTextEmbedding(page.sections);
    let wikiText = await searchEmbedding(jsonReq.question, page.sections);

    let prompt = await createContextQS(jsonReq.question, wikiText);
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