import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import searchWiki from "../fetch/wiki-search.js";

// Answer general user question
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

// Search Wiki page for good sections that will answer the user's question'
const searchStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Your answer should be from the list of ariticle sections titles. It should be a list of ariticle sections that will answer the user's question. Example: "History", "Corporate culture"`,
});

const promptSearchWikiPage = new PromptTemplate({
    template: `AI GPT select the best section from a wikipedia ariticle that will answer the user questions. You can only select from the list of wikipedia articles section titles given to you. \n User question: {question} \n Wikipedia ariticle Name: {article_name} \n List of ariticle sections titles: {sections} \n {format_instructions}`,
    inputVariables: ["question", "article_name", "sections"],
    partialVariables: { format_instructions: searchStruct.getFormatInstructions() },
});

// Answer user question with more context
const answerQSMoreContextStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Your answer to the user question. This should be at most 750 words`,
});

const promptUserQSMoreContext = new PromptTemplate({
    template: `AI GPT base on the context given to you and your own knowledge, answer the user questions. \n User question: {question} \n Context: {context} \n {format_instructions}`,
    inputVariables: ["question", "context"],
    partialVariables: { format_instructions: answerQSMoreContextStruct.getFormatInstructions() },
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