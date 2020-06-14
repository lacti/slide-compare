import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import { S3Handler } from "aws-lambda";
import convertAndUpload from "../convert/convertAndUpload";
import { logger } from "../utils/logger";
import tempy from "tempy";
import updateSlideMeta from "../slide/updateSlideMeta";
import useS3 from "../aws/useS3";

export const handle: S3Handler = async (event) => {
  const { downloadToLocal, deleteKey } = useS3();
  for (const record of event.Records) {
    const s3ObjectKey = record.s3.object.key;
    logger.info("Convert PDF [%s]", s3ObjectKey);

    const inputFile = await downloadToLocal({
      s3ObjectKey,
      localFile: tempy.file({ extension: ".pdf" }),
    });
    logger.debug("Download PDF to local [%s][%s]", s3ObjectKey, inputFile);

    try {
      const fileKey = path.basename(record.s3.object.key);
      await updateSlideMeta({
        fileKey,
        stage: "converting",
      });

      await convertAndUpload({
        fileKey: path.basename(record.s3.object.key),
        inputFile,
      });
    } finally {
      logger.debug("Clear workspace [%s]", s3ObjectKey);
      fs.unlinkSync(inputFile);
      await deleteKey({ s3ObjectKey });
    }
  }
};
