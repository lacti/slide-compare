import "source-map-support/register";

import { ApiError, handleApi } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import SlideCompared from "../compare/models/slideCompared";
import { logger } from "../utils/logger";
import { toComparedResultS3Key } from "../compare/compareS3Key";
import useS3 from "../aws/useS3";

const log = logger.get("handle:getCompared", __filename);

export const handle: APIGatewayProxyHandler = handleApi({
  log,
  handle: async (event) => {
    const { leftFileKey, rightFileKey } = event.pathParameters ?? {};
    if (!leftFileKey || !rightFileKey) {
      throw new ApiError(404);
    }

    const s3ObjectKey = toComparedResultS3Key({ leftFileKey, rightFileKey });
    const { exists, getJSON } = useS3();
    if (!(await exists({ s3ObjectKey }))) {
      return { statusCode: 200, body: JSON.stringify({ pending: true }) };
    }
    const compared = await getJSON<SlideCompared>({ s3ObjectKey });
    return { statusCode: 200, body: JSON.stringify(compared) };
  },
});
