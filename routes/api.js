import express from 'express';

import requestLimter from './request-limiter.js';

const router = express.Router();

router.get('/question=:qs', requestLimter, (req, res) => {
    // TODO connect to openai api in gpt folder
    res.send(req.params.qs);
});

export { router };