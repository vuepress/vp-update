import { execaCommandSync } from "execa";

import { type PackageManager } from "./packageManager.js";

const NPM_MIRROR_REGISTRY = "https://registry.npmmirror.com/";

export const getRegistry = (packageManager: PackageManager): string => {
  if (
    packageManager === "yarn" &&
    !execaCommandSync(`${packageManager} --version`).stdout.startsWith("1")
  )
    return execaCommandSync(
      `${packageManager} config get npmRegistryServer`
    ).stdout.replace(/\/?$/, "/");

  return execaCommandSync(
    `${packageManager} config get registry`
  ).stdout.replace(/\/?$/, "/");
};

export const checkTaobaoRegistry = (packageManager: PackageManager): void => {
  const userRegistry = getRegistry(packageManager);

  if (/https:\/\/registry\.npm\.taobao\.org\/?/.test(userRegistry)) {
    console.error(
      "npm.taobao.org is no longer available, resetting it to npmmirror.com"
    );

    if (packageManager === "yarn") {
      execaCommandSync(
        `${packageManager} config set npmRegistryServer  ${NPM_MIRROR_REGISTRY}`
      );
    } else {
      execaCommandSync(
        `${packageManager} config set registry ${NPM_MIRROR_REGISTRY}`
      );
    }
  }
};
