import {
  Button,
  Select,
  usePimoluTheme,
  type PimoluDensity,
  type PimoluRadius,
  type PimoluStylePreset,
} from "@pimolu/react";

import {
  densities,
  presets,
  radii,
  themeModes,
} from "./demo-data";
import { pageHref } from "./router";

export function Toolbar() {
  const {
    theme,
    stylePreset,
    radius,
    density,
    brandColor,
    setTheme,
    setStylePreset,
    setRadius,
    setDensity,
    setBrandColor,
  } = usePimoluTheme();

  return (
    <header className="pg-header">
      <div className="pg-container pg-header__inner">
        <a className="pg-brand" href={pageHref("overview")}>
          <span className="pg-brand__mark" aria-hidden="true">
            P
          </span>
          <span>
            <strong className="pg-brand__name">Pimolu UI</strong>
            <span className="pg-brand__tag">Playground</span>
          </span>
        </a>

        <div className="pg-toolbar">
          <div
            className="pg-row"
            role="group"
            aria-label="Color theme"
          >
            {themeModes.map((mode) => (
              <Button
                key={mode}
                size="sm"
                appearance={theme === mode ? "solid" : "outline"}
                aria-pressed={theme === mode}
                onClick={() => setTheme(mode)}
              >
                {mode}
              </Button>
            ))}
          </div>

          <Select
            size="sm"
            label="Style"
            value={stylePreset}
            onValueChange={(value) =>
              setStylePreset(value as PimoluStylePreset)
            }
            containerClassName="pg-toolbar__select pg-toolbar__select--style"
          >
            {presets.map((preset) => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </Select>

          <Select
            size="sm"
            label="Radius"
            value={radius ?? "preset"}
            onValueChange={(value) =>
              setRadius(
                value === "preset"
                  ? undefined
                  : (value as PimoluRadius)
              )
            }
            containerClassName="pg-toolbar__select pg-toolbar__select--radius"
          >
            <option value="preset">preset</option>

            {radii.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>

          <Select
            size="sm"
            label="Density"
            value={density ?? "default"}
            onValueChange={(value) =>
              setDensity(
                value === "default"
                  ? undefined
                  : (value as PimoluDensity)
              )
            }
            containerClassName="pg-toolbar__select pg-toolbar__select--density"
          >
            <option value="default">default</option>

            {densities.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>

          <label className="pg-brand-color">
            <span>Brand</span>
            <input
              type="color"
              value={brandColor ?? "#5B55E7"}
              onChange={(event) =>
                setBrandColor(event.target.value)
              }
            />

            {brandColor && (
              <button
                type="button"
                className="pg-brand-color__reset"
                onClick={() => setBrandColor(undefined)}
              >
                reset
              </button>
            )}
          </label>
        </div>
      </div>
    </header>
  );
}
