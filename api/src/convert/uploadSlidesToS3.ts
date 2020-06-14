import * as path from "path";

import pLimit from "p-limit";
import useS3 from "../aws/useS3";

export default async function uploadSlidesToS3({
  fileKey,
  slideFiles,
  resizedSlidesZipFile,
  concurrency = 4,
}: {
  fileKey: string;
  slideFiles: string[];
  resizedSlidesZipFile: string;
  concurrency?: number;
}): Promise<string[]> {
  const { uploadLocalFile } = useS3();

  const uploadedKeys: string[] = [];
  const limit = pLimit(concurrency);
  const promises: Promise<unknown>[] = [];
  for (const slideFile of slideFiles) {
    const slideKey = `${fileKey}/${path.basename(slideFile)}`;
    uploadedKeys.push(slideKey);
    promises.push(
      limit(() =>
        uploadLocalFile({
          s3ObjectKey: slideKey,
          localFile: slideFile,
        })
      )
    );
  }
  const resizedZipKey = `${fileKey}/${path.basename(resizedSlidesZipFile)}`;
  uploadedKeys.push(resizedZipKey);
  promises.push(
    limit(() =>
      uploadLocalFile({
        s3ObjectKey: resizedZipKey,
        localFile: resizedSlidesZipFile,
      })
    )
  );
  await Promise.all(promises);
  return uploadedKeys;
}
