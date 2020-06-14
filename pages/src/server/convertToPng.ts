import { FileSelected } from "../components/StyledDropzone";
import { UploadFile } from "./models/upload";
import { ensureJSONResult } from "./ensureResult";
import getSlideMeta from "./getSlideMeta";
import serverUrls from "./serverUrls";
import sleep from "../utils/sleep";

const waitingIntervals = [3, 30, 30, 15, 15, 10, 10, 5, 5, 2];

export default async function convertToPng({ file, path }: FileSelected) {
  const { fileKey, url: uploadUrl } = await fetch(
    serverUrls.getUploadUrl({ name: path ?? file.name }),
    {
      method: "GET",
    }
  ).then((r) => ensureJSONResult<UploadFile>(r));

  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  }).then((r) => r.text());
  console.debug("Upload a file to convert", file, fileKey);

  for (const interval of waitingIntervals) {
    await sleep(interval * 1000);
    const meta = await getSlideMeta({ fileKey });
    if (meta.stage === "converted") {
      return fileKey;
    }
  }
  throw new Error("File is too big.");
}
