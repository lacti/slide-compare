import SlideMeta, { metaFilename } from "./slideMeta";

import useS3 from "../aws/useS3";

export default async function readSlideMeta(
  fileKey: string
): Promise<SlideMeta> {
  const { getJSON } = useS3();
  const s3ObjectKey = `${fileKey}/${metaFilename}`;
  const meta = await getJSON<SlideMeta>({
    s3ObjectKey,
  });
  if (!meta?.fileKey) {
    throw new Error(`No old meta for ${fileKey}`);
  }
  return meta;
}
