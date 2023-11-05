import { embedMany, splitAtToken, splitTextChunks } from "modelfusion";
import { ResourceChunk } from "../types";
import path from "node:path";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import {
  allTranscriptsFolder,
  embeddedVideosFolder,
  getEmbeddedVideosFilePath,
} from "./filesystem";
import { parseSync } from "subtitle";
import dotenv from "dotenv";
import { embeddingModel } from "./embeddingModel";
import { execSync } from "node:child_process";
import { vectorIndex } from "./vectorIndex";
import { nanoid } from "nanoid";
import chalk from "chalk";
import { MultiBar, Presets, SingleBar } from "cli-progress";
import { getChannelInfo } from "./getChannel";

const envFile = path.resolve("../../.env");
dotenv.config({
  path: envFile,
});

async function embedText(chunks: ResourceChunk[], allowSplit: boolean) {
  if (allowSplit) {
    chunks = await splitTextChunks(
      splitAtToken({
        maxTokensPerChunk: 256,
        tokenizer: embeddingModel.tokenizer,
      }),
      chunks
    );
  }
  const chunkEmbeddings = await embedMany(
    embeddingModel,
    chunks.map((x) => x.text)
  );
  const objects = chunks.map((chunk, i) => ({
    data: chunk,
    vector: chunkEmbeddings[i],
    id: nanoid(),
  }));
  await vectorIndex.upsertMany(objects);
}

export async function embedTranscripts() {
  const channelInfo = getChannelInfo();
  if (!channelInfo) {
    return;
  }

  const openAIKey = process.env.OPENAI_API_KEY;
  if (!openAIKey) {
    console.log(
      chalk.red(
        `OPENAI_API_KEY environment variable not set. Create a .env file in the root of the project and set the OPENAI_API_KEY variable.`
      )
    );
    return;
  }

  const { channelID } = channelInfo;

  console.clear();
  console.log(chalk.blue(`Embedding transcripts...`));

  if (!existsSync(embeddedVideosFolder)) {
    mkdirSync(embeddedVideosFolder);
  }

  // Reading already processed videos
  const processedFilePath = getEmbeddedVideosFilePath(channelID);
  let processedIds: string[] = [];
  if (existsSync(processedFilePath)) {
    const rawData = readFileSync(processedFilePath, "utf-8");
    processedIds = JSON.parse(rawData);
  }
  const channelPath = path.join(allTranscriptsFolder, channelID);
  const videoFiles = readdirSync(channelPath).filter((f) => f.endsWith(".vtt"));
  const unProcessedFiles = videoFiles.filter(
    (f) => !processedIds.includes(path.basename(f, ".en.vtt"))
  );
  if (unProcessedFiles.length === 0) {
    console.log(chalk.green(`No new transcripts to embed.`));
    return;
  }

  const bar = new SingleBar(
    {
      clearOnComplete: true,
    },
    Presets.shades_classic
  );
  bar.start(unProcessedFiles.length, 0);

  for (const file of unProcessedFiles) {
    bar.increment();
    const videoId = path.basename(file, ".en.vtt");
    const videoTitleCommand = `yt-dlp --get-title -i "https://www.youtube.com/watch?v=${videoId}"`;
    const videoTitle = execSync(videoTitleCommand).toString().trim();
    const filePath = path.join(channelPath, file);
    const rawTranscript = readFileSync(filePath, "utf-8");
    const parsedTranscript = parseSync(rawTranscript);

    // Generating chunks to be embedded
    const chunks = parsedTranscript
      .filter((x) => x.type === "cue")
      .map((cue) => ({
        text: (typeof cue.data === "string" ? cue.data : cue.data.text)
          .trim()
          // replace newlines with spaces
          .replace(/\n/g, " ")
          // replace &nbsp;
          .replace(/\&nbsp;/g, " ")
          // remove all tags
          .replace(/\[.*?\]/g, ""),
        type: "youtube",
        url: `https://www.youtube.com/watch?v=${videoId}`,
        start:
          typeof cue.data === "string"
            ? 0
            : cue.data.start <= 10_000
            ? 0
            : Math.floor(cue.data.start / 1000),
        end: typeof cue.data === "string" ? 0 : Math.ceil(cue.data.end / 1000),
      }))
      .filter((x) => !x.text.includes("<c>")) as ResourceChunk[];

    // join transcript segments into 256 token chunks

    let mergedChunks: ResourceChunk[] = [];
    let tempText = "";
    let tempStart = 0;
    let tempEnd = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const newTokens = (await embeddingModel.tokenizer.tokenize(chunk.text))
        .length;
      const existingTokens = (await embeddingModel.tokenizer.tokenize(tempText))
        .length;

      if (existingTokens + newTokens <= 256) {
        tempText = tempText ? `${tempText} ${chunk.text}` : chunk.text;
        tempEnd = chunk.end;
        if (tempStart === 0) tempStart = chunk.start;
      } else {
        mergedChunks.push({
          text: tempText,
          type: "youtube",
          url: chunk.url,
          start: tempStart,
          end: tempEnd,
          title: videoTitle,
        });
        tempText = chunk.text;
        tempStart = chunk.start;
        tempEnd = chunk.end;
      }
    }

    // Add any remaining text
    if (tempText) {
      mergedChunks.push({
        text: tempText,
        type: "youtube",
        url: chunks[chunks.length - 1].url,
        start: tempStart,
        end: tempEnd,
        title: videoTitle,
      });
    }

    // embeddings get saved here
    await embedText(mergedChunks, true);

    // Saving processed IDs
    processedIds.push(videoId);
    writeFileSync(processedFilePath, JSON.stringify(processedIds));
  }

  bar.stop();
  console.clear();
  console.log(chalk.green(`Embedding Complete!`));
  return;
}
