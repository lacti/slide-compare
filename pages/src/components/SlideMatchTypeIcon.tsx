import {
  ChevronLeft,
  ChevronRight,
  Code,
  Icon,
  ThumbsUp,
} from "@zeit-ui/react-icons";

import { MatchType } from "../server/models/compare";
import React from "react";

export default function SlideMatchTypeIcon({
  matchType,
  color = "grey",
  onClick,
}: {
  matchType: MatchType;
  color?: string;
  onClick?: () => void;
}) {
  const MatchIcon = resolveMatchTypeIcon(matchType);
  return (
    <span title={matchType} onClick={onClick}>
      <MatchIcon color={color} />
    </span>
  );
}

export function resolveMatchTypeIcon(matchType: MatchType): Icon {
  switch (matchType) {
    case MatchType.PerfectMatched:
      return ThumbsUp;
    case MatchType.Matched:
      return Code;
    case MatchType.Removed:
      return ChevronLeft;
    case MatchType.New:
      return ChevronRight;
  }
}
