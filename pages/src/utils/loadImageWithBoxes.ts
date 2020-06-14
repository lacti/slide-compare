import { CoordBounds } from "../server/models/compare";
import drawBox from "./drawBox";
import loadImage from "./loadImage";

const cache: { [key: string]: string } = {};

type LoadImageParameters = {
  imageUrl: string;
  boxes: CoordBounds[];
};

const lastSize: { width: number | undefined; height: number | undefined } = {
  width: undefined,
  height: undefined,
};

export default async function loadImageWithBoxes(params: LoadImageParameters) {
  const cacheKey = asCacheKey(params);
  if (cacheKey in cache) {
    return cache[cacheKey];
  }

  const { imageUrl, boxes } = params;
  const image = await loadImage(imageUrl);
  if (image.width > 1 && image.height > 1) {
    lastSize.width = image.width;
    lastSize.height = image.height;
  }

  const imageWithBoxes = await drawBox(
    image,
    boxes,
    Math.max(lastSize.width ?? 0, image.width),
    Math.max(lastSize.height ?? 0, image.height)
  );
  cache[cacheKey] = imageWithBoxes;
  return imageWithBoxes;
}

function asCacheKey({ imageUrl, boxes }: LoadImageParameters): string {
  return [imageUrl, ...boxes.map((box) => boxAsCacheKey(box))].join("_");
}

function boxAsCacheKey({ left, top }: CoordBounds): string {
  return [left.toFixed(1), top.toFixed(1)].join(",");
}
