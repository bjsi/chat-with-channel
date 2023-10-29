import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { AbortError, OpenAIChatModel, streamText } from "modelfusion";
import { chatAs } from "shared-lib/src/data/search";

dotenv.config();

const app = express();
const port = 3020;

app.use(express.json());
app.use(cors());

const chatMessagesSchema = z.array(
  z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })
);

async function streamRequestHandler(
  request: Request,
  response: Response,
  streamFn: (signal: AbortSignal) => Promise<AsyncIterable<string>>
) {
  try {
    if (request.method !== "POST") {
      return response.status(405).json({
        error: `Method ${request.method} not allowed. Only POST allowed.`,
      });
    }

    const controller = new AbortController();
    const textStream = await streamFn(controller.signal);

    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");
    response.setHeader("Content-Encoding", "none");

    response.on("close", () => {
      controller.abort();
      console.log("response closed");
    });

    for await (const textDelta of textStream) {
      response.write(`data: ${JSON.stringify({ textDelta })}\n\n`);
    }

    response.end();
  } catch (e) {
    if (e instanceof AbortError) {
      console.log("client aborted request");
      response.end();
    } else {
      console.log("error", e);
    }
  }
}

app.post("/chat", async (request, response) => {
  const { messages } = request.body;
  const parsedData = chatMessagesSchema.safeParse(messages);
  if (parsedData.success === false) {
    return response.status(400).json({
      error: `Could not parse content. Error: ${parsedData.error}`,
    });
  }
  streamRequestHandler(request, response, (signal) =>
    streamText(
      new OpenAIChatModel({ model: "gpt-3.5-turbo", temperature: 0 }),
      [
        {
          role: "system",
          content:
            "You are an AI chat bot. " +
            "Follow the user's instructions carefully. Respond using markdown.",
        },
        ...request.body.messages,
      ],
      {
        run: {
          abortSignal: signal,
        },
      }
    )
  );
});

const chatAsSchema = z.object({
  personality: z.union([z.literal("David Deutsch"), z.literal("Karl Popper")]),
  messages: chatMessagesSchema,
});

app.post("/chatAs", async (request, response) => {
  const parsedData = chatAsSchema.safeParse(request.body);
  if (parsedData.success === false) {
    return response.status(400).json({
      error: `Could not parse content. Error: ${parsedData.error}`,
    });
  }
  streamRequestHandler(request, response, (signal) =>
    chatAs({
      ...parsedData.data,
      signal,
    })
  );
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
