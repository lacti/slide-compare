import { APIGatewayProxyHandler } from "aws-lambda";
import readSlideMeta from "../slide/readSlideMeta";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { fileKey } = event.pathParameters ?? {};
  if (!fileKey) {
    return { statusCode: 404, body: "Not Found" };
  }

  try {
    const meta = await readSlideMeta(fileKey);
    return { statusCode: 200, body: JSON.stringify(meta) };
  } catch (error) {
    console.error(error);
    return { statusCode: 404, body: "Not Found" };
  }
};
