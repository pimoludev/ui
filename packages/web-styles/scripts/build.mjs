
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
  {
    input: "tabs.css",
    output: "tabs.css",
    minify: false,
  },
  {
    input: "toggle.css",
    output: "toggle.css",
    minify: false,
  },
  {
    input: "toggle-group.css",
    output: "toggle-group.css",
    minify: false,
  },
  {
    input: "segmented-control.css",
    output: "segmented-control.css",
    minify: false,
  },
  {
    input: "link.css",
    output: "link.css",
    minify: false,
  },
  {
    input: "typography.css",
    output: "typography.css",
    minify: false,
  },
  {
    input: "code.css",
    output: "code.css",
    minify: false,
  },
  {
    input: "label.css",
    output: "label.css",
    minify: false,
  },
  {
    input: "form-field.css",
    output: "form-field.css",
    minify: false,
  },
  {
    input: "accordion.css",
    output: "accordion.css",
    minify: false,
  },
  {
    input: "breadcrumbs.css",
    output: "breadcrumbs.css",
    minify: false,
  },
  {
    input: "pagination.css",
    output: "pagination.css",
    minify: false,
  },
  {
    input: "stepper.css",
    output: "stepper.css",
    minify: false,
  },
  {
    input: "navbar.css",
    output: "navbar.css",
    minify: false,
  },
  {
    input: "sidebar.css",
    output: "sidebar.css",
    minify: false,
  },
  {
    input: "navigation-menu.css",
    output: "navigation-menu.css",
    minify: false,
  },
  {
    input: "scroll-area.css",
    output: "scroll-area.css",
    minify: false,
  },
  {
    input: "tree-view.css",
    output: "tree-view.css",
    minify: false,
  },
  {
    input: "list.css",
    output: "list.css",
    minify: false,
  },
  {
    input: "description-list.css",
    output: "description-list.css",
    minify: false,
  },
  {
    input: "dropdown-menu.css",
    output: "dropdown-menu.css",
    minify: false,
  },
  {
    input: "toast.css",
    output: "toast.css",
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
