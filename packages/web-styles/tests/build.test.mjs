
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

test("generates all four CSS files", async () => {
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
