import "./SlidePageScreen.css";

import CompareInfo from "../models/compareInfo";
import { MatchType } from "../server/models/compare";
import React from "react";
import SlideDiffPage from "../pages/SlideDiffPage";
import SlideMatch from "../models/slideMatch";
import SlideShowPage from "../pages/SlideShowPage";

export default function SlidePageScreen({
  matches,
  info,
}: {
  matches: SlideMatch[];
  info: CompareInfo;
}) {
  const [showAll, setShowAll] = React.useState<boolean>(false);
  const [slideShow, setSlideShow] = React.useState<boolean>(false);

  const filteredMatches = showAll
    ? matches
    : matches.filter((match) => match.matchType !== MatchType.PerfectMatched);
  React.useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      switch (event.key) {
        case "Escape":
          if (slideShow) {
            setSlideShow(false);
          }
          break;
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [slideShow]);

  return slideShow ? (
    <SlideShowPage matches={filteredMatches} info={info} />
  ) : (
    <SlideDiffPage
      matches={filteredMatches}
      info={info}
      showAll={showAll}
      onFilterChanged={setShowAll}
      onStartShow={() => setSlideShow(true)}
    />
  );
}
