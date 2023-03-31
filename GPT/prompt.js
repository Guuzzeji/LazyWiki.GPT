import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import searchWiki from "../fetch/duckduckgo.js";

const answerUserStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: "The answer to the user's question with citations of the source used to answer the question. Example of a citations: some text[^1](the website url used to answer the question in some text). If you could not answer the user's question then explain why.",
    best: "Should be a website url will most likely answer the user's question. If you could not answer the user's question then leave this blank",
    sources: ["Should be a list of websites urls that were used to answer the user's question in the same order of citations. For example: citations [^1] in the answer should be the first url in the list. If you could not answer the user's question then leave this blank"],
});

const promptTempQS = new PromptTemplate({
    template: "You are a AI name GPT and you should always write your answers in json. Your job is to answer user's questions using both your own knowledge and the information give to you by the websites that are in a json format. Answer the user questions to the best of your ability. Keep your answer to the user question within 200 words. User question: {question}\n List of websites in json: {websites-json-infomation}\n {format_instructions}",
    inputVariables: ["question", "websites-json-infomation"],
    partialVariables: { format_instructions: answerUserStruct.getFormatInstructions() },
});


export default async function createPrompt(question) {
    let links = await searchWiki("what is vslam");

    const input = await promptTempQS.format({
        question: "what is vslam",
        "websites-json-infomation": JSON.stringify(links)
    });

    return JSON.stringify(input);
}
