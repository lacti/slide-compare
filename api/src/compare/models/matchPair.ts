import CoordBounds from "./coordBounds";
import MatchType from "./matchType";

export default interface MatchPair {
  type: MatchType;
  leftIndex: number;
  rightIndex: number;
  areas: CoordBounds[];
}
