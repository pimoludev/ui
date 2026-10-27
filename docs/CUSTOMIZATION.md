# Customization contract

The layered entry and named-part hooks below are available in 0.1.0-beta.3.
The existing unlayered `styles.css` entry remains compatible.

## Cascade order

For application CSS, import the opt-in layered bundle once:

```css
@import "@pimolu/web-styles/layered.css";

.save-button:hover:enabled {
  background: var(--pimolu-success);
  color: var(--pimolu-success-foreground);
}
```

Unlayered application rules override normal rules in the `pimolu` layer without
specificity escalation. Class-name order in JSX does not determine CSS priority.
Import either `styles.css` or `layered.css`, not both.

With Tailwind v4, declare the complete layer order before importing either:

```css
@layer theme, base, pimolu, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "@pimolu/web-styles/layered.css";
@import "tailwindcss/utilities.css" layer(utilities);
```

Configure Tailwind's source scanning as usual. Preflight is intentionally omitted
from this recipe; if the application needs a reset, keep it in the earlier base
layer and verify its effect on native controls. For rules in another named
application layer, declare that layer after `pimolu` in the order statement.

## Named parts

`classNames` is an optional, typed map of additive classes. It never replaces
Pimolu's structural, variant or state classes. These keys are public styling
hooks; descendants, sibling order and other implementation classes are not a
promise about internal markup. All 129 families now expose this map on their
rendered components, including compound subcomponents. See the complete
[family and part reference](COMPONENT_CUSTOMIZATION.md); the table below shows
the initial examples. Headless controllers use their Content or child surface.

For compound components, the parent map reaches its family parts through layout
wrappers and portals. For example, `Card.classNames.title` styles CardTitle.
Local named parts override the inherited key, and a subcomponent's explicit root
addresses only that subcomponent. An independently nested Card starts a new
scope, so its title does not inherit the outer Card's title class. Other families
do not erase the parent's scope.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  type PimoluClassNames,
} from "@pimolu/react";

const profileParts = {
  root: "profile-card",
  title: "profile-card-title",
} satisfies PimoluClassNames<"card">;

export function Profile() {
  return (
    <Card classNames={profileParts}>
      <CardHeader>
        <CardTitle>Ada Lovelace</CardTitle>
      </CardHeader>
      <CardContent>Workspace administrator</CardContent>
    </Card>
  );
}
```

```css
.profile-card { border-radius: 24px; }
.profile-card-title { letter-spacing: -0.02em; }
```

Use the layered import above for predictable application rule precedence. The
same class map also accepts Tailwind utilities when that layer order is declared.

| Component | Stable keys |
| --- | --- |
| Button | root, label, startIcon, endIcon, spinner |
| Input | root, label, wrapper, control, startIcon, endIcon, clearButton, visibilityButton, message |
| Select | root, label, field, control, value, chevron, listbox, option, group, check, message (full list in the family reference) |
| Combobox | root, label, field, control, clearButton, chevron, listbox, option, optionLabel, check, empty, message |
| MultiSelect | root, label, field, control, valueArea, selection, tag, tagLabel, tagRemove, clearButton, chevron, listbox, option, optionLabel, optionIndicator, empty, message |
| DialogContent / DrawerContent | root, content, overlay, closeButton |

Each repeated part receives the same class. Use semantic state selectors such as
`[aria-selected="true"]`, `[aria-disabled="true"]`, `[data-active="true"]`,
`:disabled` and `:focus-visible` for its states. A hook is rendered only when its
part exists; for example, Button's spinner replaces its start icon while loading.
Native Select popup rendering belongs to the browser; listbox/option/group/check
hooks describe Pimolu's styled path, not the platform popup.

```tsx
<Select
  label="Workspace"
  classNames={{ listbox: "workspace-menu", option: "workspace-option" }}
>
  <option value="studio">Design studio</option>
  <option value="engineering">Engineering</option>
</Select>
```

```css
.workspace-menu {
  border-radius: 16px;
  --pimolu-primary: #126b43;
  --pimolu-primary-foreground: #ffffff;
}

.workspace-option { padding-block: 12px; }
.workspace-option[aria-selected="true"] { font-weight: 600; }
```

The classes go directly on the portalled panel/options. No ancestor selector or
extra Provider is required. An ordinary wrapper's variables still do not cross
the portal boundary automatically: place local variables on the panel's class,
use DialogContent/DrawerContent `style`, or use a nested Provider for a theme scope.
Keep positioning, overflow and focus semantics intact when overriding parts.

## Existing targets remain unchanged

| Component | className | style | Other existing target |
| --- | --- | --- | --- |
| Button | native button | native button | — |
| Input | native input | native input | containerClassName: field root |
| Select | styled button or native select | same control | containerClassName: field root |
| Combobox / MultiSelect | field root | field root | inputClassName: input |
| DialogContent / DrawerContent | panel | panel (new optional prop) | root key: portalled modal wrapper |
| Slider | native range control | native range control | containerClassName / containerStyle: field root |

Both legacy and map classes are appended when supplied together. Their order
does not make one style override the other: use the cascade and layer order.

## Supported variables

Use Provider settings for preset, mode, brand, density and radius. The semantic
theme variables are public (`--pimolu-primary`, `--pimolu-primary-hover`,
`--pimolu-primary-foreground`, `--pimolu-background`, `--pimolu-foreground`,
`--pimolu-surface`, `--pimolu-surface-foreground`, `--pimolu-muted`,
`--pimolu-border`, `--pimolu-focus-ring` and semantic status colors). Primitive
spacing/radius/type tokens are available for application compositions.

For component-specific refinements, Button supports `--pimolu-button-font-weight`
and `--pimolu-button-letter-spacing`; Slider supports `--pimolu-slider-track-height`
and `--pimolu-slider-thumb-size` through its control style. Internal geometry,
progress, positioning and intermediate tone variables are implementation details
unless explicitly documented. A `--pimolu-` prefix alone is not a stability promise.

Typed reusable maps can be declared with `PimoluClassNames<"card">` from
`@pimolu/react`. Unknown family names and part keys are rejected by TypeScript.
For a complete API, check the component's generated classNames row, which lists
its supported keys. CSS class order still does not change cascade priority.

`Toaster` supports both global card parts and per-notification overrides through
`toast({ classNames })`. `VirtualList<T>` preserves its generic item type while
exposing its viewport, spacer and item hooks.

Custom colors and overrides remain the application's responsibility: retain
contrast, disabled states, keyboard focus and reduced-motion behavior. The
browser customization regression suite checks these integration recipes; it
does not certify every arbitrary user stylesheet.
