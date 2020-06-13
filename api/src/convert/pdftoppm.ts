import * as fs from "fs";
import * as path from "path";

import ensureDirectory from "../utils/ensureDirectory";
import execa from "execa";
import getUnzippedSlideFileName from "../compare/getUnzippedSlideFileName";
import preparePdftoppm from "./preparePdftoppm";

export default async function pdftoppm({
  inputFile,
  outputPath,
  timeout = 60 * 1000,
}: {
  inputFile: string;
  outputPath: string;
  timeout?: number;
}): Promise<string[]> {
  ensureDirectory(outputPath);
  const pdftoppmPath = await preparePdftoppm();
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
    subprocess.then((result) => {
      if (result.exitCode !== 0) {
        reject(new Error(`pdftoppm Error: ${result.stderr}`));
      }
      if (result.failed || result.killed) {
        reject(new Error(`pdftoppm: Failed or killed`));
      }
      clearTimeout(killer);
      resolve(renameFiles(outputPath));
    });
  });
}

function renameFiles(outputPath: string): string[] {
  return fs
    .readdirSync(outputPath)
    .map((fileName) => ({
      fullPath: path.join(outputPath, fileName),
      fileName,
      fileNumber: +path.basename(fileName, path.extname(fileName)),
    }))
    .sort((a, b) => a.fileNumber - b.fileNumber)
    .map((oldFile, slide) => {
      const newFilePath = path.join(
        outputPath,
        getUnzippedSlideFileName(slide)
      );
      fs.renameSync(oldFile.fullPath, newFilePath);
      return newFilePath;
    });
}
