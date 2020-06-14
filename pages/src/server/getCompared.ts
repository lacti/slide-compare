import { SlideCompared } from "./models/compare";
import { ensureJSONResult } from "./ensureResult";
import serverUrls from "./serverUrls";

export default function getCompared({
  leftFileKey,
  rightFileKey,
}: {
  leftFileKey: string;
  rightFileKey: string;
}): Promise<SlideCompared | { pending: boolean }> {
  return fetch(serverUrls.getCompared({ leftFileKey, rightFileKey }), {
    method: "GET",
  }).then((r) => ensureJSONResult<SlideCompared | { pending: boolean }>(r));
}
