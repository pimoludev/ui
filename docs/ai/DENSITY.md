
# Density

Status: **contract written, implementation pending.** The per-component custom
properties already exist, so density can be a layer instead of a rewrite — but
the selectors that consume some of them still have to be read before writing a
single rule, otherwise half the controls silently keep their old metrics.

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
| Button | `--pimolu-button-height` | `height` — button.css:66 |
| Input | `--pimolu-input-height`, `--pimolu-input-padding` | `min-height`, `padding-inline` — input.css:58-60 |
| Select | `--pimolu-select-height`, `--pimolu-select-padding-x` | `height` — select.css:142 |
| Combobox | `--pimolu-combobox-height`, `--pimolu-combobox-padding-x` | `height` — combobox.css:146 |
| MultiSelect | `--pimolu-multiselect-height`, `--pimolu-multiselect-padding` | `min-height`, `padding` — multi-select.css:141-143 |
| Textarea | `--pimolu-textarea-padding-x`, `--pimolu-textarea-padding-y` | padding (height is content-driven) |

Gap found: the Button takes its horizontal padding from `--pimolu-spacing-*` in
the size classes, not from a dedicated variable. Add `--pimolu-button-padding-x`
to the size classes before density can act on it.

## Implementation order

1. Read the selectors that consume each variable above (`grep -n "var(--pimolu-<comp>"`).
2. Add `packages/themes/density.css`: the three factor blocks, then one override
   per control. Import it after `radius.css` so both dimensions compose.
3. Add the missing `--pimolu-button-padding-x` in `button.css`.
4. Provider: `density`, `defaultDensity`, `onDensityChange`, persistence and
   `data-pimolu-density`, mirroring the radius axis in `PimoluProvider`.
5. Playground toolbar: a Density select next to Radius.
6. Visual pass — mandatory: six presets × light/dark × three densities × the
   five sizes, plus a form and a toolbar composition, at narrow width.

## Acceptance criteria

- `pnpm verify` green and `pnpm audit:themes` at 0 error / 0 warning.
- No font-size, icon-size or radius change between densities.
- No clipped label and no overlapping chip at `compact`, on every size.
- The three densities compose with all six presets and with the radius axis.
