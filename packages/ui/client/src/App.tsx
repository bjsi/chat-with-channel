import { Layout } from "antd";
import { ChatGPT } from "./components/ChatGPT/ChatGPT";
import { HeaderBar } from "./components/HeaderBar";
import React from "react";

function App() {
  return (
    <Layout>
      <HeaderBar />
      <ChatGPT />
    </Layout>
  );
}

export default App;
