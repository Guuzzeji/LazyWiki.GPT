import React, { useState, useEffect } from 'react';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import 'antd/dist/reset.css';
import './App.css';

const { TextArea } = Input;

function App() {
  const [value, setValue] = useState('');

  useEffect(() => {
    console.log(value);
  })

  return (
    <div className="App">
      <div className="centerMiddle">
        <div>
          <h1>LazyWiki.Q&A</h1>
          <TextArea
            value={value}
            className="searchBar"
            onChange={(e) => setValue(e.target.value)}
            placeholder="What Your Question?"
            autoSize={{ minRows: 2, maxRows: 10 }}
          />
          <div style={{ marginTop: "25px" }}></div>
          <Space direction="horizontal">
            <Button type="dashed" icon={<SearchOutlined />}>Get Answer</Button>
          </Space>
        </div>
      </div>
    </div >
  );
}

export default App;
