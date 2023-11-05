import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import {
  allProcessdVideosFolder as allProcessedVideosFolder,
  allTranscriptsFolder,
  getTranscriptsDownloadedVideosFilePath,
  getTranscriptsFolderPath,
} from "./filesystem";
import chalk from "chalk";
import cliProgress from "cli-progress";
import dotenv from "dotenv";
import path from "path";
import { getChannelInfo } from "./getChannel";

const envFile = path.resolve("../../.env");
dotenv.config({
  path: envFile,
});

export async function downloadTranscripts() {
  const channelInfo = getChannelInfo();
  if (!channelInfo) {
    return;
  }
  const { channelURL, channelID } = channelInfo;

  if (!existsSync(allTranscriptsFolder)) {
    mkdirSync(allTranscriptsFolder);
  }

  if (!existsSync(allProcessedVideosFolder)) {
    mkdirSync(allProcessedVideosFolder);
  }

  const transcriptDir = getTranscriptsFolderPath(channelID);
  const processedFile = getTranscriptsDownloadedVideosFilePath(channelID);

  if (!existsSync(transcriptDir)) {
    mkdirSync(transcriptDir);
  }

  let processedIds: string[] = [];
  if (existsSync(processedFile)) {
    const rawData = readFileSync(processedFile, "utf-8");
    processedIds = JSON.parse(rawData);
  }

  // Fetch all video IDs from the channel
  console.clear();
  console.log(chalk.blue(`Fetching all video IDs (can be slow)...`));
  const videoIdCommand = `yt-dlp --get-id -i "${channelURL}"`;
  const videoIdsRaw = execSync(videoIdCommand).toString().trim();
  const videoIds = videoIdsRaw.split("\n");

  // Filter out already processed IDs
  const newVideoIds = videoIds.filter((id) => !processedIds.includes(id));

  if (newVideoIds.length === 0) {
    console.log(chalk.green(`No new videos`));
    return;
  }

  console.log(chalk.green(`Found ${newVideoIds.length} new videos`));
  console.log(chalk.blue(`Downloading transcripts...`));

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  progressBar.start(newVideoIds.length, 0);

  newVideoIds.forEach((id) => {
    progressBar.increment();
    const command = `yt-dlp --write-sub --write-auto-sub --sub-lang en --sub-format vtt --skip-download -o "${transcriptDir}/${id}.%(ext)s" "https://www.youtube.com/watch?v=${id}"`;
    try {
      execSync(command);
      processedIds.push(id);
      writeFileSync(processedFile, JSON.stringify(processedIds));
    } catch (error) {
      console.error(
        chalk.red(`Failed to download transcript for video ID ${id}: ${error}`)
      );
    }
  });

  progressBar.stop();
  console.log(chalk.green(`Done!`));
}
