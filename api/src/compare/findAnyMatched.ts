import findDifferentAreas, {
  FindDifferentAreasOptions,
} from "./findDifferentAreas";

import CoordBounds from "./models/coordBounds";
import { logger } from "../utils/logger";

interface MatchCandidate {
  rightIndex: number;
  areas: CoordBounds[];
}

export type FindAnyMatchedOptions = {
  maxMovement: number;
} & FindDifferentAreasOptions;

const log = logger.get("findAnyMatched", __filename);

export default async function findAnyMatched(
  rightFiles: string[],
  leftFile: string,
  leftIndex: number,
  options: FindAnyMatchedOptions
): Promise<MatchCandidate[]> {
  const candidates: MatchCandidate[] = [];
  async function findDiffAndUpdateCandidate(rightIndex: number) {
    log.trace(
      { leftIndex, countOfRightFiles: rightFiles.length, rightIndex },
      "Try to find any matched slide pair"
    );
    const areas = await findDifferentAreas(
      leftFile,
      rightFiles[rightIndex],
      options
    );
    if (areas.length === 0) {
      return true;
    }
    candidates.push({ rightIndex, areas });
    return false;
  }

  // In almost cases, a new presentation has more new slides.
  let afterIndex = leftIndex;
  for (let movement = 0; movement < options.maxMovement; ++movement) {
    if (0 <= afterIndex && afterIndex < rightFiles.length) {
      if (await findDiffAndUpdateCandidate(afterIndex)) {
        return newPerfectMatch(afterIndex);
      }
    }
    ++afterIndex;
  }

  // Or, maybe they can be removed.
  let beforeIndex = leftIndex - 1;
  for (let movement = 0; movement < options.maxMovement; ++movement) {
    if (0 <= beforeIndex && beforeIndex < rightFiles.length) {
      if (await findDiffAndUpdateCandidate(beforeIndex)) {
        return newPerfectMatch(beforeIndex);
      }
    }
    --beforeIndex;
  }
  return candidates;
}

function newPerfectMatch(rightIndex: number): MatchCandidate[] {
  return [{ rightIndex, areas: [] }];
}
