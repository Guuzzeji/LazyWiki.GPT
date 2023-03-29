const { encoding_for_model } = require("@dqbd/tiktoken");

// base on https://blog.devgenius.io/how-to-get-around-openai-gpt-3-token-limits-b11583691b32

module.exports.chunkTokens = function chunkTokens({ modelType, text, chunkSize, overlap }) {
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

module.exports.checkTokenSize = function chunkTokens({ modelType, text, tokenLength }) {
    const model = encoding_for_model(modelType);
    let tokens = model.encode(text);

    if (tokens.length <= tokenLength) {
        return false;
    }

    return true;
};