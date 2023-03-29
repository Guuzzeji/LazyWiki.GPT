const { encoding_for_model } = require("@dqbd/tiktoken");

// base on https://blog.devgenius.io/how-to-get-around-openai-gpt-3-token-limits-b11583691b32

module.exports.chunkTokens = function chunkTokens({ modelType, text, chunkSize, overlap }) {
    const model = encoding_for_model(modelType);
    let tokens = model.encode(text);

    if (tokens.length <= chunkSize) {
        return [text];
    }

    let result = [];

    let index = 0;
    for (let i = 0; i < tokens.length / (chunkSize + overlap); i++) {
        let decodeText = new TextDecoder().decode(model.decode(tokens.slice(index - overlap, index + chunkSize)));
        result.push(decodeText);
        index += chunkSize;
    }

    model.free();
    return result;
};

module.exports.checkTokenSize = function chunkTokens({ modelType, text, tokenLength }) {
    const model = encoding_for_model(modelType);
    let tokens = model.encode(text);

    if (tokens.length <= tokenLength) {
        return false;
    }

    return true;
};