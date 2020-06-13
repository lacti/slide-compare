import * as fs from "fs";

import { S3 } from "aws-sdk";

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
    return s3
      .upload({
        Bucket: bucketName,
        Key: s3ObjectKey,
        Body: fs.createReadStream(localFile),
      })
      .promise();
  }

  function deleteKey({ s3ObjectKey }: { s3ObjectKey: string }) {
    return s3
      .deleteObject({
        Bucket: bucketName,
        Key: s3ObjectKey,
      })
      .promise();
  }

  return { s3, bucketName, downloadToLocal, uploadLocalFile, deleteKey };
}
