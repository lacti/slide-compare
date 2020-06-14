import "./SlideLoadScreen.css";

import { StringParam, useQueryParam } from "use-query-params";

import React from "react";
import SlideDiffInput from "../models/slideDiffInput";
import SlideDiffLoaded from "../models/slideDiffLoaded";
import SlideInputPage from "../pages/SlideInputPage";
import SlideLoadingPage from "../pages/SlideLoadingPage";

const keySpecDelimiter = "_";

export default function SlideLoadScreen({
  onLoaded,
}: {
  onLoaded: (loaded: SlideDiffLoaded) => void;
}) {
  const [keyspecParam, setKeyspecParam] = useQueryParam("keyspec", StringParam);
  const [input] = React.useState<SlideDiffInput | null>(() => {
    if (keyspecParam) {
      const [leftFileKey, rightFileKey] = keyspecParam.split(keySpecDelimiter);
      return { leftFileKey, rightFileKey };
    }
    return null;
  });

  return input ? (
    <SlideLoadingPage input={input} onCompleted={onLoaded} />
  ) : (
    <SlideInputPage
      onCompleted={(loaded) => {
        setKeyspecParam(
          [loaded.info.leftFileKey, loaded.info.rightFileKey].join(
            keySpecDelimiter
          )
        );
        onLoaded(loaded);
      }}
    />
  );
}
