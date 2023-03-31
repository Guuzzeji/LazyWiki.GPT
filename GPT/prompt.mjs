import { PromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

const answerUserStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: "The answer to the user's question with citations of the source used to answer the question. Example of a citations: some text [1](the website url).",
});

const identifyWebsitesStruct = StructuredOutputParser.fromNamesAndDescriptions({
    top: "The website that will most likely answer the user's question",
    sources: ["Other websites that could also answer the user's question'"],
});


const promptWikiPages = new PromptTemplate({
    template:
        "Answer the users question using Wikipedia website' \n{format_instructions}\n{question}",
    inputVariables: ["question"],
    partialVariables: { format_instructions: answerQuestion.getFormatInstructions() },
});




async function main() {

    const input = await promptWikiPages.format({
        question: "Describe the vslam",
    });

    console.log(JSON.stringify(input));

    console.log(removeStopWords("Describe the vslam"));
}

main();