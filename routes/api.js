import express from 'express';

const router = express.Router();

router.get('/question?=:qs', (req, res) => {
    // TODO connect to openai api in gpt folder
    res.send(req.params.qs);
});

export { router };