import { logger } from "../utils/logger";
import sharp from "sharp";

export default async function resizeImage({
  inputFile,
  outputFile,
  resizedWidth,
}: {
  inputFile: string;
  outputFile: string;
  resizedWidth: number;
}): Promise<string> {
  logger.debug(
    "sharp: input=%s, output=%s, widtd=%d",
    inputFile,
    outputFile,
    resizedWidth
  );
  await sharp(inputFile).resize(resizedWidth).toFile(outputFile);
  return outputFile;
}
