import MatchPair from "./models/matchPair";
import { logger } from "../utils/logger";
import { sumOfAreas } from "./models/coordBounds";

type PartialMatchPair = Pick<MatchPair, "type"> &
  Partial<Omit<MatchPair, "type">>;

type ResultAppend = (pair: PartialMatchPair) => void;

const log = logger.get("resultBag", __filename);

export default function newResultBag(): [MatchPair[], ResultAppend] {
  const result: MatchPair[] = [];

  const logAppend = logResultAppended();
  const append = resultAppend(result);

  return [
    result,
    (pair: PartialMatchPair) => {
      logAppend(pair);
      append(pair);
    },
  ];
}

function resultAppend(result: MatchPair[]) {
  return ({ type, leftIndex, rightIndex, areas }: PartialMatchPair) => {
    result.push({
      type,
      leftIndex: leftIndex ?? -1,
      rightIndex: rightIndex ?? -1,
      areas: areas ?? [],
    });
  };
}

function logResultAppended() {
  return ({ type, leftIndex, rightIndex, areas }: PartialMatchPair) => {
    log.trace(
      {
        type,
        leftIndex,
        rightIndex,
        area: sumOfAreas(areas ?? []),
        boxes: areas,
      },
      "Result added"
    );
  };
}
