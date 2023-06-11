import express from 'express';
import bodyParser from 'body-parser';

import { createGeneralQS, createContextQS, createSearchWikiQS } from '../OpenAI/prompts/index.js';
import { createTextEmbedding, searchEmbedding } from '../OpenAI/embedding.js';
import GPT from '../OpenAI/gpt.js';

import { getWikiPage } from '../fetch/wikipage.js';
import requestLimter from './request-limiter.js';

const router = express.Router();
router.use(bodyParser.json());

import { cleanGPTResponse, cleanWikiURL, sleep } from "./utils.js";

router.post('/answer/context', requestLimter, async (req, res) => {
    if (req.body == null || req.body.question == null || req.body.question == undefined) {
        res.status(500).send({ error: "bad body" });
    }

    let jsonReq = req.body;
    let prompt = await createGeneralQS(jsonReq.question);
    let searhQuery = await GPT(prompt.searhQueryPrompt);
    console.log(searhQuery.data.choices[0].message.content);
    let promptSearch = await prompt.genPrompt(searhQuery.data.choices[0].message.content);
    let openAIRes = await GPT(promptSearch);

    console.log(promptSearch);
    console.log(openAIRes.data.choices[0].message.content);

    // Try to parse json from gpt
    let topWikiPages = cleanGPTResponse(openAIRes.data.choices[0].message.content);

    console.log(topWikiPages);
    let pages = [];
    for (let i = 0; i < topWikiPages.wikiURLS.length; i++) {
        pages.push(await getWikiPage(cleanWikiURL(topWikiPages.wikiURLS[i])));
    }

    let subTitles = [];
    for (let i = 0; i < pages.length; i++) {
        for (let j = 0; j < pages[i].sections.length; j++) {
            subTitles.push(pages[i].sections[j].line);
        }
    }

    console.log(subTitles);

    console.log(pages);

    await sleep(1000 * 60);

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

    // console.log(revelentText);

    let contextPrompt = await createContextQS(jsonReq.question, revelentText.toString());
    let answerQS = await GPT(contextPrompt);

    // console.log(prompt);
    // console.log(answerQS.data);

    // Try to parse json from gpt
    res.send(cleanGPTResponse(answerQS.data.choices[0].message.content));
});

export { router };