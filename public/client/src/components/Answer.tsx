import React, { useState, useEffect } from 'react';
import { Button, Card, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';


export interface General {
    answer: string
    sources: string[]
    listBest: string[]
}

function SourceItem(url: string) {
    return (
        <li>
            <a href={url}>url</a>
        </li>
    )
}

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
        <Card>
            <p>{answer.answer}</p>

            <p><u>Futher Your Answer</u></p>
            <ol>
                {bestSources}
            </ol>

            <p><u>Sources</u></p>
            <ol>
                {sources}
            </ol>

            <center>
                <Button type="dashed">Context Answer</Button>
            </center>
        </Card>
    );
}

export function ContextAnswer() {

    return (
        <div>

        </div>
    );
}


