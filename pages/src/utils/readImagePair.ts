import ImagePair from "../models/imagePair";
import SlideMatch from "../models/slideMatch";
import loadImageWithBoxes from "./loadImageWithBoxes";
import serverUrls from "../server/serverUrls";
import { white1x1DataUrl } from "./white1x1";

export default async function readImagePair({
  match,
  showDifferences,
}: {
  match: SlideMatch;
  showDifferences: boolean;
}): Promise<ImagePair> {
  const leftImageUrl = serverUrls.getSlideImage({
    fileKey: match.leftFileKey,
    slide: match.leftIndex,
  });
  const rightImageUrl = serverUrls.getSlideImage({
    fileKey: match.rightFileKey,
    slide: match.rightIndex,
  });
  if (!showDifferences) {
    return {
      leftImage: leftImageUrl ?? white1x1DataUrl,
      rightImage: rightImageUrl ?? white1x1DataUrl,
    };
  }

  const [leftImage, rightImage] = await Promise.all([
    leftImageUrl !== null
      ? loadImageWithBoxes({ imageUrl: leftImageUrl, boxes: match.areas })
      : white1x1DataUrl,
    rightImageUrl !== null
      ? loadImageWithBoxes({ imageUrl: rightImageUrl, boxes: match.areas })
      : white1x1DataUrl,
  ]);
  return { leftImage, rightImage };
}
