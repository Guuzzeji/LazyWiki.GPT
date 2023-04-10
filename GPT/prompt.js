import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import searchWiki from "../fetch/wiki-search.js";

const answerUserStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Provide answer with source citation in this format: some text[^1](website url). Answer limit is 500 words. Write "I don't know" if unable to answer. Avoid using double quotes in answer.`,
    best: "Suggest the most probable website URL from the provided list to answer the user's question. Leave blank if unable to answer.",
    sources: ["Provide a list of website URLs from the given list that were used to answer the user's question in the order of citations. If you could not answer the question, leave this blank."],
});

const promptTempQS = new PromptTemplate({
    template: `AI GPT answers user questions using given websites only. Use most useful websites provided and write answers in JSON format. \n User question: {question} \n Websites: {websites} \n {format_instructions}`,
    inputVariables: ["question", "websites"],
    partialVariables: { format_instructions: answerUserStruct.getFormatInstructions() },
});

const searchStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Provide answer with source citation in this format: some text[^1](website url). Answer limit is 500 words. Write "I don't know" if unable to answer. Avoid using double quotes in answer.`,
    best: "Suggest the most probable website URL from the provided list to answer the user's question. Leave blank if unable to answer.",
    sources: ["Provide a list of website URLs from the given list that were used to answer the user's question in the order of citations. If you could not answer the question, leave this blank."],
});

const promptSearchWikiPage = new PromptTemplate({
    template: `AI GPT select the best section from a wikipedia ariticle that will answer the user questions. You can only select from the list of wikipedia articles sections given to you. \n User question: {question} \n Wikipedia ariticle Name: {article_name} \n List of ariticle sections: {sections} \n {format_instructions}`,
    inputVariables: ["question", "article_name", "sections"],
    partialVariables: { format_instructions: searchStruct.getFormatInstructions() },
});



// TODO: Write prompt that will get GPT to return a section from a wikipedia page that will contains more infomation on the user's questions.

export default async function createPrompt(question) {
    let links = await searchWiki(question);

    const input = await promptTempQS.format({
        question: question,
        "websites": JSON.stringify(links)
    });

    return JSON.stringify(input);
}


// ! Testig prompt system with ChatGPT
// async function main() {
//     let prompt = await createPrompt("Who rule over the spanish empire during the 1800s");
//     console.log(prompt);
// }

// main();