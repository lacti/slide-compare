import { Col, Divider, Row, Spacer, Text } from "@zeit-ui/react";

import BoxedSlideImage from "./BoxedSlideImage";
import React from "react";
import SlideMatch from "../models/slideMatch";
import SlideMatchTypeIcon from "./SlideMatchTypeIcon";
import clsx from "clsx";

export default function SlidePairThumbnail({
  match,
  page,
  selected,
  onClick,
}: {
  match: SlideMatch;
  page: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      id={`p${page}`}
      className={clsx("SlideThumbnailItem", {
        "SlideThumbnailItem-selected": selected,
      })}
      // onClick={() => setPage(page)}
      onClick={onClick}
    >
      <Spacer y={0.15} />
      <SlidePairNumbers
        leftSlide={match.leftIndex + 1}
        rightSlide={match.rightIndex + 1}
      />
      <Row>
        <div className="SlideMatchType">
          <SlideMatchTypeIcon matchType={match.matchType} />
        </div>
        <Col>
          <BoxedSlideImage
            fileKey={match.leftFileKey}
            slide={match.leftIndex}
            boxes={match.areas}
            className="SlideThumbnail"
          />
        </Col>
        <Col>
          <BoxedSlideImage
            fileKey={match.rightFileKey}
            slide={match.rightIndex}
            boxes={match.areas}
            className="SlideThumbnail"
          />
        </Col>
      </Row>
      <Spacer y={0.15} />
      <Divider y={1} type={selected ? "error" : "default"} />
    </div>
  );
}

function SlidePairNumbers({
  leftSlide,
  rightSlide,
}: {
  leftSlide: number;
  rightSlide: number;
}) {
  return (
    <Text b className="SlideThumbnailNumber">
      {leftSlide} / {rightSlide}
    </Text>
  );
}
