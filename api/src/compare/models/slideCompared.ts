import MatchPair from "./matchPair";
import SlideMeta from "../../slide/slideMeta";

export default interface SlideCompared {
  leftMeta: SlideMeta;
  rightMeta: SlideMeta;
  matchPairs: MatchPair[];
}
