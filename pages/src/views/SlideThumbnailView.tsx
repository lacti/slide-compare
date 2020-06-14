import React from "react";
import SlideMatch from "../models/slideMatch";
import SlidePairThumbnailList from "../components/SlidePairThumbnailList";

export default function SlideThumbnailView({
  matches,
  selectedPage,
  onThumbnailClick,
}: {
  matches: SlideMatch[];
  selectedPage: number;
  onThumbnailClick: (newPage: number) => void;
}) {
  return (
    <SlidePairThumbnailList
      matches={matches}
      selectedPage={selectedPage}
      onThumbnailClick={onThumbnailClick}
    />
  );
}
