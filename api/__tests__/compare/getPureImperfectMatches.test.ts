import getPureImperfectMatches from "../../src/compare/getPureImperfectMatches";

test("exclude-perfect-matches", () => {
  const pureImperfects = getPureImperfectMatches({
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
  });
  expect(pureImperfects).toEqual([
    {
      leftIndex: 1,
      rightIndex: 1,
      areas: [{ left: 0, top: 0, bottom: 200, right: 400 }],
    },
  ]);
});
