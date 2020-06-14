import findDifferentAreas, {
  FindDifferentAreasOptions,
} from "./findDifferentAreas";

import CoordBounds from "./models/coordBounds";

interface MatchCandidate {
  rightIndex: number;
  areas: CoordBounds[];
}

export type FindAnyMatchedOptions = {
  maxMovement: number;
} & FindDifferentAreasOptions;

export default async function findAnyMatched(
  rightFiles: string[],
  leftFile: string,
  leftIndex: number,
  options: FindAnyMatchedOptions
): Promise<MatchCandidate[]> {
  const candidates: MatchCandidate[] = [];
  async function findDiffAndUpdateCandidate(rightIndex: number) {
    // logger.debug(leftIndex, secondFiles.length, rightIndex);
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

  let beforeIndex = leftIndex;
  let afterIndex = leftIndex + 1;
  for (let movement = 0; movement < options.maxMovement; ++movement) {
    if (0 <= beforeIndex && beforeIndex < rightFiles.length) {
      if (await findDiffAndUpdateCandidate(beforeIndex)) {
        return newPerfectMatch(beforeIndex);
      }
      --beforeIndex;
    }
    if (0 <= afterIndex && afterIndex < rightFiles.length) {
      if (await findDiffAndUpdateCandidate(afterIndex)) {
        return newPerfectMatch(afterIndex);
      }
      ++afterIndex;
    }
  }
  return candidates;
}

function newPerfectMatch(rightIndex: number): MatchCandidate[] {
  return [{ rightIndex, areas: [] }];
}
