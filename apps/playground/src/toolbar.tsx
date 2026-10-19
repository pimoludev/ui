import {
  Button,
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
    setTheme,
    setStylePreset,
    setRadius,
    setDensity,
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

          <label className="pg-select">
            <span>Style</span>
            <select
              value={stylePreset}
              onChange={(event) =>
                setStylePreset(
                  event.target.value as PimoluStylePreset
                )
              }
            >
              {presets.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </label>

          <label className="pg-select">
            <span>Radius</span>
            <select
              value={radius ?? "preset"}
              onChange={(event) =>
                setRadius(
                  event.target.value === "preset"
                    ? undefined
                    : (event.target.value as PimoluRadius)
                )
              }
            >
              <option value="preset">preset</option>

              {radii.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="pg-select">
            <span>Density</span>
            <select
              value={density ?? "default"}
              onChange={(event) =>
                setDensity(
                  event.target.value === "default"
                    ? undefined
                    : (event.target.value as PimoluDensity)
                )
              }
            >
              <option value="default">default</option>

              {densities.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}
