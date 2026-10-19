import {
  avatarGroupVariantMap,
  avatarVariantMap,
  badgeVariantMap,
  buttonVariantMap,
  cardVariantMap,
  checkboxVariantMap,
  comboboxVariantMap,
  circularProgressVariantMap,
  inputVariantMap,
  multiSelectVariantMap,
  progressVariantMap,
  popoverVariantMap,
  dialogVariantMap,
  tabsVariantMap,
  toggleVariantMap,
  segmentedControlVariantMap,
  linkVariantMap,
  typographyVariantMap,
  codeVariantMap,
  labelVariantMap,
  radioGroupVariantMap,
  radioVariantMap,
  rangeSliderVariantMap,
  selectVariantMap,
  separatorVariantMap,
  skeletonVariantMap,
  sliderVariantMap,
  spinnerVariantMap,
  switchVariantMap,
  textareaVariantMap,
  type PimoluStylePreset,
  type PimoluRadius,
  type PimoluDensity,
  type PimoluTheme,
  type PimoluThemeMode,
} from "@pimolu/react";

import { pimoluPresets } from "@pimolu/themes/presets";

/* Discovered from the theme package, so a new preset can never be forgotten. */
export const presets: PimoluStylePreset[] = [
  "default",
  ...(Object.keys(pimoluPresets) as PimoluStylePreset[]),
];

/* Color themes are not exposed as runtime data yet, so this stays explicit. */
export const themes: PimoluTheme[] = ["light", "dark"];

export const themeModes: PimoluThemeMode[] = ["light", "dark", "system"];

/* Radius is a dimension, not a preset axis: the list is exhaustive. */
export const radii: PimoluRadius[] = [
  "sharp",
  "medium",
  "round",
];

/* Density is a dimension too: factor 0.875 / 1 / 1.125. */
export const densities: PimoluDensity[] = [
  "compact",
  "comfortable",
  "spacious",
];

/* Derived from each component's own variant map, never duplicated here. */
export function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

export const buttonVariants = optionsOf(buttonVariantMap.variant);
export const buttonAppearances = optionsOf(buttonVariantMap.appearance);
export const buttonSizes = optionsOf(buttonVariantMap.size);
export const buttonRadii = optionsOf(buttonVariantMap.radius);

export const inputSizes = optionsOf(inputVariantMap.size);
export const inputVariants = optionsOf(inputVariantMap.variant);
export const inputAppearances = optionsOf(inputVariantMap.appearance);

export const cardSizes = optionsOf(cardVariantMap.size);
export const cardVariants = optionsOf(cardVariantMap.variant);
export const cardAppearances = optionsOf(cardVariantMap.appearance);

export const badgeSizes = optionsOf(badgeVariantMap.size);
export const badgeVariants = optionsOf(badgeVariantMap.variant);
export const badgeAppearances = optionsOf(badgeVariantMap.appearance);
export const badgeRadii = optionsOf(badgeVariantMap.radius);

export const avatarSizes = optionsOf(avatarVariantMap.size);
export const avatarShapes = optionsOf(avatarVariantMap.shape);
export const avatarGroupSpacings = optionsOf(
  avatarGroupVariantMap.spacing,
);

export const separatorOrientations = optionsOf(
  separatorVariantMap.orientation,
);
export const separatorAppearances = optionsOf(
  separatorVariantMap.appearance,
);
export const separatorThicknesses = optionsOf(
  separatorVariantMap.thickness,
);
export const separatorVariants = optionsOf(
  separatorVariantMap.variant,
);

export const skeletonShapes = optionsOf(
  skeletonVariantMap.shape,
);
export const skeletonAnimations = optionsOf(
  skeletonVariantMap.animation,
);

export const spinnerAppearances = optionsOf(
  spinnerVariantMap.appearance,
);
export const spinnerSizes = optionsOf(spinnerVariantMap.size);
export const spinnerVariants = optionsOf(
  spinnerVariantMap.variant,
);

export const switchSizes = optionsOf(switchVariantMap.size);
export const switchVariants = optionsOf(
  switchVariantMap.variant,
);

export const checkboxSizes = optionsOf(checkboxVariantMap.size);
export const checkboxVariants = optionsOf(
  checkboxVariantMap.variant,
);

export const radioSizes = optionsOf(radioVariantMap.size);
export const radioVariants = optionsOf(radioVariantMap.variant);
export const radioOrientations = optionsOf(
  radioGroupVariantMap.orientation,
);

export const textareaSizes = optionsOf(textareaVariantMap.size);
export const textareaVariants = optionsOf(
  textareaVariantMap.variant,
);
export const textareaAppearances = optionsOf(
  textareaVariantMap.appearance,
);
export const textareaResizes = optionsOf(
  textareaVariantMap.resize,
);

export const selectSizes = optionsOf(selectVariantMap.size);
export const selectVariants = optionsOf(
  selectVariantMap.variant,
);
export const selectAppearances = optionsOf(
  selectVariantMap.appearance,
);

export const comboboxSizes = optionsOf(
  comboboxVariantMap.size,
);
export const comboboxVariants = optionsOf(
  comboboxVariantMap.variant,
);
export const comboboxAppearances = optionsOf(
  comboboxVariantMap.appearance,
);

export const multiSelectSizes = optionsOf(
  multiSelectVariantMap.size,
);
export const multiSelectVariants = optionsOf(
  multiSelectVariantMap.variant,
);
export const multiSelectAppearances = optionsOf(
  multiSelectVariantMap.appearance,
);

export const popoverPaddings = optionsOf(
  popoverVariantMap.padding,
);

export const dialogSizes = optionsOf(
  dialogVariantMap.size,
);

export const tabsVariants = optionsOf(
  tabsVariantMap.variant,
);

export const tabsSizes = optionsOf(
  tabsVariantMap.size,
);

export const toggleVariants = optionsOf(
  toggleVariantMap.variant,
);

export const toggleSizes = optionsOf(
  toggleVariantMap.size,
);

export const segmentedControlSizes = optionsOf(
  segmentedControlVariantMap.size,
);

export const linkVariants = optionsOf(
  linkVariantMap.variant,
);

export const linkUnderlines = optionsOf(
  linkVariantMap.underline,
);

export const typographySizes = optionsOf(
  typographyVariantMap.size,
);

export const typographyWeights = optionsOf(
  typographyVariantMap.weight,
);

export const typographyTones = optionsOf(
  typographyVariantMap.tone,
);

export const codeSizes = optionsOf(
  codeVariantMap.size,
);

export const labelSizes = optionsOf(
  labelVariantMap.size,
);

export const sliderSizes = optionsOf(sliderVariantMap.size);
export const sliderVariants = optionsOf(
  sliderVariantMap.variant,
);

export const rangeSliderSizes = optionsOf(
  rangeSliderVariantMap.size,
);
export const rangeSliderVariants = optionsOf(
  rangeSliderVariantMap.variant,
);

export const progressSizes = optionsOf(progressVariantMap.size);
export const progressVariants = optionsOf(
  progressVariantMap.variant,
);

export const circularProgressSizes = optionsOf(
  circularProgressVariantMap.size,
);
export const circularProgressVariants = optionsOf(
  circularProgressVariantMap.variant,
);
