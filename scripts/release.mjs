import { exec } from "node:child_process";
import fsp from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import readline from "node:readline";

/**
 *
 * @param {string} query
 * @returns {Promise<string>}
 */
const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
};

const asyncExec = promisify(exec);

/**
 *
 * @param {string} version
 * @param {"major" | "minor" | "patch"} version
 */
const bumpVersion = (version, type) => {
  const [major, minor, patch] = version.split(".");
  const o = {
    major: parseInt(major),
    minor: parseInt(minor),
    patch: parseInt(patch),
  };

  o[type]++;

  return [o.major, o.minor, o.patch].join(".");
};

(async () => {
  /** @type {string} */
  let answer;
  while (!["0", "1", "2"].includes(answer)) {
    answer = await askQuestion("[0] Major ; [1] Minor ; [2] Patch : ");
  }

  const bumpType = { 0: "major", 1: "minor", 2: "patch" }[answer];

  const packagePath = path.resolve(
    process.cwd(),
    "./packages/integration/package.json"
  );
  const pkg = JSON.parse(await fsp.readFile(packagePath, "utf-8"));

  const version = bumpVersion(pkg.version, bumpType);

  pkg.version = version;

  await fsp.writeFile(packagePath, JSON.stringify(pkg, null, 2), "utf-8");

  await asyncExec("git add .");
  await asyncExec(`git commit -m @choose-tech/astro@${version}`);
  await asyncExec("git push");

  process.chdir("./packages/integration")

  await asyncExec("pnpm publish")
})();
