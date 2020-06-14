export interface SlideCompared {
  leftMeta: SlideMeta;
  rightMeta: SlideMeta;
  matchPairs: MatchPair[];
}

export interface ComparisonRequested {
  ok: boolean;
  pending?: boolean;
}

export interface SlideMeta {
  name: string;
  fileKey: string;
  slideCount: number;
  stage: "init" | "converting" | "converted";
}

export enum MatchType {
  PerfectMatched = "PerfectMatched",
  Matched = "Matched",
  Removed = "Removed",
  New = "New",
}

export interface MatchPair {
  type: MatchType;
  leftIndex: number;
  rightIndex: number;
  areas: CoordBounds[];
}

export interface CoordBounds {
  /**
   * X-coordinate of upper left corner
   */
  left: number;
  /**
   * Y-coordinate of upper left corner
   */
  top: number;
  /**
   * X-coordinate of bottom right corner
   */
  right: number;
  /**
   * Y-coordinate of bottom right corner
   */
  bottom: number;
}
