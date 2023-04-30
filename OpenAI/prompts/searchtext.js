import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

//! Search Wiki page for good sections that will answer the user's question'
const answer = StructuredOutputParser.fromNamesAndDescriptions({
    answers: [`Your answer should be from the list of ariticle sections titles. It should be a list of ariticle sections that will answer the user's question. At max you can only select 5 articles section titles.Example: "History", "Corporate culture"`],
});

const prompt = new PromptTemplate({
    template: `AI GPT select the best sections from a wikipedia ariticle that will answer the user questions. You can only select from the list of wikipedia articles section titles given to you. Always write your Answer in JSON format as shown. \n User question: {question} \n List of ariticle sections titles: {sections} \n JSON format: {format_instructions}`,
    inputVariables: ["question", "sections"],
    partialVariables: { format_instructions: answer.getFormatInstructions() },
});


export async function createSearchWikiQS(question, sections) {
    const input = await prompt.format({
        question: question,
        sections: sections
    });

    return JSON.stringify(input);
}
