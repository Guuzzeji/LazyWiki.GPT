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
    sections.unshift(pageData.lead.sections[0]);

    return {
        title: pageData.lead.normalizedtitle,
        sections
    };
}
