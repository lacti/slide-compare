import { Button, Col, Row, Tooltip } from "@zeit-ui/react";
import {
  Eye,
  EyeOff,
  FullScreen,
  FullScreenClose,
  Icon,
  Layers,
  Map,
} from "@zeit-ui/react-icons";

import React from "react";

export default function ControlsView({
  wide,
  showAll,
  onWideToggled,
  onFilterChanged,
  onStartShow,
}: {
  wide: boolean;
  showAll: boolean;
  onWideToggled: (wide: boolean) => void;
  onFilterChanged: (showAll: boolean) => void;
  onStartShow: () => void;
}) {
  return (
    <Row className="Controls">
      <Col>
        <ToggleIconButton
          toggled={wide}
          onTooltip="Fold navigation"
          offTooltip="Open navigation"
          OnIcon={Layers}
          OffIcon={Map}
          onToggle={onWideToggled}
        />

        <ToggleIconButton
          toggled={showAll}
          onTooltip="Exclude perfect-matched-slides"
          offTooltip="Include perfect-matched-slides"
          OnIcon={EyeOff}
          OffIcon={Eye}
          onToggle={onFilterChanged}
        />

        <ToggleIconButton
          toggled={false}
          onTooltip="Stop presentation-mode"
          offTooltip="Enter presentation-mode"
          OnIcon={FullScreenClose}
          OffIcon={FullScreen}
          onToggle={onStartShow}
        />
      </Col>
    </Row>
  );
}

function ToggleIconButton({
  toggled,
  onToggle,
  onTooltip,
  offTooltip,
  OnIcon,
  OffIcon,
}: {
  toggled: boolean;
  onTooltip: string;
  offTooltip: string;
  OnIcon: Icon;
  OffIcon: Icon;
  onToggle: (newValue: boolean) => void;
}) {
  return (
    <Tooltip
      text={toggled ? onTooltip : offTooltip}
      type="dark"
      placement="bottomEnd"
    >
      <Button auto type="abort" onClick={() => onToggle(!toggled)}>
        {toggled ? <OnIcon size={16} /> : <OffIcon size={16} />}
      </Button>
    </Tooltip>
  );
}
