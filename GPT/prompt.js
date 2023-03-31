import { PromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

const answerUserStruct = StructuredOutputParser.fromNamesAndDescriptions({
    answers: `The answer to the user's question with citations of the 
    source used to answer the question. Example of a citations: some text [1](the website url).`,
    best: "The website that will most likely answer the user's question",
    sources: ["Other websites that could also answer the user's question'"],
});


const promptTempQS = new PromptTemplate({
    template: `You are a AI name GPT, your job is to answer user questions using both your own knowledge
    of the world and the infomations of websites that are given to you in a json format. 
    Answer the user questions to the best of your ability. Keep your answer to the user question within 500 words.
    \n{format_instructions} \n{question} \n{websites-json-infomation}`,
    inputVariables: ["question", "websites-json-infomation"],
    partialVariables: { format_instructions: answerUserStruct.getFormatInstructions() },
});

async function main() {

    const input = await promptTempQS.format({
        question: "Describe the vslam",
    });

    console.log(JSON.stringify(input));
}

main();