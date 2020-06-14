import { Divider } from "@zeit-ui/react";
import { MatchType } from "../server/models/compare";
import React from "react";
import SlideMatch from "../models/slideMatch";
import SlidePairThumbnail from "./SlidePairThumbnail";
import SlideStatus from "./SlideStatus";

export default function SlidePairThumbnailList({
  matches,
  selectedPage,
  onThumbnailClick,
}: {
  matches: SlideMatch[];
  selectedPage: number;
  onThumbnailClick: (page: number) => void;
}) {
  function countByType(type: MatchType) {
    return matches.filter((match) => match.matchType === type).length;
  }
  return (
    <>
      <Divider y={1} />
      <SlideStatus countByType={countByType} />

      <Divider y={1} />
      {matches.map((match, page) => (
        <SlidePairThumbnail
          key={[
            "Thumbnail",
            match.leftFileKey,
            match.rightFileKey,
            match.leftIndex,
            match.rightIndex,
          ].join("_")}
          match={match}
          page={page}
          selected={page === selectedPage}
          onClick={() => onThumbnailClick(page)}
        />
      ))}
    </>
  );
}
