import { exec } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { promisify } from "util";
import { QUEUES_EVENTS } from "./constants";
import { addQueueItem } from "./queue";

const execAsync = promisify(exec);

interface Output {
  fileName: string;
  outputFileName: string;
}

export const execute = async (
  filePath: string,
  outputFolder: string,
  jobData: object
): Promise<Output> => {
  const fileName = path.basename(filePath);
  const fileExt = path.extname(filePath);

  const fileNameWithoutExt = path.basename(filePath, fileExt);

  const outputFileName = `${outputFolder}/${fileNameWithoutExt}.mp4`;

  const command = ffmpeg(filePath)
    .output(outputFileName)
    .on("start", (commandLine: string) => {
      console.log(`Spawned Ffmpeg with command`, commandLine);
    })
    .on("progress", (progress: ffmpeg.Progress) => {
      console.log("Processing " + progress.percent + "% done");
    })
    .on("end", () => {
      console.log("Finished processing");

      addQueueItem(QUEUES_EVENTS.VIDEO_PROCESSED, { ...jobData });
    })
    .on("error", (err: Error) => {
      console.log("An error occurred", err.message);
    })
    .run();

  return {
    fileName,
    outputFileName,
  };
};
