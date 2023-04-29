import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import searchWiki from "../../fetch/wiki-search.js";

//! Answer general user question
const answer = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Provide answer with source citation in this format: some text[^1](website url). Don't Markdown to answer the question. Answer limit is 500 words. Write "I don't know" if you are unable to answer, along with a reason why you cannot answer the question. Avoid using double quotes in answer.`,
    best: "Suggest the most probable website URL from the provided list to answer the user's question.",
    sources: ["Provide a list of website URLs from the given to you list that were used to answer the user's question in the order of citations."],
    listBest: ["Select websites that can futher answer the user's question, select 2 to 4 websites and place them here."]
});

const prompt = new PromptTemplate({
    template: `AI GPT answer the user's question using given websites only. Use the most useful websites provided and write answers in JSON format. \n User question: {question} \n Websites: {websites} \n {format_instructions}`,
    inputVariables: ["question", "websites"],
    partialVariables: { format_instructions: answer.getFormatInstructions() },
});

export async function createGeneralQS(question) {
    let links = await searchWiki(question);

    const input = await prompt.format({
        question: question,
        "websites": JSON.stringify(links)
    });

    return JSON.stringify(input);
}