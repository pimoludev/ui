
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);

async function load(name) {
  return readFile(
    new URL(name, dist),
    "utf8"
  );
}

test("generates the full CSS bundles and every component stylesheet", async () => {
  for (const file of [
    "pimolu.css",
    "pimolu.min.css",
    "button.css",
    "input.css",
    "card.css",
    "badge.css",
    "avatar.css",
    "avatar-group.css",
    "separator.css",
    "skeleton.css",
    "spinner.css",
    "switch.css",
    "checkbox.css",
    "radio.css",
    "textarea.css",
    "select.css",
    "combobox.css",
    "multi-select.css",
    "slider.css",
    "range-slider.css",
    "progress.css",
    "circular-progress.css",
    "tooltip.css",
    "popover.css",
    "dialog.css",
    "tabs.css",
    "toggle.css",
    "toggle-group.css",
    "segmented-control.css",
    "link.css",
    "typography.css",
    "code.css",
    "label.css",
    "form-field.css",
    "accordion.css",
    "breadcrumbs.css",
    "pagination.css",
    "stepper.css",
    "navbar.css",
    "sidebar.css",
    "navigation-menu.css",
    "scroll-area.css",
    "tree-view.css",
    "list.css",
    "description-list.css",
    "dropdown-menu.css",
    "toast.css",
    "drawer.css",
    "context-menu.css",
    "hover-card.css",
    "command.css",
    "alert.css",
    "banner.css",
    "empty-state.css",
    "result.css",
    "loading-overlay.css",
    "table.css",
    "data-table.css",
    "stat.css",
    "timeline.css",
    "rating.css",
    "number-input.css",
    "pin-input.css",
    "tags-input.css",
    "time-picker.css",
    "calendar.css",
    "date-picker.css",
    "date-range-picker.css",
    "file-upload.css",
    "dropzone.css",
    "color-picker.css",
    "box.css",
    "stack.css",
    "flex.css",
    "grid.css",
    "container.css",
    "center.css",
    "spacer.css",
    "aspect-ratio.css",
    "visually-hidden.css",
    "focus-scope.css",
    "image.css",
    "carousel.css",
    "resizable.css",
    "virtual-list.css",
    "dashboard-layout.css",
    "data-grid.css",
    "tree-table.css",
    "chart.css",
    "form.css",
    "masked-input.css",
    "currency-input.css",
    "phone-input.css",
    "mentions.css",
    "cascader.css",
    "transfer.css",
    "video-player.css",
    "audio-player.css",
    "pdf-viewer.css",
    "lightbox.css",
    "image-cropper.css",
    "qr-code.css",
    "app-shell.css",
    "menubar.css",
    "toolbar.css",
    "popconfirm.css",
    "tour.css",
    "notification-center.css",
    "kanban.css",
    "chat.css",
    "scheduler.css",
    "gantt.css",
    "file-manager.css",
  ]) {
    const css = await load(file);

    assert.ok(
      css.trim().length > 0,
      `${file} is empty`
    );
  }
});

test("full bundle includes themes and components", async () => {
  const css = await load("pimolu.css");

  for (const token of [
    "--pimolu-primary",
    "--pimolu-shadow-raised",
    "prefers-color-scheme",
    ".pimolu-button",
    ".pimolu-input",
    ".pimolu-tooltip",
    ".pimolu-popover",
    ".pimolu-dialog",
    ".pimolu-tabs",
    ".pimolu-toggle",
    ".pimolu-toggle-group",
    ".pimolu-segmented-control",
    ".pimolu-link",
    ".pimolu-text",
    ".pimolu-heading",
    ".pimolu-code",
    ".pimolu-kbd",
    ".pimolu-label",
    ".pimolu-form-field",
    ".pimolu-accordion",
    ".pimolu-breadcrumbs",
    ".pimolu-pagination",
    ".pimolu-stepper",
    ".pimolu-navbar",
    ".pimolu-sidebar",
    ".pimolu-navigation-menu",
    ".pimolu-scroll-area",
    ".pimolu-tree",
    ".pimolu-list",
    ".pimolu-description-list",
    ".pimolu-dropdown-menu",
    ".pimolu-toast",
    ".pimolu-drawer",
    ".pimolu-context-menu",
    ".pimolu-hover-card",
    ".pimolu-command",
    ".pimolu-alert",
    ".pimolu-banner",
    ".pimolu-empty-state",
    ".pimolu-result",
    ".pimolu-loading-overlay",
    ".pimolu-table",
    ".pimolu-data-table",
    ".pimolu-stat",
    ".pimolu-timeline",
    ".pimolu-rating",
    ".pimolu-number-input",
    ".pimolu-pin-input",
    ".pimolu-tags-input",
    ".pimolu-time-picker",
    ".pimolu-calendar",
    ".pimolu-date-picker",
    ".pimolu-date-range-picker",
    ".pimolu-file-upload",
    ".pimolu-dropzone",
    ".pimolu-color-picker",
    ".pimolu-box",
    ".pimolu-stack",
    ".pimolu-flex",
    ".pimolu-grid",
    ".pimolu-container",
    ".pimolu-center",
    ".pimolu-spacer",
    ".pimolu-aspect-ratio",
    ".pimolu-visually-hidden",
    ".pimolu-focus-scope",
    ".pimolu-image",
    ".pimolu-carousel",
    ".pimolu-resizable",
    ".pimolu-virtual-list",
    ".pimolu-dashboard-layout",
    ".pimolu-data-grid",
    ".pimolu-tree-table",
    ".pimolu-chart",
    ".pimolu-form",
    ".pimolu-masked-input",
    ".pimolu-currency-input",
    ".pimolu-phone-input",
    ".pimolu-mentions",
    ".pimolu-cascader",
    ".pimolu-transfer",
    ".pimolu-video-player",
    ".pimolu-audio-player",
    ".pimolu-pdf-viewer",
    ".pimolu-lightbox",
    ".pimolu-image-cropper",
    ".pimolu-qr-code",
    ".pimolu-app-shell",
    ".pimolu-menubar",
    ".pimolu-toolbar",
    ".pimolu-popconfirm",
    ".pimolu-tour",
    ".pimolu-notification-center",
    ".pimolu-kanban",
    ".pimolu-chat",
    ".pimolu-scheduler",
    ".pimolu-gantt",
    ".pimolu-file-manager",
    '[data-pimolu-radius=sharp]',
    '[data-pimolu-radius=medium]',
    '[data-pimolu-radius=round]',
    '[data-pimolu-density=compact]',
    '[data-pimolu-density=comfortable]',
    '[data-pimolu-density=spacious]',
  ]) {
    assert.ok(
      css.includes(token),
      `Missing CSS content: ${token}`
    );
  }
});

test("full bundles have no unresolved imports", async () => {
  for (const file of [
    "pimolu.css",
    "pimolu.min.css",
  ]) {
    const css = await load(file);

    assert.doesNotMatch(
      css,
      /@import\s/i,
      `${file} contains unresolved imports`
    );
  }
});

test("component bundles contain their own styles", async () => {
  const button = await load("button.css");
  const input = await load("input.css");

  assert.ok(button.includes(".pimolu-button"));
  assert.ok(input.includes(".pimolu-input"));
});

test("minified bundle is smaller", async () => {
  const full = await load("pimolu.css");
  const minified = await load("pimolu.min.css");

  assert.ok(
    minified.length < full.length,
    "Minified CSS should be smaller"
  );
});


test("Card styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const card = await load("card.css");

  const selectors = [
    ".pimolu-card",
    ".pimolu-card--outline",
    ".pimolu-card--soft",
    ".pimolu-card--elevated",
    ".pimolu-card--glass",
    ".pimolu-card__header",
    ".pimolu-card__title",
    ".pimolu-card__description",
    ".pimolu-card__content",
    ".pimolu-card__footer",
  ];

  for (const selector of selectors) {
    assert.ok(
      card.includes(selector),
      `Missing Card selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }
});


test("Badge styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const badge = await load("badge.css");

  const selectors = [
    ".pimolu-badge",
    ".pimolu-badge--solid",
    ".pimolu-badge--soft",
    ".pimolu-badge--outline",
    ".pimolu-badge--glass",
    ".pimolu-badge--sm",
    ".pimolu-badge--md",
    ".pimolu-badge--lg",
    ".pimolu-badge--radius-full",
    ".pimolu-badge__dot",
    ".pimolu-badge__label",
  ];

  for (const selector of selectors) {
    assert.ok(
      badge.includes(selector),
      `Missing Badge selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }
});


test("Avatar styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const avatar = await load("avatar.css");

  const selectors = [
    ".pimolu-avatar",
    ".pimolu-avatar--xs",
    ".pimolu-avatar--sm",
    ".pimolu-avatar--md",
    ".pimolu-avatar--lg",
    ".pimolu-avatar--xl",
    ".pimolu-avatar--circle",
    ".pimolu-avatar--rounded",
    ".pimolu-avatar--square",
    ".pimolu-avatar__image",
    ".pimolu-avatar__fallback",
  ];

  for (const selector of selectors) {
    assert.ok(
      avatar.includes(selector),
      `Missing Avatar selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    avatar.includes("object-fit: cover"),
    "Avatar images should preserve their proportions"
  );
});


test("AvatarGroup styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const group = await load("avatar-group.css");

  const selectors = [
    ".pimolu-avatar-group",
    ".pimolu-avatar-group--spacing-tight",
    ".pimolu-avatar-group--spacing-normal",
    ".pimolu-avatar-group--spacing-loose",
    ".pimolu-avatar-group__more",
    ".pimolu-avatar-group__more-label",
  ];

  for (const selector of selectors) {
    assert.ok(
      group.includes(selector),
      `Missing AvatarGroup selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    group.includes("margin-inline-start"),
    "AvatarGroup should use logical margins"
  );

  assert.ok(
    group.includes(
      "--pimolu-avatar-group-overlap-ratio"
    ),
    "AvatarGroup should expose an overlap token"
  );

  assert.ok(
    group.includes(
      "--pimolu-avatar-group-ring-color"
    ),
    "AvatarGroup should expose a ring color token"
  );
});


test("Separator styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const separator = await load("separator.css");

  const selectors = [
    ".pimolu-separator",
    ".pimolu-separator--horizontal",
    ".pimolu-separator--vertical",

    ".pimolu-separator--solid",
    ".pimolu-separator--dashed",
    ".pimolu-separator--dotted",

    ".pimolu-separator--thin",
    ".pimolu-separator--medium",
    ".pimolu-separator--thick",

    ".pimolu-separator--neutral",
    ".pimolu-separator--primary",
    ".pimolu-separator--secondary",
    ".pimolu-separator--success",
    ".pimolu-separator--warning",
    ".pimolu-separator--danger",
  ];

  for (const selector of selectors) {
    assert.ok(
      separator.includes(selector),
      `Missing Separator selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    separator.includes("border-block-start"),
    "Horizontal separator must use a logical border"
  );

  assert.ok(
    separator.includes("border-inline-start"),
    "Vertical separator must use a logical border"
  );

  assert.ok(
    separator.includes("--pimolu-separator-tone"),
    "Separator must expose a semantic color token"
  );

  assert.ok(
    separator.includes("--pimolu-control-border-width"),
    "Separator must reuse the visual border token"
  );
});


test("Skeleton styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const skeleton = await load("skeleton.css");

  const selectors = [
    ".pimolu-skeleton",
    ".pimolu-skeleton--text",
    ".pimolu-skeleton--rectangular",
    ".pimolu-skeleton--rounded",
    ".pimolu-skeleton--circular",
    ".pimolu-skeleton--pulse",
    ".pimolu-skeleton--wave",
    ".pimolu-skeleton--none",
  ];

  for (const selector of selectors) {
    assert.ok(
      skeleton.includes(selector),
      `Missing Skeleton selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    skeleton.includes("pimolu-skeleton-pulse"),
    "Missing Pulse animation"
  );

  assert.ok(
    skeleton.includes("pimolu-skeleton-wave"),
    "Missing Wave animation"
  );

  assert.ok(
    skeleton.includes("prefers-reduced-motion"),
    "Skeleton must respect reduced motion"
  );

  assert.ok(
    skeleton.includes("forced-colors"),
    "Skeleton must support forced colors"
  );

  assert.ok(
    skeleton.includes("--pimolu-skeleton-background"),
    "Skeleton must expose its background token"
  );
});


test("Spinner styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const spinner = await load("spinner.css");

  const selectors = [
    ".pimolu-spinner",

    ".pimolu-spinner--xs",
    ".pimolu-spinner--sm",
    ".pimolu-spinner--md",
    ".pimolu-spinner--lg",
    ".pimolu-spinner--xl",

    ".pimolu-spinner--circular",
    ".pimolu-spinner--dots",
    ".pimolu-spinner--arc",

    ".pimolu-spinner--inherit",
    ".pimolu-spinner--neutral",
    ".pimolu-spinner--primary",
    ".pimolu-spinner--secondary",
    ".pimolu-spinner--success",
    ".pimolu-spinner--warning",
    ".pimolu-spinner--danger",

    ".pimolu-spinner__visual",
    ".pimolu-spinner__svg",
    ".pimolu-spinner__dot",
    ".pimolu-spinner__label",
  ];

  for (const selector of selectors) {
    assert.ok(
      spinner.includes(selector),
      `Missing Spinner selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    spinner.includes("pimolu-spinner-rotate"),
    "Missing rotation animation"
  );

  assert.ok(
    spinner.includes("pimolu-spinner-dot"),
    "Missing dots animation"
  );

  assert.ok(
    spinner.includes("prefers-reduced-motion"),
    "Spinner must respect reduced motion"
  );

  assert.ok(
    spinner.includes("forced-colors"),
    "Spinner must support forced colors"
  );

  assert.ok(
    spinner.includes("--pimolu-spinner-color"),
    "Spinner must expose its color token"
  );
});


test("Switch styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const css = await load("switch.css");

  const selectors = [
    ".pimolu-switch",
    ".pimolu-switch--sm",
    ".pimolu-switch--md",
    ".pimolu-switch--lg",

    ".pimolu-switch--neutral",
    ".pimolu-switch--primary",
    ".pimolu-switch--secondary",
    ".pimolu-switch--success",
    ".pimolu-switch--warning",
    ".pimolu-switch--danger",

    ".pimolu-switch__control",
    ".pimolu-switch__input",
    ".pimolu-switch__track",
    ".pimolu-switch__thumb",

    ".pimolu-switch__label",
    ".pimolu-switch__description",
    ".pimolu-switch__required",
  ];

  for (const selector of selectors) {
    assert.ok(
      css.includes(selector),
      `Missing Switch selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    css.includes(":checked"),
    "Missing checked state"
  );

  assert.ok(
    css.includes(":focus-visible"),
    "Missing keyboard focus state"
  );

  assert.ok(
    css.includes(":disabled"),
    "Missing disabled state"
  );

  assert.ok(
    css.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    css.includes("forced-colors"),
    "Missing forced colors support"
  );

  assert.ok(
    css.includes("inset-inline-start"),
    "Switch should support logical positioning"
  );
});


test("Checkbox styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const css = await load("checkbox.css");

  const selectors = [
    ".pimolu-checkbox",
    ".pimolu-checkbox--sm",
    ".pimolu-checkbox--md",
    ".pimolu-checkbox--lg",
    ".pimolu-checkbox--neutral",
    ".pimolu-checkbox--primary",
    ".pimolu-checkbox--secondary",
    ".pimolu-checkbox--success",
    ".pimolu-checkbox--warning",
    ".pimolu-checkbox--danger",
    ".pimolu-checkbox__input",
    ".pimolu-checkbox__box",
    ".pimolu-checkbox__check",
    ".pimolu-checkbox__minus",
    ".pimolu-checkbox__label",
    ".pimolu-checkbox__description",
  ];

  for (const selector of selectors) {
    assert.ok(
      css.includes(selector),
      `Missing Checkbox selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    css.includes(":checked"),
    "Missing checked state"
  );

  assert.ok(
    css.includes(":indeterminate"),
    "Missing indeterminate state"
  );

  assert.ok(
    css.includes(":focus-visible"),
    "Missing keyboard focus"
  );

  assert.ok(
    css.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    css.includes("forced-colors"),
    "Missing forced colors support"
  );
});


test("Radio styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const css = await load("radio.css");

  const selectors = [
    ".pimolu-radio",
    ".pimolu-radio--sm",
    ".pimolu-radio--md",
    ".pimolu-radio--lg",

    ".pimolu-radio--neutral",
    ".pimolu-radio--primary",
    ".pimolu-radio--secondary",
    ".pimolu-radio--success",
    ".pimolu-radio--warning",
    ".pimolu-radio--danger",

    ".pimolu-radio__input",
    ".pimolu-radio__circle",
    ".pimolu-radio__label",
    ".pimolu-radio__description",

    ".pimolu-radio-group",
    ".pimolu-radio-group--horizontal",
    ".pimolu-radio-group--vertical",
    ".pimolu-radio-group__legend",
    ".pimolu-radio-group__options",
  ];

  for (const selector of selectors) {
    assert.ok(
      css.includes(selector),
      `Missing Radio selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    css.includes(":checked"),
    "Missing checked state"
  );

  assert.ok(
    css.includes(":focus-visible"),
    "Missing keyboard focus state"
  );

  assert.ok(
    css.includes(":disabled"),
    "Missing disabled state"
  );

  assert.ok(
    css.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    css.includes("forced-colors"),
    "Missing forced colors support"
  );
});


test("Textarea styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const css = await load("textarea.css");

  const selectors = [
    ".pimolu-textarea",

    ".pimolu-textarea--xs",
    ".pimolu-textarea--sm",
    ".pimolu-textarea--md",
    ".pimolu-textarea--lg",
    ".pimolu-textarea--xl",
    ".pimolu-textarea--xxl",

    ".pimolu-textarea--neutral",
    ".pimolu-textarea--primary",
    ".pimolu-textarea--secondary",
    ".pimolu-textarea--success",
    ".pimolu-textarea--warning",
    ".pimolu-textarea--danger",

    ".pimolu-textarea--outline",
    ".pimolu-textarea--soft",
    ".pimolu-textarea--filled",
    ".pimolu-textarea--glass",

    ".pimolu-textarea--resize-none",
    ".pimolu-textarea--resize-vertical",
    ".pimolu-textarea--resize-horizontal",
    ".pimolu-textarea--resize-both",

    ".pimolu-textarea__control",
    ".pimolu-textarea__label",
    ".pimolu-textarea__helper",
    ".pimolu-textarea__error",
    ".pimolu-textarea__counter",
  ];

  for (const selector of selectors) {
    assert.ok(
      css.includes(selector),
      `Missing Textarea selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    css.includes(":focus-visible"),
    "Missing keyboard focus state"
  );

  assert.ok(
    css.includes(":disabled"),
    "Missing disabled state"
  );

  assert.ok(
    css.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    css.includes("forced-colors"),
    "Missing forced colors support"
  );
});


test("Select styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const css = await load("select.css");

  const selectors = [
    ".pimolu-select",

    ".pimolu-select--xs",
    ".pimolu-select--sm",
    ".pimolu-select--md",
    ".pimolu-select--lg",
    ".pimolu-select--xl",
    ".pimolu-select--xxl",

    ".pimolu-select--neutral",
    ".pimolu-select--primary",
    ".pimolu-select--secondary",
    ".pimolu-select--success",
    ".pimolu-select--warning",
    ".pimolu-select--danger",

    ".pimolu-select--outline",
    ".pimolu-select--soft",
    ".pimolu-select--filled",
    ".pimolu-select--glass",

    ".pimolu-select__label",
    ".pimolu-select__field",
    ".pimolu-select__control",
    ".pimolu-select__chevron",
    ".pimolu-select__helper",
    ".pimolu-select__error",
  ];

  for (const selector of selectors) {
    assert.ok(
      css.includes(selector),
      `Missing Select selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    css.includes("appearance: none"),
    "Select must hide the native arrow"
  );

  assert.ok(
    css.includes("inset-inline-end"),
    "Chevron must support RTL layouts"
  );

  assert.ok(
    css.includes(":focus-visible"),
    "Missing keyboard focus state"
  );

  assert.ok(
    css.includes(":disabled"),
    "Missing disabled state"
  );

  assert.ok(
    css.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    css.includes("forced-colors"),
    "Missing forced colors support"
  );
});


test("Combobox styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const css = await load("combobox.css");

  const selectors = [
    ".pimolu-combobox",

    ".pimolu-combobox--xs",
    ".pimolu-combobox--sm",
    ".pimolu-combobox--md",
    ".pimolu-combobox--lg",
    ".pimolu-combobox--xl",
    ".pimolu-combobox--xxl",

    ".pimolu-combobox--neutral",
    ".pimolu-combobox--primary",
    ".pimolu-combobox--secondary",
    ".pimolu-combobox--success",
    ".pimolu-combobox--warning",
    ".pimolu-combobox--danger",

    ".pimolu-combobox--outline",
    ".pimolu-combobox--soft",
    ".pimolu-combobox--filled",
    ".pimolu-combobox--glass",

    ".pimolu-combobox__input",
    ".pimolu-combobox__listbox",
    ".pimolu-combobox__option",
    ".pimolu-combobox__empty",
    ".pimolu-combobox__clear",
    ".pimolu-combobox__chevron",
    ".pimolu-combobox__helper",
    ".pimolu-combobox__error",
  ];

  for (const selector of selectors) {
    assert.ok(
      css.includes(selector),
      `Missing Combobox selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    css.includes("[data-active"),
    "Missing active option styling"
  );

  assert.ok(
    css.includes("inset-inline-end"),
    "Missing RTL-friendly positioning"
  );

  assert.ok(
    css.includes(":focus-visible"),
    "Missing focus-visible styles"
  );

  assert.ok(
    css.includes("prefers-reduced-motion"),
    "Missing reduced-motion support"
  );

  assert.ok(
    css.includes("forced-colors"),
    "Missing forced-colors support"
  );
});


test("MultiSelect styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const css = await load("multi-select.css");

  const selectors = [
    ".pimolu-multiselect",

    ".pimolu-multiselect--xs",
    ".pimolu-multiselect--sm",
    ".pimolu-multiselect--md",
    ".pimolu-multiselect--lg",
    ".pimolu-multiselect--xl",
    ".pimolu-multiselect--xxl",

    ".pimolu-multiselect--neutral",
    ".pimolu-multiselect--primary",
    ".pimolu-multiselect--secondary",
    ".pimolu-multiselect--success",
    ".pimolu-multiselect--warning",
    ".pimolu-multiselect--danger",

    ".pimolu-multiselect--outline",
    ".pimolu-multiselect--soft",
    ".pimolu-multiselect--filled",
    ".pimolu-multiselect--glass",

    ".pimolu-multiselect__field",
    ".pimolu-multiselect__input",
    ".pimolu-multiselect__tag",
    ".pimolu-multiselect__tag-remove",
    ".pimolu-multiselect__clear",
    ".pimolu-multiselect__listbox",
    ".pimolu-multiselect__option",
    ".pimolu-multiselect__empty",
    ".pimolu-multiselect__error",
    ".pimolu-multiselect__helper",
  ];

  for (const selector of selectors) {
    assert.ok(
      css.includes(selector),
      `Missing MultiSelect selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    css.includes("data-active"),
    "Missing active option styling"
  );

  assert.ok(
    css.includes(":focus-within"),
    "Missing keyboard focus styling"
  );

  assert.ok(
    css.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    css.includes("forced-colors"),
    "Missing forced colors support"
  );
});


test("Slider styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const slider = await load("slider.css");

  const selectors = [
    ".pimolu-slider",
    ".pimolu-slider--sm",
    ".pimolu-slider--md",
    ".pimolu-slider--lg",

    ".pimolu-slider--neutral",
    ".pimolu-slider--primary",
    ".pimolu-slider--secondary",
    ".pimolu-slider--success",
    ".pimolu-slider--warning",
    ".pimolu-slider--danger",

    ".pimolu-slider__header",
    ".pimolu-slider__label",
    ".pimolu-slider__value",
    ".pimolu-slider__control",
    ".pimolu-slider__helper",
    ".pimolu-slider__error",

    ".pimolu-slider--invalid",
    ".pimolu-slider--disabled",
  ];

  for (const selector of selectors) {
    assert.ok(
      slider.includes(selector),
      `Missing Slider selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    slider.includes("--pimolu-slider-progress"),
    "The fill must be driven by the value custom property"
  );

  assert.ok(
    slider.includes("webkit-slider-runnable-track"),
    "The native track must be reset before styling"
  );

  assert.ok(
    slider.includes("moz-range-progress"),
    "Firefox must use its native progress pseudo-element"
  );

  assert.ok(
    slider.includes("forced-colors"),
    "Missing forced colors support"
  );
});


test("RangeSlider styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const rangeSlider = await load("range-slider.css");

  const selectors = [
    ".pimolu-range-slider",
    ".pimolu-range-slider--sm",
    ".pimolu-range-slider--md",
    ".pimolu-range-slider--lg",

    ".pimolu-range-slider--neutral",
    ".pimolu-range-slider--primary",
    ".pimolu-range-slider--secondary",
    ".pimolu-range-slider--success",
    ".pimolu-range-slider--warning",
    ".pimolu-range-slider--danger",

    ".pimolu-range-slider__header",
    ".pimolu-range-slider__label",
    ".pimolu-range-slider__value",
    ".pimolu-range-slider__control",
    ".pimolu-range-slider__track",
    ".pimolu-range-slider__input",
    ".pimolu-range-slider__helper",
    ".pimolu-range-slider__error",

    ".pimolu-range-slider--invalid",
    ".pimolu-range-slider--disabled",
  ];

  for (const selector of selectors) {
    assert.ok(
      rangeSlider.includes(selector),
      `Missing RangeSlider selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    rangeSlider.includes("--pimolu-range-slider-start"),
    "The selected segment must start at a custom property"
  );

  assert.ok(
    rangeSlider.includes("--pimolu-range-slider-end"),
    "The selected segment must end at a custom property"
  );

  assert.ok(
    rangeSlider.includes("webkit-slider-thumb"),
    "Missing WebKit thumb styling"
  );

  assert.ok(
    rangeSlider.includes("moz-range-thumb"),
    "Missing Firefox thumb styling"
  );

  assert.ok(
    rangeSlider.includes("pointer-events"),
    "The stacked inputs must let the other thumb receive the pointer"
  );

  assert.ok(
    rangeSlider.includes("forced-colors"),
    "Missing forced colors support"
  );
});


test("Progress styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const progress = await load("progress.css");

  const selectors = [
    ".pimolu-progress",
    ".pimolu-progress--sm",
    ".pimolu-progress--md",
    ".pimolu-progress--lg",

    ".pimolu-progress--neutral",
    ".pimolu-progress--primary",
    ".pimolu-progress--secondary",
    ".pimolu-progress--success",
    ".pimolu-progress--warning",
    ".pimolu-progress--danger",

    ".pimolu-progress__header",
    ".pimolu-progress__label",
    ".pimolu-progress__value",
    ".pimolu-progress__track",
    ".pimolu-progress__fill",
    ".pimolu-progress--indeterminate",
  ];

  for (const selector of selectors) {
    assert.ok(
      progress.includes(selector),
      `Missing Progress selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    progress.includes("--pimolu-progress-value"),
    "The fill must be driven by the value custom property"
  );

  assert.ok(
    progress.includes("pimolu-progress-sweep"),
    "Missing the indeterminate animation"
  );

  assert.ok(
    progress.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    progress.includes("forced-colors"),
    "Missing forced colors support"
  );
});


test("CircularProgress styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const circular = await load("circular-progress.css");

  const selectors = [
    ".pimolu-circular-progress",
    ".pimolu-circular-progress--sm",
    ".pimolu-circular-progress--md",
    ".pimolu-circular-progress--lg",

    ".pimolu-circular-progress--neutral",
    ".pimolu-circular-progress--primary",
    ".pimolu-circular-progress--secondary",
    ".pimolu-circular-progress--success",
    ".pimolu-circular-progress--warning",
    ".pimolu-circular-progress--danger",

    ".pimolu-circular-progress__svg",
    ".pimolu-circular-progress__track",
    ".pimolu-circular-progress__indicator",
    ".pimolu-circular-progress__value",
    ".pimolu-circular-progress--indeterminate",
  ];

  for (const selector of selectors) {
    assert.ok(
      circular.includes(selector),
      `Missing CircularProgress selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    circular.includes("--pimolu-circular-progress-offset"),
    "The ring must be driven by the offset custom property"
  );

  assert.ok(
    circular.includes("pimolu-circular-progress-rotate"),
    "Missing the indeterminate rotation"
  );

  assert.ok(
    circular.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    circular.includes("forced-colors"),
    "Missing forced colors support"
  );
});

test("Popover styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const popover = await load("popover.css");

  const selectors = [
    ".pimolu-popover",
    ".pimolu-popover--padding-none",
    ".pimolu-popover--padding-sm",
    ".pimolu-popover--padding-md",
    ".pimolu-popover--padding-lg",
    ".pimolu-popover--match-width",
    ".pimolu-popover[data-state=open]",
    ".pimolu-popover[data-state=closing]",
    ".pimolu-popover[data-side=top]",
    ".pimolu-popover[data-side=bottom]",
  ];

  for (const selector of selectors) {
    assert.ok(
      popover.includes(selector),
      `Missing Popover selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    popover.includes("--pimolu-popover-padding"),
    "The panel padding must be driven by a custom property"
  );

  assert.ok(
    popover.includes("pimolu-popover-in"),
    "Missing the entrance animation"
  );

  assert.ok(
    popover.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    popover.includes("forced-colors"),
    "Missing forced colors support"
  );
});

test("Dialog styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const dialog = await load("dialog.css");

  const selectors = [
    ".pimolu-dialog",
    ".pimolu-dialog__overlay",
    ".pimolu-dialog__content",
    ".pimolu-dialog__content--sm",
    ".pimolu-dialog__content--md",
    ".pimolu-dialog__content--lg",
    ".pimolu-dialog__header",
    ".pimolu-dialog__title",
    ".pimolu-dialog__description",
    ".pimolu-dialog__footer",
    ".pimolu-dialog__close",
  ];

  for (const selector of selectors) {
    assert.ok(
      dialog.includes(selector),
      `Missing Dialog selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    dialog.includes("--pimolu-dialog-width"),
    "The panel width must be driven by a custom property"
  );

  assert.ok(
    dialog.includes("pimolu-dialog-content-in"),
    "Missing the entrance animation"
  );

  assert.ok(
    dialog.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    dialog.includes("forced-colors"),
    "Missing forced colors support"
  );
});

test("Tabs styles are included in the CSS build", async () => {
  const full = await load("pimolu.css");
  const tabs = await load("tabs.css");

  const selectors = [
    ".pimolu-tabs",
    ".pimolu-tabs--line",
    ".pimolu-tabs--solid",
    ".pimolu-tabs--soft",
    ".pimolu-tabs--sm",
    ".pimolu-tabs--md",
    ".pimolu-tabs--lg",
    ".pimolu-tabs--vertical",
    ".pimolu-tabs__list",
    ".pimolu-tabs__trigger",
    ".pimolu-tabs__panel",
  ];

  for (const selector of selectors) {
    assert.ok(
      tabs.includes(selector),
      `Missing Tabs selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  assert.ok(
    tabs.includes("--pimolu-tabs-height"),
    "The trigger height must be driven by a custom property"
  );

  assert.ok(
    tabs.includes("pimolu-tabs-panel-in"),
    "Missing the active panel animation"
  );

  assert.ok(
    tabs.includes("prefers-reduced-motion"),
    "Missing reduced motion support"
  );

  assert.ok(
    tabs.includes("forced-colors"),
    "Missing forced colors support"
  );
});

test("Toggle, SegmentedControl, Link and Typography styles are bundled", async () => {
  const full = await load("pimolu.css");
  const toggle = await load("toggle.css");
  const toggleGroup = await load("toggle-group.css");
  const segmented = await load("segmented-control.css");
  const link = await load("link.css");
  const typography = await load("typography.css");
  const code = await load("code.css");
  const label = await load("label.css");
  const formField = await load("form-field.css");

  const expectations = [
    [toggle, ".pimolu-toggle"],
    [toggle, "[data-state=on]"],
    [toggleGroup, ".pimolu-toggle-group--vertical"],
    [segmented, ".pimolu-segmented-control--full-width"],
    [segmented, "[data-state=active]"],
    [link, ".pimolu-link--underline-hover"],
    [link, ".pimolu-link__external"],
    [typography, ".pimolu-typography--3xl"],
    [typography, ".pimolu-typography--tone-danger"],
    [code, ".pimolu-code-block"],
    [code, ".pimolu-kbd"],
    [label, ".pimolu-label__required"],
    [formField, ".pimolu-form-message--error"],
    [formField, ".pimolu-fieldset"],
  ];

  for (const [css, selector] of expectations) {
    assert.ok(
      css.includes(selector),
      `Missing selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }

  for (const css of [
    toggle,
    segmented,
    link,
    code,
    formField,
  ]) {
    assert.ok(
      css.includes("forced-colors") ||
        css.includes("prefers-reduced-motion"),
      "Missing an accessibility media query"
    );
  }
});

test("Phase 2 navigation styles are bundled", async () => {
  const full = await load("pimolu.css");
  const accordion = await load("accordion.css");
  const breadcrumbs = await load("breadcrumbs.css");
  const pagination = await load("pagination.css");
  const stepper = await load("stepper.css");
  const navbar = await load("navbar.css");
  const sidebar = await load("sidebar.css");
  const navigationMenu = await load("navigation-menu.css");
  const scrollArea = await load("scroll-area.css");
  const tree = await load("tree-view.css");
  const list = await load("list.css");
  const description = await load("description-list.css");

  const expectations = [
    [accordion, ".pimolu-accordion__trigger"],
    [accordion, ".pimolu-accordion--separated"],
    [breadcrumbs, ".pimolu-breadcrumbs__separator"],
    [pagination, ".pimolu-pagination__button"],
    [pagination, ".pimolu-pagination--lg"],
    [stepper, ".pimolu-stepper__marker"],
    [stepper, ".pimolu-stepper--vertical"],
    [navbar, ".pimolu-navbar__brand"],
    [navbar, ".pimolu-navbar[data-sticky=true]"],
    [sidebar, ".pimolu-sidebar__item"],
    [navigationMenu, ".pimolu-navigation-menu__content"],
    [scrollArea, ".pimolu-scroll-area__viewport"],
    [tree, ".pimolu-tree__item"],
    [list, ".pimolu-list--bordered"],
    [description, ".pimolu-description-list__term"],
  ];

  for (const [css, selector] of expectations) {
    assert.ok(
      css.includes(selector),
      `Missing selector: ${selector}`
    );

    assert.ok(
      full.includes(selector),
      `Missing bundled selector: ${selector}`
    );
  }
});

test("Overlay styles are bundled", async () => {
  const full = await load("pimolu.css");
  const dropdown = await load("dropdown-menu.css");
  const toast = await load("toast.css");

  for (const [css, selector] of [
    [dropdown, ".pimolu-dropdown-menu__item"],
    [dropdown, ".pimolu-dropdown-menu__separator"],
    [toast, ".pimolu-toaster"],
    [toast, ".pimolu-toast--danger"],
    [toast, ".pimolu-toast__close"],
  ]) {
    assert.ok(css.includes(selector));
    assert.ok(full.includes(selector));
  }
});

test("Phase 4 feedback and data styles are bundled", async () => {
  const full = await load("pimolu.css");

  for (const [file, selector] of [
    ["alert.css", ".pimolu-alert--danger"],
    ["banner.css", ".pimolu-banner--sticky"],
    ["empty-state.css", ".pimolu-empty-state--lg"],
    ["result.css", ".pimolu-result--success"],
    ["loading-overlay.css", ".pimolu-loading-overlay"],
    ["table.css", ".pimolu-table--bordered"],
    ["data-table.css", ".pimolu-data-table"],
    ["stat.css", ".pimolu-stat__delta"],
    ["timeline.css", ".pimolu-timeline__item"],
    ["rating.css", ".pimolu-rating__item"],
  ]) {
    const css = await load(file);

    assert.ok(css.includes(selector), `${file} missing ${selector}`);
    assert.ok(full.includes(selector), `bundle missing ${selector}`);
  }
});
