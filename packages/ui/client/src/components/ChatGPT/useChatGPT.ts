import { useEffect, useReducer, useRef, useState } from "react";
import { z } from "zod";
import ClipboardJS from "clipboard";

import { OpenAIChatMessage, readEventSourceStream } from "modelfusion";
import { throttle } from "./throttle";
import { ZodSchema } from "./ZodSchema";
import { TextToSpeechStreamer } from "./TextToSpeechStreamer";

const scrollDown = throttle(() => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}, 300);

export const useChatGPT = () => {
  const [, forceUpdate] = useReducer((x) => !x, false);
  const [messages, setMessages] = useState<OpenAIChatMessage[]>([]);
  const [disabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const controller = useRef<AbortController | null>(null);
  const currentMessage = useRef<string>("");

  const archiveCurrentMessage = () => {
    const content = currentMessage.current;
    currentMessage.current = "";
    setLoading(false);
    if (content) {
      setMessages((messages) => {
        return [
          ...messages,
          {
            content,
            role: "assistant",
          },
        ];
      });
      scrollDown();
    }
  };

  const sendChat = async (
    urlEndpoint: string,
    body: Record<string, any>,
    tts: boolean
  ) => {
    try {
      currentMessage.current = "";
      controller.current = new AbortController();
      setLoading(true);

      const response = await fetch(`http://localhost:3020/${urlEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.current.signal,
      });

      const textDeltas = readEventSourceStream({
        stream: response.body!,
        schema: new ZodSchema(z.object({ textDelta: z.string() })),
        errorHandler: (e) => {
          console.error(e);
        },
      });

      if (tts) {
        const ttsStreamer = await TextToSpeechStreamer.create();
        for await (const { textDelta } of textDeltas) {
          ttsStreamer.sendTextDelta(textDelta);
          currentMessage.current += textDelta;
          forceUpdate();
        }
        ttsStreamer.done();
      } else {
        for await (const textDelta of textDeltas) {
          currentMessage.current += textDelta;
          forceUpdate();
        }
      }

      archiveCurrentMessage();
    } catch (e) {
      console.error(e);
      setLoading(false);
      return;
    }
  };

  const sendChatMessage = async (messages: OpenAIChatMessage[]) => {
    await sendChat("chat", { messages }, false);
  };

  const sendChatAsMessage = async (messages: OpenAIChatMessage[]) => {
    await sendChat("chatAs", { messages, personality: "David Deutsch" }, true);
  };

  const onStop = () => {
    if (controller.current) {
      controller.current.abort();
      archiveCurrentMessage();
    }
  };

  const onSend = (message: OpenAIChatMessage) => {
    const newMessages = [...messages, message];
    setMessages(newMessages);
    sendChatAsMessage(newMessages);
  };

  const onClear = () => {
    setMessages([]);
  };

  useEffect(() => {
    new ClipboardJS(".chat-wrapper .copy-btn");
  }, []);

  return {
    loading,
    disabled,
    messages,
    currentMessage,
    onSend,
    onClear,
    onStop,
  };
};
