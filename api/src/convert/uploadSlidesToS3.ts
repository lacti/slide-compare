import * as path from "path";

import pLimit from "p-limit";
import useS3 from "../aws/useS3";

export default async function uploadSlidesToS3({
  fileKey,
  slideFiles,
  resizedSlideFiles,
  concurrency = 4,
}: {
  fileKey: string;
  slideFiles: string[];
  resizedSlideFiles: string[];
  concurrency?: number;
}): Promise<string[]> {
  const { uploadLocalFile } = useS3();

  const uploadedKeys: string[] = [];
  const limit = pLimit(concurrency);
  const promises: Promise<unknown>[] = [];
  for (const slideFile of slideFiles) {
    const slideKey = `slides/${fileKey}/${path.basename(slideFile)}`;
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
  for (const resizedSlideFile of resizedSlideFiles) {
    const smallKey = `smalls/${fileKey}/${path.basename(resizedSlideFile)}`;
    uploadedKeys.push(smallKey);
    promises.push(
      limit(() =>
        uploadLocalFile({
          s3ObjectKey: smallKey,
          localFile: resizedSlideFile,
        })
      )
    );
  }
  await Promise.all(promises);
  return uploadedKeys;
}
