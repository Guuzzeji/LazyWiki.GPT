import express from 'express';
import bodyParser from 'body-parser';

import { createGeneralQS, createContextQS, createSearchWikiQS } from '../OpenAI/prompts/index.js';
import { createTextEmbedding, searchEmbedding } from '../OpenAI/embedding.js';
import GPT from '../OpenAI/gpt.js';

import { getWikiPage } from '../fetch/wiki-page.js';
import requestLimter from './request-limiter.js';

const router = express.Router();
router.use(bodyParser.json());

function cleanGPTResponse(text) {
    try {
        let json = JSON.parse(text.replace("```json", "").replace("```", "").trim());
        return json;
    } catch {
        return text;
    }
}

function cleanWikiURL(URL) {
    return URL.replace("https://en.wikipedia.org/wiki/", "")
        .replace("https://en.wikipedia.org//wiki/", "")
        .trim();
}

router.post('/answer/general', requestLimter, async (req, res) => {
    let jsonReq = req.body;
    let prompt = await createGeneralQS(jsonReq.question);
    let openAIRes = await GPT(prompt);

    // console.log(prompt);
    // console.log(openAIRes.data);

    // Try to parse json from gpt
    res.send(cleanGPTResponse(openAIRes.data.choices[0].message.content));
});

router.post('/answer/context', requestLimter, async (req, res) => {
    let jsonReq = req.body;

    let pages = [];
    for (let i = 0; i < jsonReq.wikiURLS.length; i++) {
        pages.push(await getWikiPage(cleanWikiURL(jsonReq.wikiURLS[i])));
    }

    // console.log(pages);

    let subTitles = [];
    for (let i = 0; i < pages.length; i++) {
        for (let j = 0; j < pages[i].sections.length; j++) {
            subTitles.push(pages[i].sections[j].line);
        }
    }

    // console.log(subTitles);

    let searchPrompt = await createSearchWikiQS(jsonReq.question, subTitles);
    let gptSearchSelect = await GPT(searchPrompt);

    let topSearchSections = cleanGPTResponse(gptSearchSelect.data.choices[0].message.content);

    // console.log(topSearchSections);

    let revelentText = [];
    for (let i = 0; i < pages.length; i++) {
        for (let title in topSearchSections.answers) {
            for (let j = 0; j < pages[i].sections.length; j++) {
                if (pages[i].sections[j].line == topSearchSections.answers[title]) {
                    let emebeding = await createTextEmbedding(pages[i].sections[j].tokenText);
                    let wikiText = await searchEmbedding(jsonReq.question, emebeding);
                    revelentText.push(pages[i].sections[j].tokenText[wikiText.index]);
                }
            }
        }
    }

    console.log(revelentText);

    let contextPrompt = await createContextQS(jsonReq.question, revelentText.toString());
    let answerQS = await GPT(contextPrompt);

    console.log(prompt);
    console.log(answerQS.data);

    // Try to parse json from gpt
    res.send(cleanGPTResponse(answerQS.data.choices[0].message.content));
});

export { router };