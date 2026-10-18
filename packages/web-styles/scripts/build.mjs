
import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const srcDir = new URL("../src/", import.meta.url);
const distDir = new URL("../dist/", import.meta.url);

const outputs = [
  {
    input: "styles.css",
    output: "pimolu.css",
    minify: false,
  },
  {
    input: "styles.css",
    output: "pimolu.min.css",
    minify: true,
  },
  {
    input: "button.css",
    output: "button.css",
    minify: false,
  },
  {
    input: "input.css",
    output: "input.css",
    minify: false,
  },
];

await mkdir(distDir, { recursive: true });

for (const item of outputs) {
  await build({
    entryPoints: [
      fileURLToPath(new URL(item.input, srcDir)),
    ],

    outfile: fileURLToPath(
      new URL(item.output, distDir)
    ),

    bundle: true,
    minify: item.minify,

    charset: "utf8",
    logLevel: "silent",
  });

  console.log(`Generated: dist/${item.output}`);
}

console.log("Pimolu Web Styles build completed.");
