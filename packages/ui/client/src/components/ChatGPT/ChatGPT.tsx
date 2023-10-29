import React from "react";
import MessageItem from "./MessageItem";
import SendBar, { SEND_BAR_HEIGHT } from "./SendBar";
import { useChatGPT } from "./useChatGPT";

import "highlight.js/styles/atom-one-dark.css";
import { HEADER_HEIGHT } from "../HeaderBar";

export const ChatGPT = () => {
  const {
    loading,
    disabled,
    messages,
    currentMessage,
    onSend,
    onClear,
    onStop,
  } = useChatGPT();

  return (
    <div
      className=" chat-wrapper"
      style={{
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
    >
      <div
        className="w-[100%]"
        style={{
          minHeight: `calc(100% - ${SEND_BAR_HEIGHT}px)`,
          maxHeight: `calc(100% - ${SEND_BAR_HEIGHT}px)`,
          height: `calc(100% - ${SEND_BAR_HEIGHT}px)`,
          overflowY: "auto",
        }}
      >
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
        {currentMessage.current && (
          <MessageItem
            message={{
              content: currentMessage.current,
              role: "assistant",
            }}
          />
        )}
      </div>

      <SendBar
        loading={loading}
        disabled={disabled}
        onSend={onSend}
        onClear={onClear}
        onStop={onStop}
      />
    </div>
  );
};
