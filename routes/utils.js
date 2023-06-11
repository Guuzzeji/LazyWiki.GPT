export function cleanGPTResponse(text) {
    try {
        let json = JSON.parse(text.replace("```json", "").replace("```", "").trim());
        return json;
    } catch {
        return text;
    }
}

export function cleanWikiURL(URL) {
    return URL.replace("https://en.wikipedia.org/wiki/", "")
        .replace("https://en.wikipedia.org//wiki/", "")
        .trim();
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}