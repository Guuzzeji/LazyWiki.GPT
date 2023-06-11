import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import searchWiki from "../../fetch/wikisearch.js";

//! Answer general user question
const answer = StructuredOutputParser.fromNamesAndDescriptions({
    wikiURLS: ["This should be a JS array. If website list above is empty leave this array empty. Don't put quotes around this. Select websites out of the list given to you that can futher answer the user's question. Select 1 to 4 websites and place them here."]
});

const prompt = new PromptTemplate({
    template: `\nUser question:{question} \nWebsites:{websites}\n Only used websites that are given to you in the list above. AI GPT select the top 5 websites out of the list of websites above that can answer the user's question. Do not explain anything. Use the most useful websites provided and write answers in JSON format. {format_instructions}`,
    inputVariables: ["question", "websites"],
    partialVariables: { format_instructions: answer.getFormatInstructions() },
});

export async function createGeneralQS(question) {
    return {
        topicQueryPrompt: `Find the main key topic within this question that can be used to search for a related Wikipedia article. Only write the topic, nothing else. Question: ${question}`,
        genWikiSearchPrompt: async function (searhQuery) {
            let links = await searchWiki(searhQuery);
            return await prompt.format({
                question: question,
                "websites": JSON.stringify(links)
            });
        }
    };
}