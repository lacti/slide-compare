export default interface SlideMeta {
  name: string;
  fileKey: string;
  slideCount: number;
  stage: "init" | "converting" | "converted";
}

export const metaFilename = "meta.json";
