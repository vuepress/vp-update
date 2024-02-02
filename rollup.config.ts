import esbuild from "rollup-plugin-esbuild";
import { shebang } from "rollup-plugin-resolve-shebang";

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
    shebang(),
    esbuild({
      charset: "utf8",
      minify: true,
      target: "node18",
    }),
  ],
  external: [
    "node:child_process",
    "node:fs",
    "node:https",
    "node:module",
    "node:path",
    "cac",
    "semver",
  ],
  treeshake: "smallest",
};
