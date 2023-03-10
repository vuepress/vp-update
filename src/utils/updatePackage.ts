import {
  OFFICIAL_PACKAGES,
  OFFICIAL_PLUGINS,
  THIRD_PARTY_PLUGINS,
  THIRD_PARTY_THEMES,
  VUE_RELATED_PACKAGES,
} from "../config/index.js";
import { getVersion } from "./getVersion.js";

export const updatePackages = async (
  dependencies: Record<string, string>
): Promise<void> => {
  await Promise.all(
    Object.keys(dependencies).map(async (dependency) => {
      if (VUE_RELATED_PACKAGES.includes(dependency)) {
        dependencies[dependency] = `^${await getVersion(dependency, "latest")}`;
      } else if (OFFICIAL_PACKAGES.includes(dependency)) {
        dependencies[dependency] = await getVersion(dependency, "next");
      } else if (OFFICIAL_PLUGINS.includes(dependency)) {
        dependencies[dependency] = await getVersion(dependency, "next");
      } else if (
        THIRD_PARTY_PLUGINS.test(dependency) ||
        THIRD_PARTY_THEMES.test(dependency)
      ) {
        dependencies[dependency] = await getVersion(dependency, "auto");
      }
    })
  );
};
