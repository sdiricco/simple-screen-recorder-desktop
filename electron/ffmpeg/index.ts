import * as fs from "fs";
import * as path from "path";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

export function preProcessVideo(sourcePath: string): Promise<void> {
  const outputPath = path.join(path.dirname(sourcePath), `temp-${path.basename(sourcePath)}`);

  return new Promise<void>((resolve, reject) => {
    ffmpeg(sourcePath)
      .videoCodec("copy")
      .audioCodec("copy")
      .save(outputPath)
      .on("error", (err) => reject(err))
      .on("end", () => {
        fs.unlinkSync(sourcePath);
        fs.renameSync(outputPath, sourcePath);
        resolve();
      });
  });
}

export function conversionToMp4(sourcePath: string, outputPath: string) {
  return ffmpeg(sourcePath).output(outputPath).videoCodec("libx264").audioCodec("libmp3lame");
}

export async function run(conversion: any) {
  return new Promise<void>((resolve, reject) => {
    conversion.on("end", () => {
      resolve();
    });
    conversion.on('error', (error) => {
      reject(`Error during conversion: ${error.message}`);
    });
    conversion.run();
  });
}
