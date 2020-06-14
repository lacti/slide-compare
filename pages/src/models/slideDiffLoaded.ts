import CompareInfo from "./compareInfo";
import SlideMatch from "./slideMatch";

export default interface SlideDiffLoaded {
  info: CompareInfo;
  matches: SlideMatch[];
}
