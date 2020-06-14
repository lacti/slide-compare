import { CoordBounds, MatchType } from "../server/models/compare";

import SlideDiffInput from "./slideDiffInput";

export default interface SlideMatch extends SlideDiffInput {
  matchType: MatchType;
  leftIndex: number;
  rightIndex: number;
  areas: CoordBounds[];
}
