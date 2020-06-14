import * as fs from "fs";

import { S3 } from "aws-sdk";
import { logger } from "../utils/logger";

const log = logger.get("useS3", __filename);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useS3() {
  const s3 = new S3();
  const bucketName = process.env.TEMP_BUCKET!;

  function downloadToLocal({
    s3ObjectKey,
    localFile,
  }: {
    s3ObjectKey: string;
    localFile: string;
  }): Promise<string> {
    log.trace({ s3ObjectKey, localFile }, "s3:downloadToLocal");
    return new Promise<string>((resolve, reject) =>
      s3
        .getObject({
          Bucket: bucketName,
          Key: s3ObjectKey,
        })
        .createReadStream()
        .on("error", reject)
        .pipe(
          fs.createWriteStream(localFile).on("close", () => resolve(localFile))
        )
    );
  }

  function uploadLocalFile({
    s3ObjectKey,
    localFile,
  }: {
    s3ObjectKey: string;
    localFile: string;
  }) {
    log.trace({ s3ObjectKey, localFile }, "s3:uploadLocalFile");
    return s3
      .upload({
        Bucket: bucketName,
        Key: s3ObjectKey,
        Body: fs.createReadStream(localFile),
      })
      .promise();
  }

  function deleteKey({ s3ObjectKey }: { s3ObjectKey: string }) {
    log.trace({ s3ObjectKey }, "s3:deleteKey");
    return s3
      .deleteObject({
        Bucket: bucketName,
        Key: s3ObjectKey,
      })
      .promise();
  }

  function putJSON<T>({
    s3ObjectKey,
    value,
  }: {
    s3ObjectKey: string;
    value: T | null;
  }) {
    log.trace({ s3ObjectKey, value }, "s3:putJSON");
    return s3
      .putObject({
        Bucket: bucketName,
        Key: s3ObjectKey,
        Body: !value ? "" : JSON.stringify(value),
      })
      .promise();
  }

  function getJSON<T>({
    s3ObjectKey,
  }: {
    s3ObjectKey: string;
  }): Promise<T | null> {
    log.trace({ s3ObjectKey }, "s3:getJSON");
    return s3
      .getObject({
        Bucket: bucketName,
        Key: s3ObjectKey,
      })
      .promise()
      .then((result) => {
        if (!result.Body) {
          return null;
        }
        return JSON.parse(result.Body as string) as T;
      });
  }

  async function exists({
    s3ObjectKey,
  }: {
    s3ObjectKey: string;
  }): Promise<boolean> {
    log.trace({ s3ObjectKey }, "s3:exists");
    try {
      await s3
        .headObject({
          Bucket: bucketName,
          Key: s3ObjectKey,
        })
        .promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  return {
    s3,
    bucketName,
    downloadToLocal,
    uploadLocalFile,
    deleteKey,
    getJSON,
    putJSON,
    exists,
  };
}
