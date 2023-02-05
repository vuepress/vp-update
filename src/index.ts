import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cac } from "cac";
import { execaCommandSync } from "execa";

import { version } from "./config/index.js";
import { detectPackageManager, updatePackages } from "./utils/index.js";

const cli = cac("vp-update");

cli
  .command("[dir]", "Update VuePress project")
  .usage("pnpm dlx vp-update [dir] / npx vp-update [dir]")
  .example("docs")
  .action(async (targetDir: string) => {
    const dir = resolve(process.cwd(), targetDir);
    const packageJSON = resolve(dir, "package.json");

    if (!existsSync(packageJSON))
      return new Error(`No package.json found in ${targetDir}`);

    const packageManager = detectPackageManager();

    const content = readFileSync(packageJSON, { encoding: "utf-8" });

    const packageJSONContent = JSON.parse(content);

    await Promise.all([
      updatePackages(packageJSONContent.dependencies),
      updatePackages(packageJSONContent.devDependencies),
    ]);

    writeFileSync(
      packageJSON,
      `${JSON.stringify(packageJSONContent, null, 2)}\n`
    );

    execaCommandSync(`${packageManager} install`, { stdout: "inherit" });

    const updateCommand =
      packageManager === "pnpm"
        ? `pnpm update`
        : packageManager === "yarn"
        ? execaCommandSync(`${packageManager} --version`).stdout.startsWith(
            "1."
          )
          ? `yarn upgrade`
          : `yarn up`
        : `npm update`;

    execaCommandSync(updateCommand, { stdout: "inherit" });

    return;
  });

cli.help(() => [
  {
    title: "pnpm dlx vp-update [dir] / npx vp-update [dir]",
    body: "Update VuePress project in [dir]",
  },
]);

cli.version(version);

cli.parse();
