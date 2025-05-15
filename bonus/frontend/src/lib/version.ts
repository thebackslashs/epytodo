import { readFileSync } from "fs";
import { join } from "path";

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf-8")
);

export const version = packageJson.version;
