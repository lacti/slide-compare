import MatchCandidate from "./matchCandidate";

interface IndexPair {
  leftIndex: number;
  rightIndex: number;
}

interface ImperfectMatch {
  leftIndex: number;
  matches: MatchCandidate[];
}

export default interface MatchProcessing {
  perfectMatches: IndexPair[];
  imperfectMatches: ImperfectMatch[];
}
