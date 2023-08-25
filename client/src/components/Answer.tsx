import React, { useState, useEffect } from 'react';
import { Button, Card, Collapse } from 'antd';
import ReactMarkdown from 'react-markdown'

export interface GPTAnswer {
    answer: string
    textUsed: RevelentText[]
}

interface RevelentText {
    text: string,
    title: string,
    subtitle: string
}

function TextItem(text: RevelentText) {
    return (
        <li>
            <span><b>Wiki Ttile:</b> {text.title}</span>
            <br />
            <span><b>Sub Title:</b> {text.subtitle}</span>
            <br />
            <span><b>Text:</b> {text.text}</span>
        </li>
    )
}

const { Panel } = Collapse;
export function AnswerPanel(answer: GPTAnswer) {

    return (
        <Card style={{ maxWidth: "100%", minWidth: "300px", width: "30vw" }}>
            <p><ReactMarkdown children={answer.answer} /></p>

            <div style={{ marginTop: "25px" }}></div>

            <Collapse>
                <Panel header="Sources" key="1">
                    <ul style={{ overflowWrap: "anywhere" }}>
                        {answer.textUsed.map((item, index) =>
                            <TextItem
                                text={item.text}
                                title={item.title}
                                subtitle={item.subtitle}
                            />
                        )}
                    </ul>
                </Panel>
            </Collapse>
        </Card>
    );
}


