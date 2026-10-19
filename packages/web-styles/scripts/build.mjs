
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
  {
    input: "card.css",
    output: "card.css",
    minify: false,
  },
  {
    input: "badge.css",
    output: "badge.css",
    minify: false,
  },
  {
    input: "avatar.css",
    output: "avatar.css",
    minify: false,
  },
  {
    input: "avatar-group.css",
    output: "avatar-group.css",
    minify: false,
  },
  {
    input: "separator.css",
    output: "separator.css",
    minify: false,
  },
  {
    input: "skeleton.css",
    output: "skeleton.css",
    minify: false,
  },
  {
    input: "spinner.css",
    output: "spinner.css",
    minify: false,
  },
  {
    input: "switch.css",
    output: "switch.css",
    minify: false,
  },
  {
    input: "checkbox.css",
    output: "checkbox.css",
    minify: false,
  },
  {
    input: "radio.css",
    output: "radio.css",
    minify: false,
  },
  {
    input: "textarea.css",
    output: "textarea.css",
    minify: false,
  },
  {
    input: "select.css",
    output: "select.css",
    minify: false,
  },
  {
    input: "combobox.css",
    output: "combobox.css",
    minify: false,
  },
  {
    input: "multi-select.css",
    output: "multi-select.css",
    minify: false,
  },
  {
    input: "slider.css",
    output: "slider.css",
    minify: false,
  },
  {
    input: "range-slider.css",
    output: "range-slider.css",
    minify: false,
  },
  {
    input: "progress.css",
    output: "progress.css",
    minify: false,
  },
  {
    input: "circular-progress.css",
    output: "circular-progress.css",
    minify: false,
  },
  {
    input: "tooltip.css",
    output: "tooltip.css",
    minify: false,
  },
  {
    input: "popover.css",
    output: "popover.css",
    minify: false,
  },
  {
    input: "dialog.css",
    output: "dialog.css",
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
