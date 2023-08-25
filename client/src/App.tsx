import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import 'antd/dist/reset.css';
import './App.css';

import { ContextAnswer, GeneralAnswer, General } from './components/Answer';
import { fetchGeneralAnswer } from './fetch';

const { TextArea } = Input;

function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState<number>(1); // 0 = loading, 1 = success, -1 = failed
  const [answer, setAnswer] = useState<any | null>(null);
  let gptAnswer: General | null = null;

  async function getGeneralAnswer(): Promise<void> {
    setAnswer(null);
    setIsLoading(0);

    if (question == "" || question == null) {
      setIsLoading(-1);
      return;
    }

    gptAnswer = await fetchGeneralAnswer(question, () => { null }, () => { null });

    if (gptAnswer == null) {
      setAnswer(null);
      setIsLoading(-1);
    } else {
      setAnswer(<GeneralAnswer
        answer={gptAnswer.answer}
        sources={gptAnswer.sources}
        listBest={gptAnswer.listBest}
      />);
      setIsLoading(1);
    }
  }

  return (
    <div className="App">
      <div className="centerMiddle">
        <div>

          <center>
            <h1>LazyWiki.Q&A</h1>
          </center>

          {isLoading == 0 ? (
            <TextArea
              value={question}
              className="searchBar"
              disabled
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What Your Question?"
              autoSize={{ minRows: 2, maxRows: 10 }}
            />
          ) : (
            <TextArea
              value={question}
              className="searchBar"
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What Your Question?"
              autoSize={{ minRows: 2, maxRows: 10 }}
            />
          )}

          <div style={{ marginTop: "25px" }}></div>

          <center>
            {isLoading == 0 ? (
              <Space direction="horizontal">
                <Button type="dashed" icon={<SearchOutlined />} loading disabled>Get Answer</Button>
              </Space>
            ) : (
              <Space direction="horizontal">
                <Button type="dashed" icon={<SearchOutlined />} onClick={getGeneralAnswer}>Get Answer</Button>
              </Space>
            )}
          </center>

          <div style={{ marginTop: "25px" }}></div>

          {answer != null || isLoading == 1 || isLoading == 0 ? (
            answer
          ) : (
            <Alert message="Error: Something bad happen" type="error" />
          )}

        </div>
      </div>
    </div >
  );
}

export default App;
