import React from "react";
import serverUrls from "../server/serverUrls";
import { white1x1DataUrl } from "../utils/white1x1";

export default function SlideImage({
  fileKey,
  slide,
  className,
}: {
  fileKey: string;
  slide: number;
  className: string;
}) {
  return slide >= 0 ? (
    <img
      className={className}
      src={serverUrls.getSlideImage({ fileKey, slide }) ?? white1x1DataUrl}
      alt={`Slide ${slide}`}
      title={`Slide ${slide}`}
    />
  ) : (
    <span></span>
  );
}
