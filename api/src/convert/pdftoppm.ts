import * as fs from "fs";
import * as path from "path";

import ensureDirectory from "../utils/ensureDirectory";
import execa from "execa";
import getSlideFilename from "../slide/getSlideFilename";
import { logger } from "../utils/logger";
import prepareConvertExternals from "./prepareConvertExternals";
import resizeImage from "./resizeImage";

const resizedWidth = 1600;

const log = logger.get("pdftoppm", __filename);

export default async function pdftoppm({
  inputFile,
  outputPath,
  timeout = 90 * 1000,
}: {
  inputFile: string;
  outputPath: string;
  timeout?: number;
}): Promise<string[]> {
  ensureDirectory(outputPath);
  const { pdftoppmPath } = await prepareConvertExternals();
  log.trace({ pdftoppmPath, inputFile, outputPath }, "pdftoppm: start");

  const subprocess = execa(pdftoppmPath, [
    inputFile,
    "-png",
    path.join(outputPath, "000"),
    "-sep",
    "",
  ]);
  return new Promise<string[]>((resolve, reject) => {
    const killer = setTimeout(() => {
      subprocess.kill("SIGTERM");
      reject(new Error("pdftoppm: Timeout occurred"));
    }, timeout);
    subprocess.then(({ exitCode, failed, killed, stdout, stderr }) => {
      clearTimeout(killer);
      log.trace({ stdout, stderr }, "pdftoppm: process completed");

      if (exitCode !== 0) {
        reject(new Error(`pdftoppm Error: ${stderr}`));
      }
      if (failed || killed) {
        reject(new Error(`pdftoppm: Failed or killed`));
      }

      log.trace({ inputFile, outputPath }, "pdftoppm: postprocess");
      postprocess(outputPath).then((outputFiles) => {
        log.trace({ outputFiles }, "pdftoppm: completed");
        resolve(outputFiles);
      });
    });
  });
}

async function postprocess(oldFilesPath: string): Promise<string[]> {
  let slide = 0;
  const outputFiles: string[] = [];
  for (const oldFile of fs
    .readdirSync(oldFilesPath)
    .map((fileName) => ({
      fullPath: path.join(oldFilesPath, fileName),
      fileName,
      fileNumber: +path.basename(fileName, path.extname(fileName)),
    }))
    .sort((a, b) => a.fileNumber - b.fileNumber)) {
    const newFilePath = path.join(oldFilesPath, getSlideFilename(slide));

    log.trace({ oldFile, newFilePath }, "pdftoppm: Resize PNG from PDF");
    await resizeImage({
      inputFile: oldFile.fullPath,
      outputFile: newFilePath,
      resizedWidth,
    });
    outputFiles.push(newFilePath);

    fs.unlinkSync(oldFile.fullPath);
    ++slide;
  }
  return outputFiles;
}
