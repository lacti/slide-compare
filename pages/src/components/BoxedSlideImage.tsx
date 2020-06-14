import { CoordBounds } from "../server/models/compare";
import React from "react";
import SlideImage from "./SlideImage";
import loadImageWithBoxes from "../utils/loadImageWithBoxes";
import serverUrls from "../server/serverUrls";

export default function BoxedSlideImage({
  fileKey,
  slide,
  className,
  boxes,
}: {
  fileKey: string;
  slide: number;
  className?: string;
  boxes: CoordBounds[];
}) {
  const [boxedImage, setBoxedImage] = React.useState<string | null>(null);
  React.useEffect(() => {
    const imageUrl = serverUrls.getSlideImage({ fileKey, slide });
    if (imageUrl !== null) {
      loadImageWithBoxes({
        imageUrl,
        boxes,
      }).then(setBoxedImage);
    }
    return () => {};
  }, [boxes, fileKey, slide]);
  return boxedImage === null ? (
    <SlideImage fileKey={fileKey} slide={slide} className={className ?? ""} />
  ) : (
    <img
      src={boxedImage}
      alt={`Slide ${slide}`}
      title={`Slide ${slide}`}
      className={className}
    />
  );
}
