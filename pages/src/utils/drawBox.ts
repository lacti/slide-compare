import { CoordBounds } from "../server/models/compare";
import envs from "../envs";

export default async function drawBox(
  image: HTMLImageElement,
  boxes: CoordBounds[],
  width: number,
  height: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Cannot draw box");
  }
  ctx.drawImage(image, 0, 0);
  const ratio = width / envs.ResizedImageWidth;
  const margin = 5;
  ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
  ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
  ctx.lineWidth = 4;
  for (const { left, top, right, bottom } of boxes) {
    ctx.fillRect(
      left * ratio - margin,
      top * ratio - margin,
      (right - left) * ratio + margin * 2,
      (bottom - top) * ratio + margin * 2
    );
    ctx.strokeRect(
      left * ratio - margin,
      top * ratio - margin,
      (right - left) * ratio + margin * 2,
      (bottom - top) * ratio + margin * 2
    );
    // ctx.stroke();
  }
  return canvas.toDataURL();
}
