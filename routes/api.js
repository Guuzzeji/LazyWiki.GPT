import express from 'express';
import bodyParser from 'body-parser';

import createPrompt from '../GPT/prompt.js';
import openaiApi from '../GPT/openai-api.js';

import requestLimter from './request-limiter.js';

const router = express.Router();
router.use(bodyParser.json());

router.get('/question=:qs', requestLimter, async (req, res) => {
    let prompt = await createPrompt(req.params.qs);
    let openAIRes = await openaiApi(prompt);

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