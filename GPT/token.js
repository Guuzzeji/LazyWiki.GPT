import { encoding_for_model } from "@dqbd/tiktoken";

// base on https://blog.devgenius.io/how-to-get-around-openai-gpt-3-token-limits-b11583691b32
function chunkText({ modelType, text, chunkSize, overlap }) {
    const model = encoding_for_model(modelType);
    let tokens = model.encode(text);

    if (tokens.length <= chunkSize) {
        return [text];
    }

    let result = [];

    for (let i = 0; i < tokens.length / (chunkSize + overlap); i += chunkSize) {
        let decodeText = new TextDecoder().decode(model.decode(tokens.slice(i - overlap, i + chunkSize)));
        result.push(decodeText);
    }

    model.free();
    return result;
};

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