import { execSync } from "node:child_process";
import { build } from "esbuild";

await build({
  entryPoints: ["index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  jsx: "automatic",
  sourcemap: true,
  legalComments: "none",
  banner: { js: '"use client";' },
  external: [
    "react",
    "react/*",
    "react-dom",
    "react-dom/*",
    "@pimolu/core",
    "@pimolu/themes",
    "@pimolu/themes/*",
  ],
});

execSync("pnpm exec tsc -p tsconfig.build.json --emitDeclarationOnly", {
  stdio: "inherit",
});
