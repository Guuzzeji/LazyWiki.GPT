import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

import removeStopWords from './stop-word.js';

interface SearchResult {
    title: string;
    link: string;
    snippet: string;
}

export default async function searchWiki(str: string): Promise<SearchResult[]> {
    let encodeStr = encodeURIComponent(removeStopWords(str));

    let rawHtml = await fetch(`https://en.wikipedia.org/w/index.php?search=${encodeStr}&title=Special:Search&profile=advanced&fulltext=1&ns0=1"`).
        then((response) => {
            return response.text();
        }).then((data) => {
            return data;
        });

    let searchResultsJson: SearchResult[] = [];

    let parseHtml = new JSDOM(rawHtml).window.document;
    let pageResultList = parseHtml
        .querySelectorAll(".searchResultImage-text");

    // Loops and gets the top 5 results from wiki search
    for (let i = 0; i < ((pageResultList.length > 5) ? 5 : pageResultList.length); i++) {
        searchResultsJson.push({
            title: pageResultList[i].querySelector(".mw-search-result-heading").textContent.trim(),
            link: `https://en.wikipedia.org/${pageResultList[i]
                .querySelector(".mw-search-result-heading")
                .querySelector("a")
                .attributes
                .getNamedItem("href")
                .textContent}`,
            snippet: pageResultList[i].querySelector(".searchresult").textContent.trim()
        });
    }

    return searchResultsJson;
};
