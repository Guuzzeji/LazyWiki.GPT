import React, { useState, useEffect } from 'react';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import 'antd/dist/reset.css';
import './App.css';

import { ContextAnswer, GeneralAnswer, General } from './components/Answer';
import { fetchGeneralAnswer } from './fetch';

const { TextArea } = Input;

function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<any | null>(null);
  let gptAnswer: General | null = null;

  async function getGeneralAnswer() {
    setAnswer(null);
    setIsLoading(true);

    if (question == "" || question == null) {
      setIsLoading(false);
      alert("Please enter a question")
      return;
    }

    gptAnswer = await fetchGeneralAnswer(question, (data: General) => {
      setAnswer(<GeneralAnswer
        answer={data.answer}
        sources={data.sources}
        listBest={data.listBest}
      />);
      setIsLoading(false);
    }, () => {
      setAnswer(null);
      setIsLoading(false);
    });
  }

  return (
    <div className="App">
      <div className="centerMiddle">
        <div>

          <center>
            <h1>LazyWiki.Q&A</h1>
          </center>

          {isLoading ? (
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
            {isLoading ? (
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

          {answer}

        </div>
      </div>
    </div >
  );
}

export default App;
