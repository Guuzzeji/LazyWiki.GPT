import fetch from 'node-fetch';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

import { chunkText } from '../GPT/token.js';

const BLACKLIST_TITLES = ["See also", "Notes", "References", "Bibliography", "Further reading", "External links"];

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
        toclevel: 1,
        text: pageData.lead.sections[0].text,
    });

    // Remove uneeded sections
    for (let i = 0; i < sections.length; i++) {
        for (let title of BLACKLIST_TITLES) {
            if (sections[i].line == title) {
                sections.splice(i, 1);
            }
        }

        if (sections[i].text.length < 250) {
            sections.splice(i, 1);
        }
    }

    for (let i = 0; i < sections.length; i++) {
        let chunks = chunkText({
            text: htmlToText(sections[i].text),
            chunkSize: 400,
            overlap: 150
        });
        sections[i]["tokenText"] = chunks;
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
        let text = new Readability(dom).parse();

        if (text != null) {
            fullText += "\n" + text.textContent;
        }
    }

    return fullText.trim();
};

export { getWikiPage };