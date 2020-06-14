import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import convertAndUpload from "../convert/convertAndUpload";
import { logger } from "../utils/logger";
import tempy from "tempy";
import updateSlideMeta from "../slide/updateSlideMeta";
import useS3 from "../aws/useS3";

const log = logger.get("convertOne", __filename);

export default async function convertOne(s3ObjectKey: string): Promise<void> {
  const { downloadToLocal, deleteKey } = useS3();
  log.info({ s3ObjectKey }, "Convert PDF");

  const inputFile = await downloadToLocal({
    s3ObjectKey,
    localFile: tempy.file({ extension: ".pdf" }),
  });
  log.info({ s3ObjectKey, inputFile }, "Download PDF to local");

  try {
    const fileKey = path.basename(s3ObjectKey);
    await updateSlideMeta({
      fileKey,
      stage: "converting",
    });

    const uploadedKeys = await convertAndUpload({
      fileKey: path.basename(s3ObjectKey),
      inputFile,
    });

    await updateSlideMeta({
      fileKey,
      slideCount: uploadedKeys.length,
      stage: "converted",
    });
    log.info(
      { s3ObjectKey, fileKey, slides: uploadedKeys.length },
      "Conversion completed"
    );
  } finally {
    log.debug({ s3ObjectKey }, "Clear workspace");
    fs.unlinkSync(inputFile);
    await deleteKey({ s3ObjectKey });
  }
}
