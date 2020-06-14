import { Col, Row, Text } from "@zeit-ui/react";

import ControlsView from "../views/ControlsView";
import React from "react";
import SlideCompareView from "../views/SlideCompareView";
import SlideDiffLoaded from "../models/slideDiffLoaded";
import SlideThumbnailView from "../views/SlideThumbnailView";
import usePage from "../hooks/usePage";

export default function SlideDiffPage({
  matches,
  info,
  showAll,
  onFilterChanged,
  onStartShow,
}: SlideDiffLoaded & {
  showAll: boolean;
  onFilterChanged: (showAll: boolean) => void;
  onStartShow: () => void;
}) {
  const { page, setPage, onMouseDown } = usePage({
    initPage: 0,
    countOfPages: matches.length,
  });
  const [wideThumbnail, setWideThumbnail] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (page >= 4) {
      document.getElementById(`p${page - 4}`)?.scrollIntoView();
    } else {
      document
        .getElementsByClassName("SlideThumbnailContainer")
        .item(0)
        ?.scrollTo(0, 0);
    }
  }, [page]);

  return (
    <div className="App">
      <ControlsView
        wide={wideThumbnail}
        showAll={showAll}
        onWideToggled={setWideThumbnail}
        onFilterChanged={onFilterChanged}
        onStartShow={onStartShow}
      />
      <Row>
        <Col span={wideThumbnail ? 40 : 4} className="SlideThumbnailContainer">
          <SlideThumbnailView
            matches={matches}
            selectedPage={page}
            onThumbnailClick={setPage}
          />
        </Col>
        <Col>
          <div
            className="SlideViewContainer SlideViewContainer-diff"
            onMouseDown={onMouseDown}
          >
            <SlideCompareView
              matches={matches}
              page={page}
              leftName={info.leftName}
              rightName={info.rightName}
            />
          </div>
        </Col>
      </Row>
      <div className="PageNavigator">
        <Text b size={12}>
          {page + 1} / {matches.length}
        </Text>
      </div>
    </div>
  );
}
