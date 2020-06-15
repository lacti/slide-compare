import MatchType from "../../src/compare/models/matchType";
import buildResultBag from "../../src/compare/buildResultBag";

test("exclude-perfect-matches", () => {
  const matchPairs = buildResultBag({
    processing: {
      perfectMatches: [
        { leftIndex: 0, rightIndex: 0 },
        { leftIndex: 2, rightIndex: 2 },
      ],
      imperfectMatches: [
        {
          leftIndex: 1,
          matches: [
            {
              rightIndex: 0,
              areas: [{ left: 0, top: 0, bottom: 100, right: 400 }],
            },
            {
              rightIndex: 1,
              areas: [{ left: 0, top: 0, bottom: 200, right: 400 }],
            },
            {
              rightIndex: 2,
              areas: [{ left: 0, top: 0, bottom: 150, right: 400 }],
            },
          ],
        },
      ],
    },
    countOfLeftFiles: 3,
    countOfRightFiles: 3,
  });
  expect(matchPairs).toEqual([
    { type: MatchType.PerfectMatched, leftIndex: 0, rightIndex: 0, areas: [] },
    {
      type: MatchType.Matched,
      leftIndex: 1,
      rightIndex: 1,
      areas: [{ left: 0, top: 0, bottom: 200, right: 400 }],
    },
    { type: MatchType.PerfectMatched, leftIndex: 2, rightIndex: 2, areas: [] },
  ]);
});
