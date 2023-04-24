import express from 'express';
import bodyParser from 'body-parser';

import { createGeneralQS, createContextQS, createSearchWikiQS } from '../GPT/prompt.js';
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

    let subTitles = [];
    for (let i = 0; i < page.sections.length; i++) {
        subTitles.push(page.sections[i].line);
    }

    let searchPrompt = await createSearchWikiQS(jsonReq.question, subTitles);
    let openAISearchTitles = await openaiApi(searchPrompt);

    let topSearchSections = JSON.parse(openAISearchTitles.data.choices[0].message.content.replace("```json", "").replace("```", ""));

    console.log(topSearchSections);

    let revelentText = [];
    for (let i = 0; i < page.sections.length; i++) {
        for (let title in topSearchSections.answers) {
            if (page.sections[i].line == topSearchSections.answers[title]) {
                let emebeding = await createTextEmbedding(page.sections[i].tokenText);
                let wikiText = await searchEmbedding(jsonReq.question, emebeding);

                revelentText.push(page.sections[i].tokenText[wikiText.index]);
            }
        }
    }

    console.log(revelentText);

    let prompt = await createContextQS(jsonReq.question, revelentText.toString());
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