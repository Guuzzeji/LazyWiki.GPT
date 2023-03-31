import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import searchWiki from "../fetch/duckduckgo.js";

const answerUserStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: "The answer to the user's question with citations of the source used to answer the question. Example of a citations: some text[^1](the website url).",
    best: "Should be a website url will most likely answer the user's question",
    sources: ["Should be a list of websites urls that were used to answer the user's question'"],
});

const promptTempQS = new PromptTemplate({
    template: "You are a AI name GPT and you should always write your answers in json, your job is to answer user questions using both your own knowledge and the information give to you by websites that are in a json format. Answer the user questions to the best of your ability. Keep your answer to the user question within 200 words. User question: {question}\n List of Websites in json: {websites-json-infomation}\n {format_instructions}",
    inputVariables: ["question", "websites-json-infomation"],
    partialVariables: { format_instructions: answerUserStruct.getFormatInstructions() },
});

async function main() {
    let links = await searchWiki("what is vslam");

    const input = await promptTempQS.format({
        question: "what is vslam",
        "websites-json-infomation": JSON.stringify(links)
    });

    console.log(JSON.stringify(input));
}

main();