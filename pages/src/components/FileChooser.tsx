import { Fieldset, Spacer } from "@zeit-ui/react";
import StyledDropzone, { FileSelected } from "./StyledDropzone";

import React from "react";

export default function FileChooser({
  accepts = [".pdf"],
  title,
  disabled,
  onSelected,
}: {
  accepts?: string[];
  title: string;
  disabled: boolean;
  onSelected: (file: FileSelected) => void;
}) {
  return (
    <Fieldset>
      <Fieldset.Title>{title}</Fieldset.Title>
      <Spacer y={0.3} />
      <StyledDropzone
        options={{
          accept: accepts,
          multiple: false,
          disabled: disabled,
        }}
        onSelected={(selected) => onSelected(selected[0])}
      />
    </Fieldset>
  );
}
