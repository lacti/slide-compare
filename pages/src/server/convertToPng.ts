import { FileSelected } from "../components/StyledDropzone";
import { UploadFile } from "./models/upload";
import { ensureJSONResult } from "./ensureResult";
import getSlideMeta from "./getSlideMeta";
import repeatUntil from "./repeatUntil";
import serverUrls from "./serverUrls";

const maxWaitingSeconds = 600;
const waitingIntervals = [3, 25, 25, 15, 15, 10, 10, 10, 5, 5, 2];

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

  return repeatUntil({
    maxWaitingSeconds,
    waitingIntervals,
    defaultWaitingInterval: 30,
    timeoutErrorMessage: "File is too big.",
    delegate: async () => {
      const meta = await getSlideMeta({ fileKey });
      if (meta.stage !== "converted") {
        return null;
      }
      return fileKey;
    },
  });
}
