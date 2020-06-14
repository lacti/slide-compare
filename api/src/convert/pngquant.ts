import execa from "execa";
import { logger } from "../utils/logger";
import prepareConvertExternals from "./prepareConvertExternals";

export default async function pngquant({
  pngFiles,
  timeout = 60 * 1000,
}: {
  pngFiles: string[];
  timeout?: number;
}): Promise<void> {
  const { pngquantPath } = await prepareConvertExternals();
  logger.debug(
    "pngquant: executable=%s, pngFiles=%s",
    pngquantPath,
    pngFiles.join(", ")
  );

  const subprocess = execa(pngquantPath, [
    "--force",
    "--ext",
    ".png",
    "--verbose",
    "--quality",
    "90-95",
    "--strip",
    "--skip-if-larger",
    ...pngFiles,
  ]);
  return new Promise<void>((resolve, reject) => {
    const killer = setTimeout(() => {
      subprocess.kill("SIGTERM");
      reject(new Error("pngquant: Timeout occurred"));
    }, timeout);
    subprocess.then(({ exitCode, failed, killed, stdout, stderr }) => {
      clearTimeout(killer);
      logger.debug("pngquant: stdout=%s, stderr=%s", stdout, stderr);

      if (exitCode !== 0) {
        reject(new Error(`pngquant Error: ${stderr}`));
      }
      if (failed || killed) {
        reject(new Error(`pngquant: Failed or killed`));
      }

      logger.debug("pngquant: completed [%s]", pngFiles.join(","));
      resolve();
    });
  });
}
