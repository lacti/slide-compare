import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import { S3Handler } from "aws-lambda";
import convertOne from "../convert/convertOne";
import { logger } from "../utils/logger";

export const handle: S3Handler = async (event) => {
  for (const record of event.Records) {
    const s3ObjectKey = record.s3.object.key;
    try {
      await convertOne(s3ObjectKey);
    } catch (error) {
      logger.error("Error in converting [%s][%o]", s3ObjectKey, error);
    }
  }
};
