import {
  Button,
  usePimoluTheme,
  type PimoluStylePreset,
} from "@pimolu/react";

import { presets, themeModes } from "./demo-data";
import { pageHref } from "./router";

export function Toolbar() {
  const {
    theme,
    stylePreset,
    setTheme,
    setStylePreset,
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
        </div>
      </div>
    </header>
  );
}
