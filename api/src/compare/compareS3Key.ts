import * as path from "path";

import FileKeyPair from "./models/fileKeyPair";

export function toCompareS3Key({
  leftFileKey,
  rightFileKey,
}: FileKeyPair): string {
  return `uploads/${leftFileKey}_${rightFileKey}.compare`;
}

export function parseCompareS3Key(s3ObjectKey: string): FileKeyPair {
  const keys = path.basename(s3ObjectKey, path.extname(s3ObjectKey));
  const [leftFileKey, rightFileKey] = keys.split("_");
  if (!leftFileKey || !rightFileKey) {
    throw new Error("Invalid compare key: " + s3ObjectKey);
  }
  return { leftFileKey, rightFileKey };
}

export function toComparedResultS3Key({
  leftFileKey,
  rightFileKey,
}: FileKeyPair): string {
  return `${leftFileKey}_${rightFileKey}.json`;
}
