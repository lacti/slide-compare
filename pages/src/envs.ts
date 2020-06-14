const envs = {
  ServerUrl:
    "REACT_APP_SERVER_URL" in process.env
      ? process.env.REACT_APP_SERVER_URL
      : "http://localhost:3000",
  ResizedImageWidth: +(process.env.REACT_APP_RESIZED_IMAGE_WIDTH ?? "400"),
};

export default envs;
