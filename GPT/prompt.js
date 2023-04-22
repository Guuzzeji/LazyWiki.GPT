import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import searchWiki from "../fetch/wiki-search.js";

//! Answer general user question
const answerUserStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Provide answer with source citation in this format: some text[^1](website url). Answer limit is 500 words. Write "I don't know" if you are unable to answer, along with a reason why you cannot answer the question. Avoid using double quotes in answer.`,
    best: "Suggest the most probable website URL from the provided list to answer the user's question. Leave blank if unable to answer.",
    sources: ["Provide a list of website URLs from the given list that were used to answer the user's question in the order of citations. If you could not answer the question, leave this blank."],
});

const promptTempQS = new PromptTemplate({
    template: `AI GPT answer the user's question using given websites only. Use the most useful websites provided and write answers in JSON format. \n User question: {question} \n Websites: {websites} \n {format_instructions}`,
    inputVariables: ["question", "websites"],
    partialVariables: { format_instructions: answerUserStruct.getFormatInstructions() },
});

//! Answer user question with more context
const answerQSMoreContextStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Your answer to the user question. This should be at most 750 words. If you cannot answer the user questions wirte "I don't know" and explain why you cannot answer the question.`,
});

const promptUserQSMoreContext = new PromptTemplate({
    template: `AI GPT base on the context given to you, answer the user questions. \n User question: {question} \n Context: {context} \n {format_instructions}`,
    inputVariables: ["question", "context"],
    partialVariables: { format_instructions: answerQSMoreContextStruct.getFormatInstructions() },
});


async function createGeneralQS(question) {
    let links = await searchWiki(question);

    const input = await promptTempQS.format({
        question: question,
        "websites": JSON.stringify(links)
    });

    return JSON.stringify(input);
}

async function createContextQS(question, text) {
    const input = await promptUserQSMoreContext.format({
        question: question,
        context: text
    });

    return JSON.stringify(input);
}


export { createGeneralQS, createContextQS };