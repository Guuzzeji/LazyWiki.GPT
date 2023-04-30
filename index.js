import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { router as api } from './routes/api.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use("/API", api);

// Used for react client
// from: https://levelup.gitconnected.com/how-to-render-react-app-using-express-server-in-node-js-a428ec4dfe2b
// also helpful: https://stackoverflow.com/questions/40262513/how-to-disable-suppress-errors-from-libraries-in-typescript
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
