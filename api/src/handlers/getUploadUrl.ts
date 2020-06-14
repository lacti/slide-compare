import "source-map-support/register";

import { APIGatewayProxyHandler } from "aws-lambda";
import useS3 from "../aws/useS3";
import { v4 as uuidv4 } from "uuid";
import writeSlideMeta from "../slide/writeSlideMeta";

const allowedTypes = ["pdf"];

export const handle: APIGatewayProxyHandler = async (event) => {
  const { type = "pdf", name } = event.queryStringParameters ?? {};
  if (!name || !allowedTypes.includes(type)) {
    return { statusCode: 404, body: "Not Found" };
  }

  const { s3, bucketName } = useS3();
  const fileKey = newFileKey(type);
  const signedUrl = s3.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: `uploads/${fileKey}`,
    Expires: 60 * 10,
    ContentType: `application/${type}`,
    ACL: "public-read",
  });

  await writeSlideMeta({ name, fileKey, slideCount: -1, stage: "init" });
  return {
    statusCode: 200,
    body: JSON.stringify({ fileKey, url: signedUrl }),
  };
};

function newFileKey(type: string) {
  const newHash = (uuidv4() + uuidv4()).replace(/-/g, "");
  return `${newHash}.${type}`;
}
