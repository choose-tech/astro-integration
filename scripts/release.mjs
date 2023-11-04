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
 * @param {number} index
 */
const bumpVersion = (version, index) => {
  const x = version.split(".");

  x[index]++

  return x.join(".");
};

(async () => {
  /** @type {string} */
  let answer;
  while (!["0", "1", "2"].includes(answer)) {
    answer = await askQuestion("[0] Major ; [1] Minor ; [2] Patch : ");
  }

  const packagePath = path.resolve(
    process.cwd(),
    "./packages/integration/package.json"
  );
  const pkg = JSON.parse(await fsp.readFile(packagePath, "utf-8"));

  const version = bumpVersion(pkg.version, parseInt(answer));

  pkg.version = version;

  await fsp.writeFile(packagePath, JSON.stringify(pkg, null, 2), "utf-8");

  // await asyncExec("git add .");
  // await asyncExec(`git commit -m @choose-tech/astro@${version}`);
  // await asyncExec("git push");

  // process.chdir("./packages/integration")

  // await asyncExec("pnpm publish")
})();
