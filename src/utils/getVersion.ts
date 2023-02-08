import { get } from "node:https";
import semver from "semver";
import { getRegistry } from "./packageManager.js";

export const getVersion = async (
  packageName: string,
  tag: "latest" | "next" | "auto" = "auto",
  retries = 3
): Promise<string> => {
  const registry = getRegistry();

  const getVersionInfo = (): Promise<Record<string, string>> =>
    new Promise((resolve, reject) => {
      get(`${registry}-/package/${packageName}/dist-tags`, (res) => {
        if (res.statusCode === 200) {
          let body = "";

          res.on("data", (data) => (body += data));
          res.on("end", () => {
            resolve(<Record<string, string>>JSON.parse(body));
          });
        } else {
          reject();
        }
      }).on("error", (err) => {
        reject(err);
      });
    });

  for (let times = 1; times <= retries; times++) {
    const versionInfo = await getVersionInfo().catch(() => {
      console.log(`Get ${packageName} version failed, [${times}/${retries}]`);
    });

    if (versionInfo) {
      const { next, latest } = versionInfo;

      return tag === "latest"
        ? latest
        : tag === "next"
        ? next
        : next && semver.gt(next, latest)
        ? next
        : latest;
    }
  }

  throw new Error(`Get ${packageName} version failed!`);
};
