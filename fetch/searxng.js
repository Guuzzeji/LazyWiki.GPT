import fetch from 'node-fetch';
import randomUseragent from 'random-useragent';

import removeStopWords from './stop-word.js';

// Look at this for more servers: https://searx.space/
// Note: look with servers witha v html style (vanila)
// ! Note to self: may have to setup a custom searxng server using docker in order to use search engine
const searxngServer = "https://search.sapti.me/";

export default async function searchWiki(str) {
    let encodeStr = encodeURIComponent(removeStopWords(str));

    let jsonPage = await fetch(`https://search.sapti.me/search?q=site:en.wikipedia.org%20${encodeStr}&category_general=1&pageno=1&language=en-US&time_range=&safesearch=2&format=json"`, {
        method: 'GET',
        headers: {
            "User-Agent": randomUseragent.getRandom()
        },
    }).
        then((response) => {
            return response.json();
        }).then((data) => {
            return data;
        });

    let jsonPages = [];

    // TODO: Write parser that breaks jsonPages into format used for duckduckgo
    for (let i = 0; i < ((totalPages.length < 3) ? 3 : totalPages.length); i++) {
        console.log(i);
        jsonPages.push({
            title: totalPages[i].querySelector(".result__title").textContent.trim(),
            link: `https://${totalPages[i].querySelector(".result__url").textContent.trim()}`,
            snippet: totalPages[i].querySelector(".result__snippet").textContent.trim()
        });
    }

    return jsonPages;
};
