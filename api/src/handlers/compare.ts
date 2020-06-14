import { S3Handler } from "aws-lambda";
import compareOne from "../compare/compareOne";
import { logger } from "../utils/logger";
import { parseCompareS3Key } from "../compare/compareS3Key";

export const handle: S3Handler = async (event) => {
  for (const {
    s3: {
      object: { key: s3ObjectKey },
    },
  } of event.Records) {
    const fileKeyPair = parseCompareS3Key(s3ObjectKey);
    try {
      await compareOne(fileKeyPair);
    } catch (error) {
      logger.error("Error in comparing [%s][%o]", s3ObjectKey, error);
    }
  }
};
