import "source-map-support/register";

import { APIGatewayProxyHandler } from "aws-lambda";
import getSlideFilename from "../slide/getSlideFilename";
import useS3 from "../aws/useS3";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { fileKey, index } = event.pathParameters ?? {};
  if (!fileKey || !index) {
    return { statusCode: 404, body: "Not Found" };
  }

  const { s3, bucketName } = useS3();
  const s3ObjectKey = `${fileKey}/${getSlideFilename(+index)}`;
  try {
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
  } catch (error) {
    console.error(error);
    return { statusCode: 404, body: "Not Found" };
  }
};
