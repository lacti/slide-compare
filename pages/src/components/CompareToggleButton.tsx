import { Button, Spacer, Spinner } from "@zeit-ui/react";

import React from "react";

export default function CompareToggleButton({
  processing,
  onCompare,
}: {
  processing: boolean;
  onCompare: () => void;
}) {
  if (processing) {
    return (
      <Button type="default" disabled>
        PROCESSING
        <Spacer inline x={1} />
        <Spinner size="mini" />
      </Button>
    );
  }
  return (
    <Button type="secondary-light" onClick={onCompare}>
      COMPARE
    </Button>
  );
}
