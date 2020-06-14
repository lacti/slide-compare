import "source-map-support/register";

import { S3Handler } from "aws-lambda";
import compareOne from "../compare/compareOne";
import { handleS3 } from "./base";
import { logger } from "../utils/logger";
import { parseCompareS3Key } from "../compare/compareS3Key";

const log = logger.get("handle:compare", __filename);

export const handle: S3Handler = handleS3({
  log,
  handle: async (event) => {
    for (const {
      s3: {
        object: { key: s3ObjectKey },
      },
    } of event.Records) {
      const fileKeyPair = parseCompareS3Key(s3ObjectKey);
      try {
        await compareOne(fileKeyPair);
      } catch (error) {
        log.error({ s3ObjectKey, error }, "Error in comparing");
      }
    }
  },
});
