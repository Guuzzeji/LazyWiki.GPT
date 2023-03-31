const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

// base on https://stackoverflow.com/questions/37012469/duckduckgo-api-getting-search-results
module.exports.search = async function (str) {
    let encodeStr = encodeURIComponent(str.trim());

    let rawHtml = await fetch(`https://html.duckduckgo.com/html/?q=site:en.wikipedia.org%20${encodeStr}`).
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

    for (let i = 0; i < totalPages.length; i++) {
        jsonPages.push({
            title: totalPages[i].querySelector(".result__title").textContent.trim(),
            link: `https://${totalPages[i].querySelector(".result__url").textContent.trim()}`,
            snippet: totalPages[i].querySelector(".result__snippet").textContent.trim()
        });
    }

    return jsonPages;
};