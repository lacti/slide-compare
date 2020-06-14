import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import convertAndUpload from "../convert/convertAndUpload";
import { logger } from "../utils/logger";
import tempy from "tempy";
import updateSlideMeta from "../slide/updateSlideMeta";
import useS3 from "../aws/useS3";

export default async function convertOne(s3ObjectKey: string): Promise<void> {
  const { downloadToLocal, deleteKey } = useS3();
  logger.info("Convert PDF [%s]", s3ObjectKey);

  const inputFile = await downloadToLocal({
    s3ObjectKey,
    localFile: tempy.file({ extension: ".pdf" }),
  });
  logger.debug("Download PDF to local [%s][%s]", s3ObjectKey, inputFile);

  try {
    const fileKey = path.basename(s3ObjectKey);
    await updateSlideMeta({
      fileKey,
      stage: "converting",
    });

    await convertAndUpload({
      fileKey: path.basename(s3ObjectKey),
      inputFile,
    });
  } finally {
    logger.debug("Clear workspace [%s]", s3ObjectKey);
    fs.unlinkSync(inputFile);
    await deleteKey({ s3ObjectKey });
  }
}
