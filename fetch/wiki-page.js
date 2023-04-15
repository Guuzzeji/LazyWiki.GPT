import fetch from 'node-fetch';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

//! Note: would be more useful if we are using a embeding model
// https://platform.openai.com/docs/guides/embeddings/use-cases
async function getWikiPage(pageTitle) {
    let urlTitle = encodeURIComponent(pageTitle);

    let pageData = await fetch(`https://en.wikipedia.org/api/rest_v1/page/html/${urlTitle}`)
        .then((response) => {
            return response.text();
        }).then((data) => {
            return data;
        });

    return htmlToText(pageData);
};

function htmlToText(html) {
    let dom = new JSDOM(html).window.document;
    return new Readability(dom).parse().textContent.trim();
};

export { getWikiPage };