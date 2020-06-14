import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import { logger } from "../utils/logger";
import pdftoppm from "../convert/pdftoppm";
import resizeImageAndZip from "./resizeImageAndZip";
import tempy from "tempy";
import updateSlideMeta from "../slide/updateSlideMeta";
import uploadSlidesToS3 from "../convert/uploadSlidesToS3";

export default async function convertAndUpload({
  fileKey,
  inputFile,
}: {
  fileKey: string;
  inputFile: string;
}): Promise<string[]> {
  const tempPath = tempy.directory();

  logger.debug("Start to pdftoppm on [%s] with [%s]", fileKey, inputFile);
  const slideFiles = await pdftoppm({
    inputFile,
    outputPath: tempPath,
  });
  logger.debug("Complete to convert [%s] [%s]", fileKey, slideFiles.join(", "));

  const resizedSlidesZipFile = await resizeImageAndZip({
    inputFiles: slideFiles,
    outputFile: path.join(tempPath, "resized.zip"),
  });
  logger.debug("Complete to resize [%s] [%s]", fileKey, resizedSlidesZipFile);

  try {
    const uploadedKeys = await uploadSlidesToS3({
      fileKey,
      slideFiles,
      resizedSlidesZipFile,
    });

    await updateSlideMeta({
      fileKey,
      slideCount: slideFiles.length,
      stage: "converted",
    });
    logger.debug("Upload completed [%s]", fileKey);

    return uploadedKeys;
  } finally {
    fs.rmdirSync(tempPath, { recursive: true });
  }
}
