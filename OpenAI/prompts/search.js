import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import searchWiki from "../../wiki-fetch/wikisearch.js";

//! Answer general user question
const answer = StructuredOutputParser.fromNamesAndDescriptions({
    wikiURLS: ["This should be a JS array. If you cannot answer using the websites given to you or no websites were given to you, leave this blank. Don't put quotes around this. Select websites out of the list given to you that can futher answer the user's question. Select 1 to 4 websites and place them here. DO NOT USE WEBSITES THAT WERE NOT GIVEN TO YOU! ONLY SELECT WEBSITES THAT WERE NOT GIVEN TO YOU!"]
});

const prompt = new PromptTemplate({
    template: `AI GPT select the top 5 websites out of the list of websites given to you that can answer the user's question. Do not explain anything. DO NOT SELECT WEBSITES THAT WERE NOT GIVEN TO YOU! ONLY SELECT WEBSITES THAT WERE NOT GIVEN TO YOU!\nUser question: {question} \nWebsites: {websites}\n {format_instructions}`,
    inputVariables: ["question", "websites"],
    partialVariables: { format_instructions: answer.getFormatInstructions() },
});

export async function createGeneralQS(question) {
    return {
        topicQueryPrompt: `Find the main key topic within this question that can be used to search for a related Wikipedia article. Only write the topic, nothing else. Answer should be one word or 5 words at max. Question: ${question}`,
        genWikiSearchPrompt: async function (searhQuery) {
            let links = await searchWiki(searhQuery);
            return await prompt.format({
                question: question,
                "websites": JSON.stringify(links)
            });
        }
    };
}