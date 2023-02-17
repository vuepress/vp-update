import esbuild from "rollup-plugin-esbuild";
import { shebangPlugin } from "./plugins/shebang.js";

export default {
  input: `./src/index.ts`,
  output: [
    {
      file: `./lib/index.js`,
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
  ],
  plugins: [
    shebangPlugin(),
    // FIXME: This is an issue of ts NodeNext
    (esbuild as unknown as typeof esbuild.default)({
      charset: "utf8",
      minify: true,
      target: "node14",
    }),
  ],
  external: [
    "node:fs",
    "node:https",
    "node:module",
    "node:path",
    "cac",
    "execa",
    "semver",
  ],
  treeshake: "smallest",
};
