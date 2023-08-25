import { encoding_for_model } from "@dqbd/tiktoken";

// base on https://blog.devgenius.io/how-to-get-around-openai-gpt-3-token-limits-b11583691b32
// Used to chunk text base on token size / limt of a model
function chunkText({ modelType = "gpt-3.5-turbo", text, chunkSize, overlap }) {
    const model = encoding_for_model(modelType);
    let tokens = model.encode(text);

    if (tokens.length <= chunkSize) {
        return [text];
    }

    let result = [];

    let chunkIndex = 0;
    for (let i = 0; i < tokens.length / (chunkSize + overlap); i++) {
        let startIndex = (chunkIndex - overlap) > 0 ? chunkIndex - overlap : 0;
        let decodeText = new TextDecoder().decode(model.decode(tokens.slice(startIndex, chunkIndex + chunkSize)));
        chunkIndex += chunkSize;
        result.push(decodeText.replaceAll("\n", " "));
    }

    model.free();
    return result;
};

// Checking to see if prompt is not hiting max token size
function checkTextSize({ modelType = "gpt-3.5-turbo", text, tokenLength }) {
    const model = encoding_for_model(modelType);
    let tokens = model.encode(text);

    if (tokens.length <= tokenLength) {
        model.free();
        return false;
    }

    model.free();
    return true;
};

export { chunkText, checkTextSize };