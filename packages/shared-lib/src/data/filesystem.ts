import path from "path";

export const vectorDataFile = path.join(__dirname, "vectors.sqlite");

export const allTranscriptsFolder = path.join(__dirname, "youtube/transcripts");
export const allProcessdVideosFolder = path.join(
  __dirname,
  "youtube/downloadedTranscripts"
);
export const sourcesFile = path.join(__dirname, "sources.json");
export const embeddedVideosFolder = path.join(
  __dirname,
  "youtube/embeddedVideos"
);

const illegalRe = /[\/\?<>\\:\*\|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[\. ]+$/;

function sanitize(input: string) {
  if (typeof input !== "string") {
    throw new Error("Input must be string");
  }
  const sanitized = input
    .replace(/ /g, "_")
    .replace(illegalRe, "")
    .replace(controlRe, "")
    .replace(reservedRe, "")
    .replace(windowsReservedRe, "")
    .replace(windowsTrailingRe, "");
  return sanitized;
}

/**
 * Contains transcripts of the form: <channelName>/<videoId>.en.vtt
 */
export const getTranscriptsFolderPath = (channelName: string) => {
  return sanitize(path.join(allTranscriptsFolder, channelName));
};

export const getTranscriptsDownloadedVideosFilePath = (channelName: string) => {
  return sanitize(path.join(allProcessdVideosFolder, `${channelName}.json`));
};

export const getEmbeddedVideosFilePath = (channelName: string) => {
  return sanitize(path.join(embeddedVideosFolder, `${channelName}.json`));
};
