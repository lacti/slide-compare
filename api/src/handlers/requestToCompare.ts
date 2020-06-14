import "source-map-support/register";

import { ApiError, handleApi } from "./base";
import { toCompareS3Key, toComparedResultS3Key } from "../compare/compareS3Key";

import { APIGatewayProxyHandler } from "aws-lambda";
import { logger } from "../utils/logger";
import useS3 from "../aws/useS3";

const log = logger.get("handle:requestToCompare", __filename);

export const handle: APIGatewayProxyHandler = handleApi({
  log,
  handle: async (event) => {
    const { leftFileKey, rightFileKey } = event.pathParameters ?? {};
    if (!leftFileKey || !rightFileKey) {
      return new ApiError(404);
    }

    const { exists, putJSON } = useS3();
    if (
      await exists({
        s3ObjectKey: toComparedResultS3Key({ leftFileKey, rightFileKey }),
      })
    ) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, pending: false }),
      };
    }

    const s3ObjectKey = toCompareS3Key({ leftFileKey, rightFileKey });

    if (!(await exists({ s3ObjectKey }))) {
      await putJSON<{ created: number }>({
        s3ObjectKey,
        value: { created: Date.now() },
      });
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, pending: true }),
    };
  },
  options: {
    accesslog: true,
  },
});
