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
    text: "Convert presentation files to compare.",
    value: 33,
  });
  await sleep(200);

  const [leftFileKey, rightFileKey] = await Promise.all([
    convertToPng(leftFile),
    convertToPng(rightFile),
  ]).catch((error) => {
    onProgress({
      type: "error",
      text: `Cannot convert presentation files: ${error.message}`,
      value: 50,
    });
    throw error;
  });
  await sleep(200);

  onProgress({ type: "info", text: "Compare two presentations.", value: 67 });
  await sleep(200);

  const completion = await compare({ leftFileKey, rightFileKey }).catch(
    (error) => {
      onProgress({
        type: "error",
        text: `Cannot compare two files: ${error.message}`,
        value: 67,
      });
      throw error;
    }
  );
  await sleep(200);

  onProgress({ type: "info", text: "All done!", value: 100 });
  await sleep(200);

  return completion;
}
