import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import tar from "tar";

interface Executables {
  pngquantPath: string;
  pdftoppmPath: string;
}

export default function prepareConvertExternals(): Promise<Executables> {
  return new Promise<Executables>((resolve, reject) => {
    const pdftoppmPath = path.join(os.tmpdir(), "bin", "pdftoppm");
    const pngquantPath = path.join(os.tmpdir(), "bin", "pngquant");
    if (fs.existsSync(pdftoppmPath) && fs.existsSync(pngquantPath)) {
      return resolve({ pngquantPath, pdftoppmPath });
    }
    const externalTgzName = "exodus-pngquant-pdftoppm-bundle.tgz";
    const externalTgzPath = fs.existsSync(externalTgzName)
      ? externalTgzName
      : path.join(".external", externalTgzName);
    fs.createReadStream(externalTgzPath)
      .pipe(
        tar
          .x({
            strip: 1,
            C: "/tmp",
          })
          .on("error", reject)
          .on("close", () =>
            fs.existsSync(pdftoppmPath)
              ? resolve({ pngquantPath, pdftoppmPath })
              : reject(new Error(`Cannot extract ${externalTgzPath}`))
          )
      )
      .on("error", reject);
  });
}
