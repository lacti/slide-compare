import white1x1 from "./white1x1";

export default async function loadImage(imageUrl: string) {
  const image = new Image();
  return new Promise<HTMLImageElement>((resolve) => {
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      resolve(white1x1);
    };
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
  });
}
