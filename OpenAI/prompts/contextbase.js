import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

//! Answer user question with more context
const answer = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Your answer to the user question. Your answer should be between 200 to 750 words. If you cannot answer the user questions write "I don't know" and explain why you cannot answer the question. BUT YOU SHOULD ALWAYS TRY TO ANSWER THE USER'S QUESTION NO MATTER WHAT.`,
});

const prompt = new PromptTemplate({
    template: `\nContext: {context} \nUser question: {question} \nAI GPT base on the context given to you and your knowledge of the world, answer the user questions. If are asked to make a choice, make an arugment for every choice offered by the user. \n{format_instructions}`,
    inputVariables: ["question", "context"],
    partialVariables: { format_instructions: answer.getFormatInstructions() },
});

export async function createContextQS(question, text) {
    const input = await prompt.format({
        question: question,
        context: text
    });

    return JSON.stringify(input);
}