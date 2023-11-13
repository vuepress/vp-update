import {
  OFFICIAL_PACKAGES,
  OFFICIAL_PLUGINS,
  THIRD_PARTY_PLUGINS,
  THIRD_PARTY_THEMES,
  VUE_RELATED_PACKAGES,
} from "../config/index.js";
import { getVersion } from "./getVersion.js";
import { PackageManager } from "./packageManager.js";

export const updatePackages = async (
  packageManager: PackageManager,
  dependencies: Record<string, string>
): Promise<void> => {
  await Promise.all(
    Object.keys(dependencies).map(async (dependency) => {
      if (VUE_RELATED_PACKAGES.includes(dependency)) {
        dependencies[dependency] = `^${await getVersion(
          packageManager,
          dependency,
          "latest"
        )}`;
      } else if (OFFICIAL_PACKAGES.includes(dependency)) {
        dependencies[dependency] = await getVersion(
          packageManager,
          dependency,
          "next"
        );
      } else if (OFFICIAL_PLUGINS.includes(dependency)) {
        dependencies[dependency] = await getVersion(
          packageManager,
          dependency,
          "next"
        );
      } else if (
        THIRD_PARTY_PLUGINS.test(dependency) ||
        THIRD_PARTY_THEMES.test(dependency)
      ) {
        dependencies[dependency] = await getVersion(
          packageManager,
          dependency,
          "auto"
        );
      }
    })
  );
};
