import "source-map-support/register";

import { ApiError, handleApi } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import getSlideFilename from "../slide/getSlideFilename";
import { logger } from "../utils/logger";
import useS3 from "../aws/useS3";

const log = logger.get("handle:getSlide", __filename);

export const handle: APIGatewayProxyHandler = handleApi({
  log,
  handle: async (event) => {
    const { fileKey, index } = event.pathParameters ?? {};
    if (!fileKey || !index) {
      throw new ApiError(404);
    }

    const { s3, bucketName } = useS3();
    const s3ObjectKey = `${fileKey}/${getSlideFilename(+index)}`;
    const s3Object = await s3
      .getObject({
        Bucket: bucketName,
        Key: s3ObjectKey,
      })
      .promise();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": s3Object.ContentLength!,
        "Cache-Control": `public, max-age=${30 * 24 * 60 * 60}`,
      },
      body: s3Object.Body?.toString("base64") ?? "",
      isBase64Encoded: true,
    };
  },
});
