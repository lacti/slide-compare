import IndexPair from "./models/indexPair";
import MatchPair from "./models/matchPair";
import MatchProcessing from "./models/matchProcessing";
import MatchType from "./models/matchType";
import getPureImperfectMatches from "./getPureImperfectMatches";
import newResultBag from "./newResultBag";

export default function buildResultBag({
  processing,
  countOfLeftFiles,
  countOfRightFiles,
}: {
  processing: MatchProcessing;
  countOfLeftFiles: number;
  countOfRightFiles: number;
}): MatchPair[] {
  const [bag, append] = newResultBag();

  // Step 1. Find all perfect matches.
  for (let leftIndex = 0; leftIndex < countOfLeftFiles; ++leftIndex) {
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

  // Step 2. Match imperfects greedy.
  const pureImperfects = getPureImperfectMatches(processing);
  const imperfectMatched: IndexPair[] = [];
  for (const { leftIndex, rightIndex, areas } of pureImperfects) {
    if (
      imperfectMatched.some(
        (matched) =>
          matched.leftIndex === leftIndex || matched.rightIndex === rightIndex
      )
    ) {
      continue;
    }
    append({
      type: MatchType.Matched,
      leftIndex,
      rightIndex,
      areas,
    });
    imperfectMatched.push({ leftIndex, rightIndex });
  }

  // Step 3. Find all removed slides.
  const matchedLeftIndexes = new Set(
    bag.map((pair) => pair.leftIndex).filter((index) => index >= 0)
  );
  for (let leftIndex = 0; leftIndex < countOfLeftFiles; ++leftIndex) {
    if (matchedLeftIndexes.has(leftIndex)) {
      continue;
    }
    append({ type: MatchType.Removed, leftIndex });
  }

  // Step 4. Find all newly added slides.
  const matchedRightIndexes = new Set(
    bag.map((pair) => pair.rightIndex).filter((index) => index >= 0)
  );
  for (let rightIndex = 0; rightIndex < countOfRightFiles; ++rightIndex) {
    if (matchedRightIndexes.has(rightIndex)) {
      continue;
    }
    append({ type: MatchType.New, rightIndex });
  }

  return bag.sort((a, b) =>
    a.rightIndex !== -1 && b.rightIndex !== -1
      ? a.rightIndex - b.rightIndex
      : a.rightIndex === -1
      ? 1
      : b.rightIndex === -1
      ? -1
      : a.leftIndex - b.leftIndex
  );
}
