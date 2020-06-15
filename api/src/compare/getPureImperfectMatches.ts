import MatchProcessing from "./models/matchProcessing";
import PureImperfectMatch from "./models/pureImperfectMatch";
import { sumOfAreas } from "./models/coordBounds";

export default function getPureImperfectMatches({
  perfectMatches,
  imperfectMatches,
}: MatchProcessing): PureImperfectMatch[] {
  const perfectMatchedRightIndexes = perfectMatches.map(
    (pair) => pair.rightIndex
  );

  const pures: PureImperfectMatch[] = [];
  for (const { leftIndex, matches } of imperfectMatches.map(
    ({ leftIndex, matches }) => ({
      leftIndex,
      matches: matches.filter(
        (tuple) => !perfectMatchedRightIndexes.includes(tuple.rightIndex)
      ),
    })
  )) {
    for (const match of matches) {
      pures.push({ leftIndex, ...match });
    }
  }
  return pures.sort((a, b) => sumOfAreas(a.areas) - sumOfAreas(b.areas));
}
