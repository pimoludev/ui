
# Density

Status: **implemented for the controls listed below**, in
`packages/themes/density.css`, the Provider and the Playground toolbar.
This is a scoped implementation, not a claim that every component or every
internal part scales. Check the actual selectors before extending its coverage.

## Contract

`data-pimolu-density="compact" | "comfortable" | "spacious"` on any container.

| Value | Factor | Intended use |
| --- | --- | --- |
| `compact` | `0.875` | data-dense tools, tables, admin |
| `comfortable` | `1` | default |
| `spacious` | `1.125` | marketing, touch-first |

Rules:

- **Box metrics only**: `height`, `min-height`, inline padding, internal gaps.
- **Never** font size, icon size, radius or colour: density must not change the
  type scale, otherwise compact becomes unreadable instead of dense.
- Undefined means "the preset's own metrics": no attribute is written unless a
  density is chosen, so existing screens do not move.
- The factor multiplies the size token, it does not replace it:
  `calc(var(--pimolu-select-height) * var(--pimolu-density-factor))`.

## Variable map (verified in the source)

| Component | Variable | Property today |
| --- | --- | --- |
| Button, excluding icon-only | `--pimolu-button-height`, `--pimolu-button-padding-x` | `min-height`, `padding-inline` on `.pimolu-button` |
| Input | `--pimolu-input-height`, `--pimolu-input-padding` | `min-height`, `padding-inline` on the `.pimolu-input` root |
| Select | `--pimolu-select-height` | `height` on `.pimolu-select__control` |
| Combobox | `--pimolu-combobox-height` | `height` on `.pimolu-combobox__input` |
| MultiSelect | `--pimolu-multiselect-height`, `--pimolu-multiselect-padding` | `min-height`, `padding` on `.pimolu-multiselect__value-area` |
| Textarea | `--pimolu-textarea-padding-x`, `--pimolu-textarea-padding-y` | padding (height is content-driven) |

Button size classes already expose `--pimolu-button-padding-x`. Select and
Combobox intentionally scale height only: inline padding reserves chevron space.
Input's rule currently targets its root, while the visible control wrapper owns
its own metrics. Do not infer that every internal field dimension scales from
the presence of a density attribute; verify the intended part in a browser.

## Integration points

1. `packages/themes/style-presets.css` imports density after radius so both axes compose.
2. `PimoluProvider` exposes `density`, `defaultDensity`, `onDensityChange`,
   persistence and `data-pimolu-density`; `usePimoluTheme` exposes the setter.
3. The Playground toolbar exposes the Density select next to Radius.
4. Before changing a selector, read the control's CSS and verify which element
   owns the height, padding and reserved icon space.
5. For extensions, review all seven presets × light/dark × three densities,
   supported sizes, a form and a toolbar at narrow and wide widths.

## Acceptance criteria

- `pnpm verify` green and `pnpm audit:themes` at 0 error / 0 warning.
- No font-size, icon-size or radius change between densities.
- No clipped label and no overlapping chip at `compact`, on every size.
- The three densities compose with all seven presets and with the radius axis.
