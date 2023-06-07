import { execaCommandSync } from "execa";

import { type PackageManager } from "./packageManager.js";

const NPM_MIRROR_REGISTRY = "https://registry.npmmirror.com/";

const getUserRegistry = (packageManager: PackageManager): string =>
  execaCommandSync(`${packageManager} config get registry`).stdout;

export const checkRegistry = (packageManager: PackageManager): void => {
  const userRegistry = getUserRegistry(packageManager);

  if (/https:\/\/registry\.npm\.taobao\.org\/?/.test(userRegistry)) {
    console.error(
      "npm.taobao.org is no longer available, resetting it to npmmirror.com"
    );

    execaCommandSync(
      `${packageManager} config set registry ${NPM_MIRROR_REGISTRY}`
    );
  }
};
