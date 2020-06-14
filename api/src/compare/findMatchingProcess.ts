import findAnyMatched, { FindAnyMatchedOptions } from "./findAnyMatched";

import MatchCandidate from "./models/matchCandidate";
import MatchProcessing from "./models/matchProcessing";
import { logger } from "../utils/logger";

const log = logger.get("findMatchProcessing", __filename);

export default async function findMatchProcessing({
  leftFiles,
  rightFiles,
  matchOptions,
}: {
  leftFiles: string[];
  rightFiles: string[];
  matchOptions: FindAnyMatchedOptions;
}): Promise<MatchProcessing> {
  const processing: MatchProcessing = {
    perfectMatches: [],
    imperfectMatches: [],
  };
  for (let leftIndex = 0; leftIndex < leftFiles.length; ++leftIndex) {
    log.trace(
      { leftIndex, countOfLeftFiles: leftFiles.length },
      "Find the match processing"
    );

    const matches = await findAnyMatched(
      rightFiles,
      leftFiles[leftIndex],
      leftIndex,
      matchOptions
    );
    if (isPerfectMatched(matches)) {
      processing.perfectMatches.push({
        leftIndex,
        rightIndex: matches[0].rightIndex,
      });
    } else {
      processing.imperfectMatches.push({ leftIndex, matches });
    }
  }
  return processing;
}

function isPerfectMatched(candidates: MatchCandidate[]) {
  return candidates.length === 1 && candidates[0].areas.length === 0;
}
