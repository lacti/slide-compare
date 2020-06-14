import execa from "execa";
import { logger } from "../utils/logger";
import prepareConvertExternals from "./prepareConvertExternals";

const log = logger.get("pngquant", __filename);

export default async function pngquant({
  pngFiles,
  timeout = 60 * 1000,
}: {
  pngFiles: string[];
  timeout?: number;
}): Promise<void> {
  const { pngquantPath } = await prepareConvertExternals();
  log.trace({ pngquantPath, pngFiles }, "pngquant: start");

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
      log.trace({ stdout, stderr }, "pngquant: process is completed");

      if (exitCode !== 0) {
        reject(new Error(`pngquant Error: ${stderr}`));
      }
      if (failed || killed) {
        reject(new Error(`pngquant: Failed or killed`));
      }

      log.trace({ pngFiles }, "pngquant: completed");
      resolve();
    });
  });
}
