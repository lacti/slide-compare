import SlideMeta, { metaFilename } from "./slideMeta";

import readSlideMeta from "./readSlideMeta";
import useS3 from "../aws/useS3";

export default async function updateSlideMeta(
  meta: Partial<SlideMeta> & { fileKey: string }
): Promise<void> {
  const { putJSON } = useS3();
  const s3ObjectKey = `${meta.fileKey}/${metaFilename}`;
  const oldMeta = await readSlideMeta(meta.fileKey);
  await putJSON({ s3ObjectKey, value: { ...oldMeta, ...meta } });
}
