const fetch = require('node-fetch');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

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

    return {
        title: pageData.lead.normalizedtitle,
        sections
    };
}

function htmlToText(html) {
    let fullText = "";

    let par = html.split("\n");

    for (let i = 0; i < par.length; i++) {
        let dom = new JSDOM(par[i]);
        let text = new Readability(dom.window.document).parse();

        // ! Note to self: Readability will not return a empty string, instead return null
        if (text != null) {
            fullText += "\n" + text.textContent;
        }
    }

    return fullText.trim();
}

async function main() {
    let page = await getWikiPage("windows 10");

    console.log(htmlToText(page.sections[0].text));
}

main();