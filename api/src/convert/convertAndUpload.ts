import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import { logger } from "../utils/logger";
import pdftoppm from "../convert/pdftoppm";
import pngquant from "./pngquant";
import resizeImageAndZip from "./resizeImageAndZip";
import resizedFilename from "./resizedFilename";
import tempy from "tempy";
import uploadSlidesToS3 from "../convert/uploadSlidesToS3";

const log = logger.get("convertAndUpload", __filename);

export default async function convertAndUpload({
  fileKey,
  inputFile,
}: {
  fileKey: string;
  inputFile: string;
}): Promise<string[]> {
  const tempPath = tempy.directory();

  log.debug({ fileKey, inputFile }, "Start to pdftoppm");
  const slideFiles = await pdftoppm({
    inputFile,
    outputPath: tempPath,
  });
  log.debug({ fileKey, slideFiles }, "Conversion completed");

  const resizedSlidesZipFile = await resizeImageAndZip({
    inputFiles: slideFiles,
    outputFile: path.join(tempPath, resizedFilename),
  });
  log.debug({ fileKey, resizedSlidesZipFile }, "Resize completed");

  await pngquant({ pngFiles: slideFiles });
  log.debug({ fileKey, slideFiles }, "Pngquant completed");

  try {
    const uploadedKeys = await uploadSlidesToS3({
      fileKey,
      slideFiles,
      resizedSlidesZipFile,
    });

    return uploadedKeys;
  } finally {
    fs.rmdirSync(tempPath, { recursive: true });
  }
}
