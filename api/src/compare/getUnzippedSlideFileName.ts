const slideFilenameLength = 3;

export default function getUnzippedSlideFileName(slide: number): string {
  return zeroLpad(slide.toString(), slideFilenameLength) + ".png";
}

function zeroLpad(input: string, length: number) {
  return (Array(length).fill("0").join("") + input).slice(-length);
}
