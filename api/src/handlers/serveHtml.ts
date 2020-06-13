import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import { APIGatewayProxyHandler } from "aws-lambda";
import { contentType } from "mime-types";

const resourceRoot = ".pages";
const publicUrl = process.env.PUBLIC_URL!;

const textTypes = [".css", ".html", ".js", ".json", ".map", ".svg", ".txt"];

function translateToBundlePath(requestUrl: string) {
  let maybe = requestUrl.startsWith(publicUrl)
    ? requestUrl.substr(publicUrl.length)
    : requestUrl;
  while (maybe.startsWith("/")) {
    maybe = maybe.substr(1);
  }
  return maybe || "index.html";
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const requestPath = translateToBundlePath(event.path);
  const resourceFilePath = path.join(resourceRoot, requestPath);
  console.log(requestPath, resourceFilePath);
  if (!fs.existsSync(resourceFilePath)) {
    return { statusCode: 404, body: "Not Found" };
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
};
