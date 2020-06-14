import { Col, Row, Spacer, useToasts } from "@zeit-ui/react";

import Heading from "../components/Heading";
import { ProgressReport } from "../server/convertAndCompare";
import ProgressReporter from "../components/ProgressReporter";
import React from "react";
import SlideDiffInput from "../models/slideDiffInput";
import SlideDiffLoaded from "../models/slideDiffLoaded";
import compare from "../server/compare";
import sleep from "../utils/sleep";

export default function SlideLoadingPage({
  input: { leftFileKey, rightFileKey },
  onCompleted,
}: {
  input: SlideDiffInput;
  onCompleted: (loaded: SlideDiffLoaded) => void;
}) {
  const [progress, setProgress] = React.useState<ProgressReport>({
    type: "info",
    text: "Start to compare...",
    value: 50,
  });

  const [, setToast] = useToasts();
  React.useEffect(() => {
    (async () => {
      try {
        setProgress({
          type: "info",
          text: "Compare two presentations.",
          value: 75,
        });
        await sleep(200);

        const completion = await compare({ leftFileKey, rightFileKey });
        setProgress({ type: "info", text: "All done!", value: 100 });
        await sleep(200);

        onCompleted(completion);
      } catch (error) {
        console.error(error);
        setProgress({
          type: "error",
          text: `Cannot compare two files: ${error.message}`,
          value: 75,
        });
        setToast({ type: "error", text: error.message });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Spacer y={2} />
      <Heading short={true} />
      <Spacer y={3} />
      <Row gap={0.8} justify="center">
        <Col span={18} style={{ textAlign: "center" }}>
          <Spacer y={2} />
          <ProgressReporter {...progress} />
        </Col>
      </Row>
    </>
  );
}
