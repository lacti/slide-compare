import MatchProcessing from "./models/matchProcessing";
import { sumOfAreas } from "./models/coordBounds";

export default function getPureImperfectMatches({
  perfectMatches,
  imperfectMatches,
}: MatchProcessing): MatchProcessing["imperfectMatches"] {
  const perfectMatchedRightIndexes = perfectMatches.map(
    (pair) => pair.rightIndex
  );
  return imperfectMatches.map(({ leftIndex, matches }) => ({
    leftIndex,
    matches: matches
      .filter((tuple) => !perfectMatchedRightIndexes.includes(tuple.rightIndex))
      .sort((a, b) => sumOfAreas(a.areas) - sumOfAreas(b.areas)),
  }));
}
