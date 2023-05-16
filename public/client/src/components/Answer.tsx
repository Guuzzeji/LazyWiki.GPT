import React, { useState, useEffect } from 'react';
import { Button, Card, Collapse } from 'antd';
import ReactMarkdown from 'react-markdown'

export interface General {
    answer: string
    sources: string[]
    listBest: string[]
}

export interface Context {
    answer: string
    sources: string[]
}

function SourceItem(url: string) {
    return (
        <li>
            <a href={url}>{url}</a>
        </li>
    )
}

const { Panel } = Collapse;
export function GeneralAnswer(answer: General) {
    let sources = [];
    for (let i = 0; i < answer.sources.length; i++) {
        sources.push(SourceItem(answer.sources[i]))
    }

    let bestSources = [];
    for (let i = 0; i < answer.listBest.length; i++) {
        bestSources.push(SourceItem(answer.listBest[i]))
    }

    return (
        <Card style={{ maxWidth: "100%", minWidth: "300px", width: "30vw" }}>
            <p><ReactMarkdown children={answer.answer} /></p>

            <div style={{ marginTop: "25px" }}></div>

            <center>
                <Button type="dashed">Deep Context Answer</Button>
            </center>

            <div style={{ marginTop: "25px" }}></div>

            <Collapse>
                <Panel header="Sources" key="1">
                    <ol>
                        {sources}
                    </ol>
                </Panel>

                <Panel header="Get More Answers" key="2">
                    <ul>
                        {bestSources}
                    </ul>
                </Panel>
            </Collapse>
        </Card>
    );
}

export function ContextAnswer(answer: Context) {
    let sources = [];
    for (let i = 0; i < answer.sources.length; i++) {
        sources.push(SourceItem(answer.sources[i]))
    }

    return (
        <Card style={{ maxWidth: "100%", minWidth: "300px", width: "30vw" }}>
            <p><ReactMarkdown children={answer.answer} /></p>

            <div style={{ marginTop: "25px" }}></div>

            <Collapse>
                <Panel header="Sources" key="1">
                    <ol>
                        {sources}
                    </ol>
                </Panel>
            </Collapse>
        </Card>
    );
}


