import "source-map-support/register";

import * as fs from "fs";

import pdftoppm from "../convert/pdftoppm";
import resizeImageFiles from "../convert/resizeImageFiles";
import tempy from "tempy";
import uploadSlidesToS3 from "../convert/uploadSlidesToS3";

export default async function convertAndUpload({
  fileKey,
  inputFile,
}: {
  fileKey: string;
  inputFile: string;
}): Promise<string[]> {
  const slideFiles = await pdftoppm({
    inputFile,
    outputPath: tempy.directory(),
  });
  const resizedSlideFiles = await resizeImageFiles({
    inputFiles: slideFiles,
    outputPath: tempy.directory(),
  });
  try {
    const uploadedKeys = await uploadSlidesToS3({
      fileKey,
      slideFiles,
      resizedSlideFiles,
    });
    return uploadedKeys;
  } finally {
    for (const tempFile of [...slideFiles, ...resizedSlideFiles]) {
      fs.unlinkSync(tempFile);
    }
  }
}
