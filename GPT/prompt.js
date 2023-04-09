import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import searchWiki from "../fetch/wiki-search.js";

// const answerUserStruct = StructuredOutputParser.fromNamesAndDescriptions({
//     answers: `The answer to the user's question with citations of the source used to answer the question. Always write your citations in this format: some text[^1](the website url used to answer the question in some text). Your answer should be 500 words or less. If you cannot answer the user's question the write "I don't know" as your answer". Never use double quotes in your answer.`,
//     best: "Should be a website url from the given list of websites in the prompt  will most likely answer the user's question. If you could not answer the user's question then leave this blank",
//     sources: ["Should be a list of websites urls that are from the given list of websites in the prompt that were used to answer the user's question in the same order of citations. For example: citations [^1] in the answer should be the first url in the list. If you could not answer the user's question then leave this blank"],
// });

const answerUserStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Provide answer with source citation in this format: some text[^1](website url). Answer limit is 500 words. Write "I don't know" if unable to answer. Avoid using double quotes in answer.`,
    best: "Suggest the most probable website URL from the provided list to answer the user's question. Leave blank if unable to answer.",
    sources: ["Provide a list of website URLs from the given list that were used to answer the user's question in the order of citations. If you could not answer the question, leave this blank."],
});

// const promptTempQS = new PromptTemplate({
//     template: `You are a AI name GPT and you should always write your answers in json. Your job is to answer user's questions using both your own knowledge and only the information give to you by the list of websites define below this text. Only use the websites that are the most useful in answering the user's questions and do not use any websites that have not been given to you.\nUser question: {question} \n List of Websites: {websites-json-infomation} \n{format_instructions}`,
//     inputVariables: ["question", "websites-json-infomation"],
//     partialVariables: { format_instructions: answerUserStruct.getFormatInstructions() },
// });

const promptTempQS = new PromptTemplate({
    template: `AI GPT answers user questions using given websites only. Use most useful websites provided and write answers in JSON format. \n User question: {question} \n Websites: {websites} \n {format_instructions}`,
    inputVariables: ["question", "websites"],
    partialVariables: { format_instructions: answerUserStruct.getFormatInstructions() },
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