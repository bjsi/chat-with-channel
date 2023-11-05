import chalk from "chalk";

export const getChannelInfo = () => {
  const channelURL = process.env.YOUTUBE_CHANNEL_URL;
  const channelID = channelURL?.replace(/\/$/, "").split("/").pop();
  if (!channelURL || !channelID) {
    console.log(
      chalk.red(
        `YOUTUBE_CHANNEL_URL environment variable not set. Create a .env file in the root of the project and set the YOUTUBE_CHANNEL_URL variable.`
      )
    );
    return;
  }
  return { channelURL, channelID };
};
