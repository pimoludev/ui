import { build } from "esbuild";
import { execSync } from "node:child_process";
execSync("node scripts/generate-components.mjs", { stdio: "inherit" });
await build({ entryPoints: ["src/index.ts"], outfile: "dist/index.js", bundle: true,
  format: "esm", platform: "browser", target: "es2022", jsx: "automatic", sourcemap: true,
  banner: { js: '"use client";' },
  external: ["react", "react/*", "react-dom", "react-dom/*", "@pimolu/react", "motion", "motion/*"] });
execSync("pnpm exec tsc -p tsconfig.build.json --emitDeclarationOnly", { stdio: "inherit" });
