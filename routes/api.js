import express from 'express';
import bodyParser from 'body-parser';
const router = express.Router();
router.use(bodyParser.json());

import { createGeneralQS, createContextQS, createSearchWikiQS } from '../openai/prompts/index.js';
import { createTextEmbedding, searchEmbedding } from '../openai/embedding.js';
import GPT from '../openai/gpt.js';

import { getWikiPage } from '../wiki-fetch/wikipage.js';

import requestLimter from './request-limiter.js';
import { cleanGPTResponse, cleanWikiURL, sleep } from "./utils.js";


router.post('/answer/context', requestLimter, async (req, res) => {

    /**
     * What request body should look like
     * { 
     *  "question" : "some type of question goes here"
     * }
     */

    if (req.body == null || req.body.question == null || req.body.question == undefined) {
        res.status(500).send({ error: "bad body" });
    }

    let jsonReq = req.body;
    let userPrompt = await createGeneralQS(jsonReq.question);

    // ! Converting question to search quary
    let searhQuery = await GPT(userPrompt.topicQueryPrompt);
    searhQuery = searhQuery.data.choices[0].message.content;
    let promptSearch = await userPrompt.genWikiSearchPrompt(searhQuery);

    //console.log(searhQuery);

    // ! Making GPT pick the top wiki pages from search engine
    let topWikiPagesFromGPT = await GPT(promptSearch);
    topWikiPagesFromGPT = cleanGPTResponse(topWikiPagesFromGPT.data.choices[0].message.content);

    // console.log(promptSearch);
    // console.log(topWikiPagesFromGPT);

    let wikiPages = new Map();
    let subTitles = [];
    for (let i = 0; i < topWikiPagesFromGPT.wikiURLS.length; i++) {
        let page = await getWikiPage(cleanWikiURL(topWikiPagesFromGPT.wikiURLS[i]));
        wikiPages.set(page.title, page);

        page.mapSections.forEach(function (value, key, map) {
            subTitles.push(key);
        });
    }

    // console.log(wikiPages);
    // console.log(subTitles);

    // * Have to sleep in order to not go over OpenAI rate limt (it 3 request a minute)
    // * Note can remove this because moving alway from free trial of GPT
    await sleep(1000 * 60);

    // ! Have GPT pick the best subtitle from all Wiki-pages it picked it the first section
    let searchPrompt = await createSearchWikiQS(jsonReq.question, subTitles);
    let searchSeclectionFromGPT = await GPT(searchPrompt);
    searchSeclectionFromGPT = cleanGPTResponse(searchSeclectionFromGPT.data.choices[0].message.content).answers;

    // ! Getting most revelent text that will likely answer user question
    let revelentText = [];
    let pageIter = wikiPages.entries();

    // looping every page
    for (let page of pageIter) {

        // Looping over titles selected by GPT
        for (let title in searchSeclectionFromGPT) {

            // Getting and emebeding those seclections to be used for prompt
            let text = page[1].mapSections.get(searchSeclectionFromGPT[title]);
            if (text != undefined) {
                let emebeding = await createTextEmbedding(text.tokenText);
                let lookup = await searchEmbedding(jsonReq.question, emebeding);
                revelentText.push({
                    text: text.tokenText[lookup.index],
                    wikiTitle: page[0],
                    wikiSubTitle: searchSeclectionFromGPT[title]
                });
            }
        }
    }

    //console.log(revelentText);

    let contextPrompt = await createContextQS(jsonReq.question, revelentText.toString());
    let answerQSFromGPT = await GPT(contextPrompt);

    // ! Note should move to GPT functions to not have to clean answers from GPT to json
    answerQSFromGPT = cleanGPTResponse(answerQSFromGPT.data.choices[0].message.content).answers;

    // console.log(contextPrompt);
    // console.log(answerQSFromGPT);

    // Try to parse json from gpt
    res.send({
        answer: answerQSFromGPT,
        revelentText
    });
});

export { router };