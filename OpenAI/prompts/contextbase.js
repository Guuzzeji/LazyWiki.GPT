import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

//! Answer user question with more context
const answer = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `Your answer to the user question. Use Markdown text to help answer the question. If you cannot answer the user questions write "I don't know" and explain why you cannot answer the question.`,
});

const prompt = new PromptTemplate({
    template: `AI GPT base on the context given to you and your knowledge of the world, answer the user questions as best as possible. \n User question: {question} \n Context: {context} \n {format_instructions}`,
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