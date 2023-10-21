import path from "node:path";

export const LIBRARIES_PATH = path.resolve(
  process.cwd(),
  "content/libraries"
);
export const GITHUB_PATH = path.resolve(process.cwd(), "content/github");
export const NPM_PATH = path.resolve(process.cwd(), "content/npm");
