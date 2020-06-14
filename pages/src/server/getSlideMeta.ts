import { SlideMeta } from "./models/compare";
import { ensureJSONResult } from "./ensureResult";
import serverUrls from "./serverUrls";

export default function getSlideMeta({
  fileKey,
}: {
  fileKey: string;
}): Promise<SlideMeta> {
  return fetch(serverUrls.getSlideMeta({ fileKey }), {
    method: "GET",
  }).then((r) => ensureJSONResult<SlideMeta>(r));
}
