const express = require('express');
const morgan = require('morgan');

const api = require('./routes/api');


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
