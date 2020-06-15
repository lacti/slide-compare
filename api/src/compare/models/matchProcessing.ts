import IndexPair from "./indexPair";
import MatchCandidate from "./matchCandidate";

interface ImperfectMatch {
  leftIndex: number;
  matches: MatchCandidate[];
}

export default interface MatchProcessing {
  perfectMatches: IndexPair[];
  imperfectMatches: ImperfectMatch[];
}
