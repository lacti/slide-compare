import { Code, Col, Divider, Row, Spacer, Text } from "@zeit-ui/react";

import { FileText } from "@zeit-ui/react-icons";
import React from "react";

export default function Heading({ short }: { short?: boolean }) {
  return (
    <Row gap={0.8} justify="center">
      <Col span={12} style={{ textAlign: "center" }}>
        <Text h2>
          Compare two presentations <FileText />
          <FileText />
        </Text>
        <Divider x={12} />
        {!short && <HeadingDescription />}
      </Col>
    </Row>
  );
}

function HeadingDescription() {
  return (
    <>
      <Spacer y={2} />
      <Text type="secondary" p>
        Protect your eyes with the help of this tool!
      </Text>
      <Text type="secondary" p>
        You can compare between <Code>.pdf</Code> files.
      </Text>
    </>
  );
}
