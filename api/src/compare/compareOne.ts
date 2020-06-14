import * as fs from "fs";

import { toCompareS3Key, toComparedResultS3Key } from "../compare/compareS3Key";

import FileKeyPair from "./models/fileKeyPair";
import SlideCompared from "./models/slideCompared";
import compare from "./compare";
import downloadResizedAndUnzip from "./downloadResizedAndUnzip";
import { logger } from "../utils/logger";
import readSlideMeta from "../slide/readSlideMeta";
import tempy from "tempy";
import useS3 from "../aws/useS3";

const log = logger.get("compareOne", __filename);

export default async function compareOne({
  leftFileKey,
  rightFileKey,
}: FileKeyPair): Promise<void> {
  const { deleteKey, putJSON } = useS3();
  log.info({ leftFileKey, rightFileKey }, "Start compare one");

  const [leftUnzipped, rightUnzipped] = [tempy.directory(), tempy.directory()];
  try {
    const [leftMeta, rightMeta] = await Promise.all([
      readSlideMeta(leftFileKey),
      readSlideMeta(rightFileKey),
    ]);

    await Promise.all([
      downloadResizedAndUnzip({
        fileKey: leftFileKey,
        unzippedPath: leftUnzipped,
      }),
      downloadResizedAndUnzip({
        fileKey: rightFileKey,
        unzippedPath: rightUnzipped,
      }),
    ]);
    const matchPairs = await compare({
      leftPath: leftUnzipped,
      rightPath: rightUnzipped,
    });
    await putJSON<SlideCompared>({
      s3ObjectKey: toComparedResultS3Key({ leftFileKey, rightFileKey }),
      value: { leftMeta, rightMeta, matchPairs },
    });
  } finally {
    fs.rmdirSync(leftUnzipped, { recursive: true });
    fs.rmdirSync(rightUnzipped, { recursive: true });
    await deleteKey({
      s3ObjectKey: toCompareS3Key({ leftFileKey, rightFileKey }),
    });
  }
}
