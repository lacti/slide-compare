import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import { ApiError, handleApi } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import { contentType } from "mime-types";
import { logger } from "../utils/logger";

const log = logger.get("handle:serveHtml", __filename);
const resourceRoot = ".pages";

const textTypes = [".css", ".html", ".js", ".json", ".map", ".svg", ".txt"];

function translateToBundlePath(requestUrl: string) {
  let maybe = requestUrl;
  while (maybe.startsWith("/")) {
    maybe = maybe.substr(1);
  }
  return maybe || "index.html";
}

export const handle: APIGatewayProxyHandler = handleApi({
  log,
  handle: async (event) => {
    const requestPath = translateToBundlePath(event.path);
    const resourceFilePath = path.join(resourceRoot, requestPath);
    log.trace(
      { requestPath, resourceFilePath },
      "Find a static resource to serve"
    );
    if (!fs.existsSync(resourceFilePath)) {
      throw new ApiError(404);
    }
    const toBase64 = !textTypes.some((ext) => requestPath.endsWith(ext));
    return {
      statusCode: 200,
      headers: {
        "Content-Type":
          contentType(path.basename(resourceFilePath)) ||
          "application/octet-stream",
        "Content-Length": fs.lstatSync(resourceFilePath).size,
        "Cache-Control": `public, max-age=${
          resourceFilePath.endsWith(".html") ? 10 * 60 : 30 * 24 * 60 * 60
        }`,
      },
      body: fs
        .readFileSync(resourceFilePath)
        .toString(toBase64 ? "base64" : "utf-8"),
      isBase64Encoded: toBase64,
    };
  },
});
