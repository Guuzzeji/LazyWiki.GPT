import { GPTAnswer } from './components/Answer'

export async function fetchAnswerFromAPI(question: string, callbackSuccess: Function, callbackFailure: Function): Promise<GPTAnswer | null> {
    return await fetch("API/answer/context", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question: question
        })
    })
        .then(response => { return response.json() })
        .then(function (data) {
            let answer: GPTAnswer = { ...data }
            callbackSuccess()
            return answer;
        })
        .catch((error) => {
            console.log(error)
            callbackFailure()
            return null;
        })
}