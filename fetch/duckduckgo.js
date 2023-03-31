import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import randomUseragent from 'random-useragent';

import removeStopWords from './stop-word.js';

// base on https://stackoverflow.com/questions/37012469/duckduckgo-api-getting-search-results
export default async function searchWiki(str) {
    let encodeStr = encodeURIComponent(removeStopWords(str));

    let rawHtml = await fetch(`https://html.duckduckgo.com/html/?q=site:en.wikipedia.org%20"${encodeStr}"`, {
        method: 'GET',
        headers: {
            "User-Agent": randomUseragent.getRandom()
        },
    }).
        then((response) => {
            return response.text();
        }).then((data) => {
            return data;
        });

    let jsonPages = [];

    let parseHtml = new JSDOM(rawHtml).window.document;
    let totalPages = parseHtml
        .querySelector("#links")
        .querySelectorAll(".result.results_links.results_links_deep.web-result");

    for (let i = 0; i < ((totalPages.length > 5) ? 5 : totalPages.length); i++) {
        jsonPages.push({
            title: totalPages[i].querySelector(".result__title").textContent.trim(),
            link: `https://${totalPages[i].querySelector(".result__url").textContent.trim()}`,
            snippet: totalPages[i].querySelector(".result__snippet").textContent.trim()
        });
    }

    return jsonPages;
};
