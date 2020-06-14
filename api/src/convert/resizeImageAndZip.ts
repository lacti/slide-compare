import * as fs from "fs";
import * as path from "path";

import AdmZip from "adm-zip";
import ensureDirectory from "../utils/ensureDirectory";
import pngquant from "./pngquant";
import resizeImage from "./resizeImage";
import tempy from "tempy";

const defaultResizedWidth = 400;

export default async function resizeImageAndZip({
  inputFiles,
  outputFile,
  resizedWidth = defaultResizedWidth,
}: {
  inputFiles: string[];
  outputFile: string;
  resizedWidth?: number;
}): Promise<string> {
  const tempPath = tempy.directory();
  ensureDirectory(tempPath);

  try {
    const resizedFiles: string[] = [];
    for (const inputFile of inputFiles) {
      const resizedFilePath = path.join(tempPath, path.basename(inputFile));
      await resizeImage({
        inputFile,
        outputFile: resizedFilePath,
        resizedWidth,
      });
      resizedFiles.push(resizedFilePath);
    }
    await pngquant({
      pngFiles: resizedFiles,
    });

    const zip = new AdmZip();
    resizedFiles.forEach((resizedFilePath) =>
      zip.addLocalFile(resizedFilePath, path.basename(resizedFilePath))
    );
    zip.writeZip(outputFile);
    return outputFile;
  } finally {
    fs.rmdirSync(tempPath, { recursive: true });
  }
}
