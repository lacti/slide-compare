import { Description, Spacer, Tooltip } from "@zeit-ui/react";

import { MatchType } from "../server/models/compare";
import React from "react";
import { resolveMatchTypeIcon } from "./SlideMatchTypeIcon";

export default function SlideStatus({
  countByType,
}: {
  countByType: (matchType: MatchType) => number;
}) {
  const typeCounts = [
    MatchType.PerfectMatched,
    MatchType.Matched,
    MatchType.New,
    MatchType.Removed,
  ]
    .map((type) => ({ type, count: countByType(type) }))
    .filter((tuple) => tuple.count > 0);
  return (
    <Description
      title="DIFF STATUS"
      content={typeCounts.map(({ type, count }, index) => (
        <span key={`Status_${type}`}>
          {index > 0 && <Spacer inline x={0.7} />}
          <SlideStatusItem matchType={type} count={count} />
        </span>
      ))}
    />
  );
}

function SlideStatusItem({
  matchType,
  count,
}: {
  matchType: MatchType;
  count: number;
}) {
  const MatchIcon = resolveMatchTypeIcon(matchType);
  return (
    <Tooltip
      text={`# of ${matchType} slides: ${count}`}
      placement="bottomStart"
      type="dark"
    >
      <MatchIcon size={16} />
      {count}
    </Tooltip>
  );
}
