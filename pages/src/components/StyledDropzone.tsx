import { DropzoneOptions, useDropzone } from "react-dropzone";
import React, { useMemo } from "react";

const baseStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export interface FileSelected {
  file: File;
  path: string;
}

export default function StyledDropzone({
  options,
  onSelected,
}: {
  options: DropzoneOptions;
  onSelected: (selected: FileSelected[]) => void;
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone(options);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  React.useEffect(() => {
    onSelected(
      (acceptedFiles || []).map((file) => ({ file, path: getFilePath(file) }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedFiles]);

  const HelpText = (
    <p style={{ margin: 0 }}>
      Drag 'n' drop some files here,
      <br />
      or click to select files
    </p>
  );
  const SelectedFiles = acceptedFiles.map((file) => (
    <p key={getFilePath(file)} style={{ margin: 0, color: "black" }}>
      {getFilePath(file)} ({file.size} bytes)
    </p>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {acceptedFiles.length === 0 ? HelpText : SelectedFiles}
      </div>
    </section>
  );
}

function getFilePath(file: File) {
  const a = file as any;
  if ("fullPath" in a) {
    return a.fullPath;
  }
  if ("path" in a) {
    return a.path;
  }
  return file.name;
}
