import React from "react";
import SlideCompareView from "../views/SlideCompareView";
import SlideDiffLoaded from "../models/slideDiffLoaded";
import usePage from "../hooks/usePage";
import { useToasts } from "@zeit-ui/react";

export default function SlideShowPage({ matches, info }: SlideDiffLoaded) {
  const { page, onMouseDown } = usePage({
    initPage: 0,
    countOfPages: matches.length,
  });
  const [, setToast] = useToasts();

  React.useEffect(() => {
    setToast({ text: "Press ESC key to exit full screen", type: "secondary" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="SlideViewContainer" onMouseDown={onMouseDown}>
        <SlideCompareView
          matches={matches}
          page={page}
          leftName={info.leftName}
          rightName={info.rightName}
        />
      </div>
    </div>
  );
}
