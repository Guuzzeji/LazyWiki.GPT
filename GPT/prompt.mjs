import { PromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

const WikipageStrucutre = StructuredOutputParser.fromNamesAndDescriptions({
    answer: "sources used to answer the user's question, should be a Wikipedia website url.",
});

const answerQuestion = StructuredOutputParser.fromNamesAndDescriptions({
    answer: "answer to the user's question with annotation for Wikipedia websites used. Example: some text {1}",
    source: [
        "sources used to answer the user's question, should be a Wikipedia website url.",
    ]
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