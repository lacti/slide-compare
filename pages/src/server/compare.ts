import { ComparisonRequested, SlideCompared } from "./models/compare";

import SlideDiffLoaded from "../models/slideDiffLoaded";
import { ensureJSONResult } from "./ensureResult";
import getCompared from "./getCompared";
import serverUrls from "./serverUrls";
import sleep from "../utils/sleep";

const waitingIntervals = [3, 15, 15, 15, 15, 10, 10, 10, 5, 5, 5, 2];

export default async function compare({
  leftFileKey,
  rightFileKey,
}: {
  leftFileKey: string;
  rightFileKey: string;
}): Promise<SlideDiffLoaded> {
  const requested = await fetch(
    serverUrls.requestToCompare({ leftFileKey, rightFileKey }),
    {
      method: "PUT",
    }
  ).then((r) => ensureJSONResult<ComparisonRequested>(r));
  const compared = await (async () => {
    if (requested.pending === false) {
      return getCompared({ leftFileKey, rightFileKey }).then(
        (r) => r as SlideCompared
      );
    }
    for (const interval of waitingIntervals) {
      await sleep(interval * 1000);
      const maybe = await getCompared({ leftFileKey, rightFileKey });
      if ("pending" in maybe) {
        continue;
      }
      return maybe as SlideCompared;
    }
    throw new Error("Comparison timeout.");
  })();

  const matches = compared.matchPairs.map((pair) => ({
    leftFileKey: compared.leftMeta.fileKey,
    rightFileKey: compared.rightMeta.fileKey,
    matchType: pair.type,
    leftIndex: pair.leftIndex,
    rightIndex: pair.rightIndex,
    areas: pair.areas,
  }));
  return {
    matches,
    info: {
      leftFileKey,
      leftName: compared.leftMeta.name,
      rightFileKey,
      rightName: compared.rightMeta.name,
    },
  };
}
