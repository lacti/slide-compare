import "source-map-support/register";

import { S3Handler } from "aws-lambda";
import convertOne from "../convert/convertOne";
import { handleS3 } from "./base";
import { logger } from "../utils/logger";

const log = logger.get("handle:convertPdf", __filename);

export const handle: S3Handler = handleS3({
  log,
  handle: async (event) => {
    for (const record of event.Records) {
      const s3ObjectKey = record.s3.object.key;
      try {
        await convertOne(s3ObjectKey);
      } catch (error) {
        log.error({ s3ObjectKey, error }, "Error in converting");
      }
    }
  },
});
