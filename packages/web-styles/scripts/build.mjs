
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
  {
    input: "drawer.css",
    output: "drawer.css",
    minify: false,
  },
  {
    input: "context-menu.css",
    output: "context-menu.css",
    minify: false,
  },
  {
    input: "hover-card.css",
    output: "hover-card.css",
    minify: false,
  },
  {
    input: "command.css",
    output: "command.css",
    minify: false,
  },
  {
    input: "alert.css",
    output: "alert.css",
    minify: false,
  },
  {
    input: "banner.css",
    output: "banner.css",
    minify: false,
  },
  {
    input: "empty-state.css",
    output: "empty-state.css",
    minify: false,
  },
  {
    input: "result.css",
    output: "result.css",
    minify: false,
  },
  {
    input: "loading-overlay.css",
    output: "loading-overlay.css",
    minify: false,
  },
  {
    input: "table.css",
    output: "table.css",
    minify: false,
  },
  {
    input: "data-table.css",
    output: "data-table.css",
    minify: false,
  },
  {
    input: "stat.css",
    output: "stat.css",
    minify: false,
  },
  {
    input: "timeline.css",
    output: "timeline.css",
    minify: false,
  },
  {
    input: "rating.css",
    output: "rating.css",
    minify: false,
  },
  {
    input: "number-input.css",
    output: "number-input.css",
    minify: false,
  },
  {
    input: "pin-input.css",
    output: "pin-input.css",
    minify: false,
  },
  {
    input: "tags-input.css",
    output: "tags-input.css",
    minify: false,
  },
  {
    input: "time-picker.css",
    output: "time-picker.css",
    minify: false,
  },
  {
    input: "calendar.css",
    output: "calendar.css",
    minify: false,
  },
  {
    input: "date-picker.css",
    output: "date-picker.css",
    minify: false,
  },
  {
    input: "date-range-picker.css",
    output: "date-range-picker.css",
    minify: false,
  },
  {
    input: "file-upload.css",
    output: "file-upload.css",
    minify: false,
  },
  {
    input: "dropzone.css",
    output: "dropzone.css",
    minify: false,
  },
  {
    input: "color-picker.css",
    output: "color-picker.css",
    minify: false,
  },
  {
    input: "box.css",
    output: "box.css",
    minify: false,
  },
  {
    input: "stack.css",
    output: "stack.css",
    minify: false,
  },
  {
    input: "flex.css",
    output: "flex.css",
    minify: false,
  },
  {
    input: "grid.css",
    output: "grid.css",
    minify: false,
  },
  {
    input: "container.css",
    output: "container.css",
    minify: false,
  },
  {
    input: "center.css",
    output: "center.css",
    minify: false,
  },
  {
    input: "spacer.css",
    output: "spacer.css",
    minify: false,
  },
  {
    input: "aspect-ratio.css",
    output: "aspect-ratio.css",
    minify: false,
  },
  {
    input: "visually-hidden.css",
    output: "visually-hidden.css",
    minify: false,
  },
  {
    input: "focus-scope.css",
    output: "focus-scope.css",
    minify: false,
  },
  {
    input: "image.css",
    output: "image.css",
    minify: false,
  },
  {
    input: "carousel.css",
    output: "carousel.css",
    minify: false,
  },
  {
    input: "resizable.css",
    output: "resizable.css",
    minify: false,
  },
  {
    input: "virtual-list.css",
    output: "virtual-list.css",
    minify: false,
  },
  {
    input: "dashboard-layout.css",
    output: "dashboard-layout.css",
    minify: false,
  },
  {
    input: "data-grid.css",
    output: "data-grid.css",
    minify: false,
  },
  {
    input: "tree-table.css",
    output: "tree-table.css",
    minify: false,
  },
  {
    input: "chart.css",
    output: "chart.css",
    minify: false,
  },
  {
    input: "form.css",
    output: "form.css",
    minify: false,
  },
  {
    input: "masked-input.css",
    output: "masked-input.css",
    minify: false,
  },
  {
    input: "currency-input.css",
    output: "currency-input.css",
    minify: false,
  },
  {
    input: "phone-input.css",
    output: "phone-input.css",
    minify: false,
  },
  {
    input: "mentions.css",
    output: "mentions.css",
    minify: false,
  },
  {
    input: "cascader.css",
    output: "cascader.css",
    minify: false,
  },
  {
    input: "transfer.css",
    output: "transfer.css",
    minify: false,
  },
  {
    input: "video-player.css",
    output: "video-player.css",
    minify: false,
  },
  {
    input: "audio-player.css",
    output: "audio-player.css",
    minify: false,
  },
  {
    input: "pdf-viewer.css",
    output: "pdf-viewer.css",
    minify: false,
  },
  {
    input: "lightbox.css",
    output: "lightbox.css",
    minify: false,
  },
  {
    input: "image-cropper.css",
    output: "image-cropper.css",
    minify: false,
  },
  {
    input: "qr-code.css",
    output: "qr-code.css",
    minify: false,
  },
  {
    input: "app-shell.css",
    output: "app-shell.css",
    minify: false,
  },
  {
    input: "menubar.css",
    output: "menubar.css",
    minify: false,
  },
  {
    input: "toolbar.css",
    output: "toolbar.css",
    minify: false,
  },
  {
    input: "popconfirm.css",
    output: "popconfirm.css",
    minify: false,
  },
  {
    input: "tour.css",
    output: "tour.css",
    minify: false,
  },
  {
    input: "notification-center.css",
    output: "notification-center.css",
    minify: false,
  },
  {
    input: "kanban.css",
    output: "kanban.css",
    minify: false,
  },
  {
    input: "chat.css",
    output: "chat.css",
    minify: false,
  },
  {
    input: "scheduler.css",
    output: "scheduler.css",
    minify: false,
  },
  {
    input: "gantt.css",
    output: "gantt.css",
    minify: false,
  },
  {
    input: "file-manager.css",
    output: "file-manager.css",
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
