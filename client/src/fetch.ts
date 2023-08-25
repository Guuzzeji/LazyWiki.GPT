import { General, Context } from './components/Answer'

export async function fetchGeneralAnswer(question: string, callbackSuccess: Function, callbackFailure: Function): Promise<General | null> {
    return await fetch("API/answer/general", {
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
            let answer: General = {
                answer: data.answers,
                sources: data.sources,
                listBest: data.listBest
            }

            callbackSuccess(answer)
            return answer;
        })
        .catch((error) => {
            console.log(error)
            callbackFailure()
            return null;
        })
}