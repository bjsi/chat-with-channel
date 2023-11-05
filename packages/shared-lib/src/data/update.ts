import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import {
  allProcessdVideosFolder,
  allTranscriptsFolder,
  getTranscriptsDownloadedVideosFilePath,
  getTranscriptsFolderPath,
} from "./filesystem";
import chalk from "chalk";
import cliProgress from "cli-progress";
import dotenv from "dotenv";

dotenv.config({
  path: "../../../../.env",
});

async function main() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) {
    console.log(
      chalk.red(
        "YOUTUBE_CHANNEL_ID environment variable not set. Create a .env file in the root of the project and set the YOUTUBE_CHANNEL_ID variable."
      )
    );
    return;
  }
  if (!existsSync(allTranscriptsFolder)) {
    mkdirSync(allTranscriptsFolder);
  }

  if (!existsSync(allProcessdVideosFolder)) {
    mkdirSync(allProcessdVideosFolder);
  }

  const transcriptDir = getTranscriptsFolderPath(channelId);
  const processedFile = getTranscriptsDownloadedVideosFilePath(channelId);

  if (!existsSync(transcriptDir)) {
    mkdirSync(transcriptDir);
  }

  let processedIds: string[] = [];
  if (existsSync(processedFile)) {
    const rawData = readFileSync(processedFile, "utf-8");
    processedIds = JSON.parse(rawData);
  }

  // Fetch all video IDs from the channel
  console.log(chalk.blue(`Fetching all video IDs (can be slow)...`));
  const videoIdCommand = `yt-dlp --get-id -i "${channelId}"`;
  const videoIdsRaw = execSync(videoIdCommand).toString().trim();
  const videoIds = videoIdsRaw.split("\n");
  console.log(chalk.green(`Found ${videoIds.length} total video IDs`));

  // Filter out already processed IDs
  const newVideoIds = videoIds.filter((id) => !processedIds.includes(id));
  console.log(`Found ${newVideoIds.length} new video IDs.`);

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  progressBar.start(newVideoIds.length, 0);

  newVideoIds.forEach((id, idx) => {
    progressBar.increment();
    const command = `yt-dlp --write-sub --write-auto-sub --sub-lang en --sub-format vtt --skip-download -o "${transcriptDir}/${id}.%(ext)s" "https://www.youtube.com/watch?v=${id}"`;
    console.log(
      `Downloading transcript for video ${idx + 1} of ${newVideoIds.length}...`
    );

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
}

main();
