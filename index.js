import express from 'express';
import morgan from 'morgan';

import { router as api } from './routes/api.js';

const app = express();
const port = 3000;

app.use(morgan('combined'));
app.use("/API", api);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
