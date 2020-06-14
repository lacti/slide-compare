import { Loading, Text } from "@zeit-ui/react";

import ImagePair from "../models/imagePair";
import React from "react";
import ReactCompareImage from "react-compare-image";
import SlideMatch from "../models/slideMatch";
import readImagePair from "../utils/readImagePair";

export default function SlideCompareView({
  matches,
  page,
  leftName = "Before",
  rightName = "After",
}: {
  matches: SlideMatch[];
  page: number;
  leftName?: string;
  rightName?: string;
}) {
  const [imagePair, setImagePair] = React.useState<ImagePair | null>(null);

  React.useEffect(() => {
    if (matches[page] !== undefined) {
      readImagePair({ match: matches[page], showDifferences: true }).then(
        setImagePair
      );
    }
  }, [matches, page, setImagePair]);

  return matches.length > 0 && imagePair ? (
    <ReactCompareImage
      hover={true}
      leftImage={imagePair.leftImage}
      rightImage={imagePair.rightImage}
      leftImageLabel={leftName}
      rightImageLabel={rightName}
    />
  ) : matches.length === 0 ? (
    <Text h2>No differnt slides</Text>
  ) : (
    <Loading />
  );
}
