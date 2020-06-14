import envs from "../envs";

interface FileSlide {
  fileKey: string;
  slide: number;
}

function getUploadUrl({ name }: { name: string }): string {
  return envs.ServerUrl + `/upload/pdf?name=${encodeURIComponent(name)}`;
}

function getSlideMeta({ fileKey }: { fileKey: string }): string {
  return envs.ServerUrl + `/slide/${fileKey}`;
}

function getSlideImage({ fileKey, slide }: FileSlide): string | null {
  if (slide < 0) {
    return null;
  }
  return envs.ServerUrl + `/slide/${fileKey}/${slide}`;
}

function requestToCompare({
  leftFileKey,
  rightFileKey,
}: {
  leftFileKey: string;
  rightFileKey: string;
}): string {
  return envs.ServerUrl + `/compare/${leftFileKey}/${rightFileKey}`;
}

function getCompared({
  leftFileKey,
  rightFileKey,
}: {
  leftFileKey: string;
  rightFileKey: string;
}): string {
  return envs.ServerUrl + `/compare/${leftFileKey}/${rightFileKey}`;
}

const serverUrls = {
  getUploadUrl,
  getSlideMeta,
  getSlideImage,
  requestToCompare,
  getCompared,
};

export default serverUrls;
