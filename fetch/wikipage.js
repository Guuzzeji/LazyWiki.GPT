//! Note: would be more useful if we are using a embeding model
// https://platform.openai.com/docs/guides/embeddings/use-cases

import fetch from 'node-fetch';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

import { chunkText } from '../OpenAI/token.js';

// Useless text that isn't helpful
const BLACKLIST_TITLES = ["See also", "Notes", "References", "Bibliography", "Further reading", "External links"];

async function getWikiPage(pageTitle) {
    let urlTitle = encodeURIComponent(pageTitle);

    let pageData = await fetch(`https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${urlTitle}`)
        .then((response) => {
            return response.json();
        }).then((data) => {
            return data;
        });

    let sections = pageData.remaining.sections;

    // Making the summary of wikipage it own section
    sections.unshift({
        id: 0,
        line: "Overview",
        toclevel: 1,
        text: pageData.lead.sections[0].text,
    });

    // Remove uneeded sections and anything that has a small amount of text
    for (let i = 0; i < sections.length; i++) {
        for (let title of BLACKLIST_TITLES) {
            if ((sections[i] != null && sections[i].line == title)
                || (sections[i] != undefined && sections[i].text.length < 250)) {
                sections.splice(i, 1);
            }
        }
    }

    // Converting array into HashMap for better lookup times
    let mapSections = new Map();
    for (let i = 0; i < sections.length; i++) {
        let chunks = chunkText({
            text: htmlToText(sections[i].text),
            chunkSize: 200,
            overlap: 100
        });
        sections[i]["tokenText"] = chunks;

        mapSections.set(sections[i].line, { text: sections[i].text, tokenText: sections[i].tokenText });
    }

    return {
        title: pageData.lead.normalizedtitle,
        mapSections
    };
};

// Used to convert html tags giving us the raw text of the page
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