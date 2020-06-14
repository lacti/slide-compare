import "source-map-support/register";

import { ApiError, handleApi } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import { logger } from "../utils/logger";
import readSlideMeta from "../slide/readSlideMeta";

const log = logger.get("handle:getSlideMeta", __filename);

export const handle: APIGatewayProxyHandler = handleApi({
  log,
  handle: async (event) => {
    const { fileKey } = event.pathParameters ?? {};
    if (!fileKey) {
      throw new ApiError(404);
    }

    const meta = await readSlideMeta(fileKey);
    return { statusCode: 200, body: JSON.stringify(meta) };
  },
});
