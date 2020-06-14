export const white1x1DataUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=`;

const white1x1 = (() => {
  const image = new Image();
  image.src = white1x1DataUrl;
  return image;
})();

export default white1x1;
