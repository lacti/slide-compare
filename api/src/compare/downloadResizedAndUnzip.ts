import * as fs from "fs";

import AdmZip from "adm-zip";
import { resizedFilename } from "../convert/convertAndUpload";
import tempy from "tempy";
import useS3 from "../aws/useS3";

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
  try {
    const zip = new AdmZip(resizedZipFile);
    zip.extractAllTo(unzippedPath, true);
    return unzippedPath;
  } finally {
    fs.unlinkSync(resizedZipFile);
  }
}
