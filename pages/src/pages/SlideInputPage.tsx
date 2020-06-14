import { Col, Divider, Row, Spacer, useToasts } from "@zeit-ui/react";
import convertAndCompare, { ProgressReport } from "../server/convertAndCompare";

import { Code } from "@zeit-ui/react-icons";
import CompareToggleButton from "../components/CompareToggleButton";
import FileChooser from "../components/FileChooser";
import { FileSelected } from "../components/StyledDropzone";
import Heading from "../components/Heading";
import ProgressReporter from "../components/ProgressReporter";
import React from "react";
import SlideDiffLoaded from "../models/slideDiffLoaded";

export default function SlideInputPage({
  onCompleted,
}: {
  onCompleted: (loaded: SlideDiffLoaded) => void;
}) {
  const [leftFile, setLeftFile] = React.useState<FileSelected | undefined>(
    undefined
  );
  const [rightFile, setRightFile] = React.useState<FileSelected | undefined>(
    undefined
  );
  const [processing, setProcessing] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<ProgressReport>({
    type: "info",
    text: "I'm waiting!",
    value: 0,
  });

  const [, setToast] = useToasts();

  const process = React.useCallback(async () => {
    if (!leftFile) {
      setToast({ type: "error", text: "Please select an old file." });
      return;
    }
    if (!rightFile) {
      setToast({ type: "error", text: "Please select a new file." });
      return;
    }

    setProcessing(true);
    try {
      const completion = await convertAndCompare({
        leftFile,
        rightFile,
        onProgress: setProgress,
      });
      onCompleted({ ...completion });
    } catch (error) {
      console.error(error);
      setProcessing(false);
      setToast({ type: "error", text: error.message });
    }
  }, [leftFile, onCompleted, rightFile, setToast]);

  return (
    <>
      <Spacer y={2} />
      <Heading />
      <Spacer y={3} />
      <Row gap={2} justify="center">
        <Col span={8}>
          <FileChooser
            title="Choose an old."
            disabled={processing}
            onSelected={setLeftFile}
          />
        </Col>
        <Col span={2} className="InputCompareMark">
          <Code size={24} />
        </Col>
        <Col span={8}>
          <FileChooser
            title="Choose a new."
            disabled={processing}
            onSelected={setRightFile}
          />
        </Col>
      </Row>

      <Spacer y={3} />
      <Divider x={12} />
      <Spacer y={3} />

      <Row gap={0.8} justify="center">
        <Col span={18} style={{ textAlign: "center" }}>
          <CompareToggleButton processing={processing} onCompare={process} />
          <Spacer y={2} />
          <ProgressReporter {...progress} />
        </Col>
      </Row>
    </>
  );
}
