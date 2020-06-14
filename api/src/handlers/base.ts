import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  S3Event,
  S3Handler,
} from "aws-lambda";
import { Logger, flushSlack } from "../utils/logger";

export class ApiError {
  constructor(
    public readonly statusCode: number,
    public readonly body: string = ""
  ) {}
}

interface HandleWithLogger<H> {
  log: Logger;
  handle: H;
  options?: {
    accesslog?: boolean;
  };
}

export function handleApi({
  log,
  handle: delegate,
  options: { accesslog = false } = {},
}: HandleWithLogger<
  (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>
>): APIGatewayProxyHandler {
  return async (event) => {
    const logContext = {
      path: event.path,
      query: event.queryStringParameters,
    };
    try {
      (accesslog ? log.info : log.trace)(
        logContext,
        "Start to handle API event"
      );
      const result = await delegate(event);
      (accesslog ? log.info : log.trace)(logContext, "API event is completed");
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        log.trace({ ...logContext, error }, "Error occurred in " + event.path);
        return { statusCode: error.statusCode, body: error.body };
      }
      log.warn(
        { ...logContext, error },
        "Error occurred in handling API event"
      );
    } finally {
      await flushSlack();
    }
    return { statusCode: 404, body: "Not Found" };
  };
}

export function handleS3({
  log,
  handle: delegate,
  options: { accesslog = true } = {},
}: HandleWithLogger<(event: S3Event) => Promise<void>>): S3Handler {
  return async (event) => {
    const logContext = {
      s3Objects: event.Records.map((record) => ({
        bucket: record.s3.bucket.name,
        key: record.s3.object.key,
      })),
    };
    try {
      (accesslog ? log.info : log.trace)(
        logContext,
        "Start to handle S3 event"
      );
      await delegate(event);
      (accesslog ? log.info : log.trace)(logContext, "S3 event is completed");
    } catch (error) {
      log.warn({ ...logContext, error }, "Error occurred in handling S3 event");
    }
    await flushSlack();
  };
}
