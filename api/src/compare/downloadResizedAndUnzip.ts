import * as fs from "fs";

import AdmZip from "adm-zip";
import { logger } from "../utils/logger";
import resizedFilename from "../convert/resizedFilename";
import tempy from "tempy";
import useS3 from "../aws/useS3";

const log = logger.get("downloadResizedAndUnzip", __filename);

export default async function downloadResizedAndUnzip({
  fileKey,
  unzippedPath,
}: {
  fileKey: string;
  unzippedPath: string;
}): Promise<string> {
  const { downloadToLocal } = useS3();

  const resizedZipFile = await downloadToLocal({
    s3ObjectKey: `${fileKey}/${resizedFilename}`,
    localFile: tempy.file({ extension: ".zip" }),
  });
  log.trace({ fileKey, resizedZipFile }, "Download resized zip to local");
  try {
    const zip = new AdmZip(resizedZipFile);
    zip.extractAllTo(unzippedPath, true);
    log.trace({ fileKey, unzippedPath }, "Unzip resized slide images");
    return unzippedPath;
  } finally {
    fs.unlinkSync(resizedZipFile);
  }
}
