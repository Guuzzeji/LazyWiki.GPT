import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { router as api } from './routes/api.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use("/API", api);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
