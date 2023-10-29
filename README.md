<h1 align="center">
    <img src="https://raw.githubusercontent.com/bjsi/chat-with-channel/main/img/chat-with-channel.jpeg" alt="Chat with Channel Logo" height="200">
    <br/>
    Chat with Channel - 💬 Create Chatbots for any YouTube channel
</h1>

<h3 align="center">Chat with an AI version of your favorite youtuber using GPT. Answers include footnotes to timestamped video clips!</h3>

<br/>

## 🚀 Overview

Welcome to Chat with Channel, an open source framework for creating YouTube chatbots with GPT. I've been using it to chat with AI versions of [Brett Hall](https://www.youtube.com/@bretthall9080) who makes videos and podcasts about the works of Karl Popper and David Deutsch, and it's been a lot of fun. I hope you find it useful too!

### ✨ Features

- **AI-powered Chatbot**: Chat with your favorite youtubers.
- **Footnotes to Sources**: Every answer includes precise footnotes to video clips that support the answer.

<div align="center">
  <img src="https://raw.githubusercontent.com/bjsi/ai-popper/main/img/define-optimism.png" alt="Define Optimism" height="400px">
</div>

### 📽️ Tutorial

- Requires minimal coding experience. All you need to do is create a `.env` file with your OpenAI API key and run a few commands.
- The program will run on your computer and includes a chat UI similar to the ChatGPT UI.

### Prerequisites

- You must have [Node.js](https://nodejs.org/en/) installed.
- You must have [Yarn](https://yarnpkg.com/) installed.
- Run `yarn install` to install dependencies.
- Create a `.env` file in the `packages/ui/server` directory with an `OPENAI_API_KEY` variable set to your OpenAI API key.

### UI

- `yarn server` to start the server.
- `yarn client` to start the frontend and open the chat UI in your browser.

### CLI

- `yarn chat` to start a new chat session.
- `yarn search` to start a text embedding search session (useful for debugging).
- `yarn update` to download transcripts for the latest videos in the tracked resources file (see `sources.json`).
  - You must install [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) to download transcripts for new videos.
- `yarn embed` to create embeddings from the latest transcripts.
