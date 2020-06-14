import * as fs from "fs";
import * as path from "path";

export default function listFiles(inputDir: string): string[] {
  if (!fs.existsSync(inputDir)) {
    return [];
  }
  return fs.readdirSync(inputDir).map((each) => path.join(inputDir, each));
}
