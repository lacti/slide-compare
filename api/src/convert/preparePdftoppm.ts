import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import tar from "tar";

export default function preparePdftoppm(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const pdftoppmPath = path.join(os.tmpdir(), "bin", "pdftoppm");
    if (fs.existsSync(pdftoppmPath)) {
      return resolve(pdftoppmPath);
    }
    const pdftoppmTgzName = "exodus-pdftoppm-bundle.tgz";
    const pdftoppmTgzPath = fs.existsSync(pdftoppmTgzName)
      ? pdftoppmTgzName
      : path.join(".external", pdftoppmTgzName);
    fs.createReadStream(pdftoppmTgzPath)
      .pipe(
        tar
          .x({
            strip: 1,
            C: "/tmp",
          })
          .on("error", reject)
          .on("close", () =>
            fs.existsSync(pdftoppmPath)
              ? resolve(pdftoppmPath)
              : reject(new Error(`Cannot extract ${pdftoppmTgzPath}`))
          )
      )
      .on("error", reject);
  });
}
