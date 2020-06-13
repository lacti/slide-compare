import * as path from "path";

import ensureDirectory from "../utils/ensureDirectory";
import sharp from "sharp";

const defaultResizedWidth = 400;

export default async function resizeImageFiles({
  inputFiles,
  outputPath,
  resizedWidth = defaultResizedWidth,
}: {
  inputFiles: string[];
  outputPath: string;
  resizedWidth?: number;
}): Promise<string[]> {
  ensureDirectory(outputPath);

  const outputFiles: string[] = [];
  for (const inputFile of inputFiles) {
    const resizedFilePath = path.join(outputPath, path.basename(inputFile));
    await sharp(inputFile).resize(resizedWidth).toFile(resizedFilePath);
    outputFiles.push(resizedFilePath);
  }
  return outputFiles;
}
