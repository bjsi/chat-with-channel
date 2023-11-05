<h1 align="center">
    <img src="https://raw.githubusercontent.com/bjsi/chat-with-channel/main/img/chat-with-channel.jpg" alt="Chat with Channel Logo" height="200">
    <br/>
    Chat with Channel - 💬 Create Chatbots for any YouTube channel
</h1>

<h3 align="center">Chat with an AI version of your favorite youtuber using GPT. Answers include footnotes to timestamped video clips!</h3>

<br/>

## 🚀 Overview

Welcome to Chat with Channel, an open source framework for creating YouTube chatbots with GPT. I've been using it to chat with AI versions of [Brett Hall](https://www.youtube.com/@bretthall9080) who makes videos and podcasts about the works of Karl Popper and David Deutsch, and it's been a lot of fun. If you are curious you can check that out [here](). I hope you find it useful too!

### ✨ Features

- **AI-powered Chatbot**: Chat with your favorite youtubers.
- **Footnotes to Sources**: Every answer includes precise footnotes to video clips that support the answer.

<div align="center">
  <img src="https://raw.githubusercontent.com/bjsi/ai-popper/main/img/define-optimism.png" alt="Define Optimism" height="400px">
</div>

### 📽️ Tutorial

- Requires minimal coding experience!
- All you need to do is provide some settings and run some simple commands.
- The program will run on your computer and includes a chat UI similar to ChatGPT.

### Steps

1. Install [Node.js](https://nodejs.org/en/)
2. Install [Yarn](https://yarnpkg.com/)
3. Run `git clone https://github.com/bjsi/chat-with-channel.git` to clone the repository.
4. Change directory into the project folder.
5. Run `yarn install` to install dependencies.
6. Create a file called `.env` in the root of the project folder.
7. Add the following to the `.env` file:

```sh
OPENAI_API_KEY="<your OpenAI API key>"
YOUTUBE_CHANNEL_URL="https://www.youtube.com/channel/<channel ID>"
ANSWER_AS="Answer as <name of person and description of persona>"
YOUTUBE_CHANNEL_NAME="<name of YouTube channel>"
```

Example:

```sh
OPENAI_API_KEY="sk-1234567890"
YOUTUBE_CHANNEL_URL="https://www.youtube.com/@DavidDeutschPhysicist"
ANSWER_AS="Answer as David Deutsch, author of The Beginning of Infinity and The Fabric of Reality."
YOUTUBE_CHANNEL_NAME="David Deutsch"
```

8. Run `yarn start` to start the program. It will download the latest transcripts from the YouTube channel and start the chatbot.
