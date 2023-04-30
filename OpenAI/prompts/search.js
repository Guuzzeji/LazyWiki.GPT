import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import searchWiki from "../../fetch/wikisearch.js";

//! Answer general user question
const answer = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Provide answer with source citation in this format: some text[^1](website url). Answer limit is 500 words. Write "I don't know" if you are unable to answer, along with a reason why you cannot answer the question. Avoid using double quotes in answer.`,
    sources: ["Provide a list of website URLs from the given to you list that were used to answer the user's question in the order of citations"],
    listBest: ["Select websites out of the list given to you that can futher answer the user's question. Select 1 to 4 websites and place them here."]
});

const prompt = new PromptTemplate({
    template: `\nUser question:{question} \nWebsites:{websites}\n AI GPT answer the user's question using given websites only. Never use websites outside the websites provide to you in the list. Use the most useful websites provided and write answers in JSON format. {format_instructions}`,
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