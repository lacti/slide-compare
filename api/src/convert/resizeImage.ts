import { logger } from "../utils/logger";
import sharp from "sharp";

const log = logger.get("resizeImage", __filename);

export default async function resizeImage({
  inputFile,
  outputFile,
  resizedWidth,
}: {
  inputFile: string;
  outputFile: string;
  resizedWidth: number;
}): Promise<string> {
  log.trace({ inputFile, outputFile, resizedWidth }, "sharp: resize");
  await sharp(inputFile).resize(resizedWidth).toFile(outputFile);
  return outputFile;
}
