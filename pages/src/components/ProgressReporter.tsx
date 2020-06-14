import { Progress, Spacer, Text } from "@zeit-ui/react";

import { ProgressReport } from "../server/convertAndCompare";
import React from "react";

export default function ProgressReporter({
  type,
  text,
  value,
}: ProgressReport) {
  return (
    <>
      <Text type={type === "info" ? "secondary" : "error"} span>
        {text}
      </Text>
      <Spacer y={0.5} />
      <Progress value={value} type="success" />
    </>
  );
}
