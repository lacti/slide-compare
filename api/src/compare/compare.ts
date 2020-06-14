import { FindAnyMatchedOptions } from "./findAnyMatched";
import MatchPair from "./models/matchPair";
import buildResultBag from "./buildResultBag";
import findMatchProcessing from "./findMatchingProcess";
import listFiles from "../utils/listFiles";
import { logger } from "../utils/logger";

const log = logger.get("compare", __filename);

export default async function compare({
  leftPath,
  rightPath,
  maxMovement = 3,
  shouldCluster = true,
  clustersSize = 8,
}: {
  leftPath: string;
  rightPath: string;
} & Partial<FindAnyMatchedOptions>): Promise<MatchPair[]> {
  const leftFiles = listFiles(leftPath);
  const rightFiles = listFiles(rightPath);

  log.trace(
    { leftPath, leftFiles, rightPath, rightFiles },
    "Start to compare with slide files"
  );

  const processing = await findMatchProcessing({
    leftFiles,
    rightFiles,
    matchOptions: {
      maxMovement,
      shouldCluster,
      clustersSize,
    },
  });
  return buildResultBag({
    leftFiles,
    rightFiles,
    processing,
  });
}
