import SlideMeta, { metaFilename } from "./slideMeta";

import useS3 from "../aws/useS3";

export default async function writeSlideMeta(meta: SlideMeta): Promise<void> {
  const { putJSON } = useS3();
  await putJSON({
    s3ObjectKey: `${meta.fileKey}/${metaFilename}`,
    value: meta,
  });
}
