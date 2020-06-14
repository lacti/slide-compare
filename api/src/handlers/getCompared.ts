import { APIGatewayProxyHandler } from "aws-lambda";
import SlideCompared from "../compare/models/slideCompared";
import { toComparedResultS3Key } from "../compare/compareS3Key";
import useS3 from "../aws/useS3";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { leftFileKey, rightFileKey } = event.pathParameters ?? {};
  if (!leftFileKey || !rightFileKey) {
    return { statusCode: 404, body: "Not Found" };
  }

  const s3ObjectKey = toComparedResultS3Key({ leftFileKey, rightFileKey });
  const { getJSON } = useS3();
  const compared = await getJSON<SlideCompared>({ s3ObjectKey });
  return { statusCode: 200, body: JSON.stringify(compared) };
};
