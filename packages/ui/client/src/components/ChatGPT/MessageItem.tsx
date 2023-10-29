import MarkdownIt from "markdown-it";
import mdHighlight from "markdown-it-highlightjs";
// @ts-ignore
import mdKatex from "markdown-it-katex";
import mdFootnotes from "markdown-it-footnote";

import clsx from "clsx";
import { OpenAIChatMessage } from "modelfusion";

const md = MarkdownIt({ html: true })
  .use(mdKatex)
  .use(mdHighlight)
  .use(mdFootnotes);
const fence = md.renderer.rules.fence!;
md.renderer.rules.fence = (...args) => {
  const [tokens, idx] = args;
  const token = tokens[idx];
  const rawCode = fence(...args);

  return `<div relative>
  <div data-clipboard-text=${encodeURIComponent(
    token.content
  )} class="copy-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z" /><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z" /></svg>
    <div>Copy</div>
  </div>
  ${rawCode}
  </div>`;
};

const assistantStyle = {
  backgroundImage:
    "linear-gradient(to right, rgb(232, 243, 173), rgb(139, 248, 38), rgb(2, 168, 209))",
};

const userStyle = {
  backgroundImage:
    "linear-gradient(to right, rgb(192, 132, 252), rgb(250, 204, 21))",
};

const systemStyle = {
  backgroundImage:
    "linear-gradient(to right, rgb(164, 194, 238), rgb(181, 128, 241), rgb(167, 92, 238))",
};

export interface ChatMessageItemProps {
  message: OpenAIChatMessage;
}

const MessageItem = (props: ChatMessageItemProps) => {
  const { message } = props;

  return (
    <div className="p-3 rounded-md hover:bg-black hover:bg-opacity-5">
      <div className="flex items-center gap-3">
        <div
          className={clsx("inline-block w-6 h-6 rounded-full")}
          style={
            message.role === "assistant"
              ? assistantStyle
              : message.role === "user"
              ? userStyle
              : systemStyle
          }
        />
        <div
          className="flex-1 overflow-hidden text-sm"
          dangerouslySetInnerHTML={{ __html: md.render(message.content || "") }}
        />
      </div>
    </div>
  );
};

export default MessageItem;
