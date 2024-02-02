import { createRequire } from "node:module";

export const { version } = <Record<string, unknown> & { version: string }>(
  createRequire(import.meta.url)("vp-update/package.json")
);
