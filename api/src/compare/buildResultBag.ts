import MatchPair from "./models/matchPair";
import MatchProcessing from "./models/matchProcessing";
import MatchType from "./models/matchType";
import getPureImperfectMatches from "./getPureImperfectMatches";
import newResultBag from "./newResultBag";

export default function buildResultBag({
  processing,
  leftFiles,
  rightFiles,
}: {
  processing: MatchProcessing;
  leftFiles: string[];
  rightFiles: string[];
}): MatchPair[] {
  const [bag, append] = newResultBag();

  // Step 1. Find all perfect matches.
  for (let leftIndex = 0; leftIndex < leftFiles.length; ++leftIndex) {
    const maybePerfectMatch = processing.perfectMatches.find(
      (tuple) => tuple.leftIndex === leftIndex
    );
    if (maybePerfectMatch === undefined) {
      continue;
    }
    append({
      type: MatchType.PerfectMatched,
      leftIndex,
      rightIndex: maybePerfectMatch.rightIndex,
    });
  }

  // Step 2. Find all removed and imperfect matches.
  const imperfectsWithoutPerfects = getPureImperfectMatches(processing);
  for (let leftIndex = 0; leftIndex < leftFiles.length; ++leftIndex) {
    const maybeImperfectMatch = imperfectsWithoutPerfects.find(
      (tuple) => tuple.leftIndex === leftIndex
    );
    if (maybeImperfectMatch === undefined) {
      continue;
    }
    if (maybeImperfectMatch.matches.length === 0) {
      append({
        type: MatchType.Removed,
        leftIndex,
      });
    } else {
      append({
        type: MatchType.Matched,
        leftIndex,
        rightIndex: maybeImperfectMatch.matches[0].rightIndex,
        areas: maybeImperfectMatch.matches[0].areas,
      });
    }
  }

  // Step 3. Find all newly added slides.
  const matchedRightIndexes = new Set(
    bag.map((pair) => pair.rightIndex).filter((index) => index >= 0)
  );
  for (let rightIndex = 0; rightIndex < rightFiles.length; ++rightIndex) {
    if (matchedRightIndexes.has(rightIndex)) {
      continue;
    }
    append({ type: MatchType.New, rightIndex });
  }

  return bag.sort((a, b) =>
    a.leftIndex !== -1 && b.leftIndex !== -1
      ? a.leftIndex - b.rightIndex
      : a.leftIndex === -1
      ? 1
      : b.leftIndex === -1
      ? -1
      : a.rightIndex - b.rightIndex
  );
}
