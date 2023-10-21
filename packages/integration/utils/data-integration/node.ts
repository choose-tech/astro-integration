import path from "node:path";
import fsp from "node:fs/promises";

export const ensureDirExists = async (p: string) => {
  const dir = path.extname(p) === "" ? p : path.dirname(p);
  try {
    await fsp.access(dir);
  } catch (err) {
    await fsp.mkdir(dir, { recursive: true });
  }
};

export const readRecursiveDir = async (p: string) => {
  const filenames: Array<string> = [];
  const results = await fsp.readdir(p);

  for (const result of results) {
    const isDir = path.extname(result) === "";
    if (isDir) {
      const results = await readRecursiveDir(path.resolve(p, result));
      filenames.push(...results.map((r) => path.join(result, r)));
    } else {
      filenames.push(result);
    }
  }

  return filenames;
};

export const isPathInsideDirectory = (pathA: string, dirB: string) => {
  const relativePath = path.relative(dirB, pathA);
  return !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
};

export const doesFileExist = async (p: string) => {
  try {
    await fsp.access(p);
    return true;
  } catch (err) {
    return false;
  }
};
