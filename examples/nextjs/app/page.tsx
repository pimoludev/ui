"use client";

import type { ReactNode } from "react";

import {
  Button,
  buttonVariantMap,
  usePimoluTheme,
  type PimoluStylePreset,
  type PimoluTheme,
  type PimoluThemeMode,
} from "@pimolu/react";

import { pimoluPresets } from "@pimolu/themes/presets";

const presets: PimoluStylePreset[] = [
  "default",
  ...(Object.keys(pimoluPresets) as PimoluStylePreset[]),
];

const themes: PimoluTheme[] = ["light", "dark"];

const themeModes: PimoluThemeMode[] = ["light", "dark", "system"];

/* Derived from the component's own variant map, never duplicated here. */
function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const buttonVariants = optionsOf(buttonVariantMap.variant);
const buttonAppearances = optionsOf(buttonVariantMap.appearance);

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="pg-section">
      <h2 className="pg-section__title">{title}</h2>
      {hint ? <p className="pg-section__hint">{hint}</p> : null}
      {children}
    </section>
  );
}

export default function Home() {
  const {
    theme,
    resolvedTheme,
    stylePreset,
    setTheme,
    setStylePreset,
  } = usePimoluTheme();

  return (
    <>
      <header className="pg-header">
        <div className="pg-container pg-header__inner">
          <div className="pg-brand">
            <span className="pg-brand__mark" aria-hidden="true">
              P
            </span>
            <span>
              <strong className="pg-brand__name">Pimolu UI</strong>
              <span className="pg-brand__tag">
                Next.js example
              </span>
            </span>
          </div>

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
                  appearance={
                    theme === mode ? "solid" : "outline"
                  }
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

      <main className="pg-main">
        <div className="pg-container">
          <div className="pg-hero">
            <h1 className="pg-hero__title">Pimolu UI</h1>
            <p className="pg-hero__lead">
              The same design system, integrated into a Next.js
              App Router application. The theme and style are read
              on the server from cookies, so the first paint already
              matches the visitor&apos;s preference.
            </p>
            <div className="pg-chips">
              <span className="pg-chip">
                theme {theme} → {resolvedTheme}
              </span>
              <span className="pg-chip">style {stylePreset}</span>
              <span className="pg-chip">server-read cookies</span>
              <span className="pg-chip">React Server + Client</span>
            </div>
          </div>

          <Section
            title="Variants"
            hint="Semantic tones provided by the Button component."
          >
            <div className="pg-row">
              {buttonVariants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </div>
          </Section>

          <Section
            title="Appearances"
            hint="The same tone, expressed differently."
          >
            <div className="pg-row">
              {buttonAppearances.map((appearance) => (
                <Button key={appearance} appearance={appearance}>
                  {appearance}
                </Button>
              ))}
            </div>
          </Section>

          <Section
            title="States"
            hint="Loading, disabled and icon-only content."
          >
            <div className="pg-row">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button startIcon={<span>＋</span>}>
                Add item
              </Button>
              <Button
                iconOnly
                aria-label="Add"
                startIcon={<span>＋</span>}
              />
            </div>
          </Section>

          <Section
            title="Style presets"
            hint="Every preset discovered from the theme package, side by side."
          >
            <div className="pg-grid">
              {presets.map((preset) => (
                <div
                  key={preset}
                  className="pg-panel"
                  data-pimolu-style={preset}
                  data-pimolu-theme={resolvedTheme}
                >
                  <div className="pg-panel__head">
                    <span className="pg-panel__name">
                      {preset}
                    </span>
                    <span className="pg-panel__tag">
                      {resolvedTheme}
                    </span>
                  </div>

                  <div className="pg-row">
                    <Button size="sm">Continue</Button>
                    <Button size="sm" appearance="outline">
                      Cancel
                    </Button>
                    <Button size="sm" variant="danger">
                      Delete
                    </Button>
                  </div>

                  <div className="pg-surface-demo">
                    Surface, muted and border tokens at work.
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Color themes"
            hint="Light and dark resolved next to each other."
          >
            <div className="pg-grid">
              {themes.map((value) => (
                <div
                  key={value}
                  className="pg-panel"
                  data-pimolu-theme={value}
                  data-pimolu-style={stylePreset}
                >
                  <div className="pg-panel__head">
                    <span className="pg-panel__name">{value}</span>
                    <span className="pg-panel__tag">
                      {stylePreset}
                    </span>
                  </div>

                  <p>
                    Foreground on background.{" "}
                    <span className="pg-muted">
                      Muted text stays readable.
                    </span>
                  </p>

                  <div className="pg-row">
                    <Button>Primary</Button>
                    <Button appearance="soft">Soft</Button>
                    <Button appearance="outline">
                      Outline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </main>

      <footer className="pg-footer">
        <div className="pg-container">
          Pimolu UI · Next.js App Router example · MIT License
        </div>
      </footer>
    </>
  );
}
