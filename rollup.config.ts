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
    esbuild({
      charset: "utf8",
      minify: true,
      target: "node18",
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
