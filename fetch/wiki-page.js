import fetch from 'node-fetch';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

import { chunkText } from '../GPT/token.js';

//! Note: would be more useful if we are using a embeding model
// https://platform.openai.com/docs/guides/embeddings/use-cases
async function getWikiPage(pageTitle) {
    let urlTitle = encodeURIComponent(pageTitle);

    let pageData = await fetch(`https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${urlTitle}`)
        .then((response) => {
            return response.json();
        }).then((data) => {
            return data;
        });

    let sections = pageData.remaining.sections;
    sections.unshift({
        id: 0,
        line: "Overview",
        text: pageData.lead.sections[0].text
    });

    for (let i = 0; i < sections.length; i++) {
        let chunks = htmlToText(sections[i].text).split("\n");
        sections[i].text = chunks;
    }

    return {
        title: pageData.lead.normalizedtitle,
        sections
    };
};

function htmlToText(html) {
    let fullText = "";

    let par = html.split("\n");

    for (let i = 0; i < par.length; i++) {
        let dom = new JSDOM(par[i]).window.document;

        // ! Note to self: Readability will not return a empty string, instead return null
        if (isProbablyReaderable(dom)) {
            let text = new Readability(dom).parse();
            fullText += "\n" + text.textContent;
        }
    }

    return fullText.trim();
};

export { getWikiPage };