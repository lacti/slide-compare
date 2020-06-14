import { APIGatewayProxyHandler } from "aws-lambda";
import { toCompareS3Key } from "../compare/compareS3Key";
import useS3 from "../aws/useS3";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { leftFileKey, rightFileKey } = event.pathParameters ?? {};
  if (!leftFileKey || !rightFileKey) {
    return { statusCode: 404, body: "Not Found" };
  }

  const { exists, putJSON } = useS3();
  const s3ObjectKey = toCompareS3Key({ leftFileKey, rightFileKey });

  if (!(await exists({ s3ObjectKey }))) {
    await putJSON<{ created: number }>({
      s3ObjectKey,
      value: { created: Date.now() },
    });
  }
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
