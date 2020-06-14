import { FileSelected } from "../components/StyledDropzone";
import SlideDiffLoaded from "../models/slideDiffLoaded";
import compare from "./compare";
import convertToPng from "./convertToPng";
import sleep from "../utils/sleep";

export interface ProgressReport {
  type: "info" | "error";
  text: string;
  value: number;
}

export default async function convertAndCompare({
  leftFile,
  rightFile,
  onProgress,
}: {
  leftFile: FileSelected;
  rightFile: FileSelected;
  onProgress: (progress: ProgressReport) => void;
}): Promise<SlideDiffLoaded> {
  onProgress({
    type: "info",
    text: "Convert an old file to compare.",
    value: 25,
  });
  await sleep(200);

  const [leftFileKey, rightFileKey] = await Promise.all([
    convertToPng(leftFile).catch((error) => {
      onProgress({
        type: "error",
        text: `Cannot convert an old file: ${error.message}`,
        value: 50,
      });
      throw error;
    }),
    convertToPng(rightFile).catch((error) => {
      onProgress({
        type: "error",
        text: `Cannot convert a new file: ${error.message}`,
        value: 50,
      });
      throw error;
    }),
  ]);
  await sleep(200);

  onProgress({ type: "info", text: "Compare two presentations.", value: 75 });
  await sleep(200);

  const completion = await compare({ leftFileKey, rightFileKey }).catch(
    (error) => {
      onProgress({
        type: "error",
        text: `Cannot compare two files: ${error.message}`,
        value: 75,
      });
      throw error;
    }
  );
  await sleep(200);

  onProgress({ type: "info", text: "All done!", value: 100 });
  await sleep(200);

  return completion;
}
