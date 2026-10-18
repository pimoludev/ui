import type { ReactNode } from "react";

import {
  Button,
  PimoluProvider,
  buttonVariantMap,
  usePimoluTheme,
  type PimoluTheme,
  type PimoluThemeMode,
  type PimoluStylePreset,
} from "@pimolu/react";

import "@pimolu/themes/styles.css";
import "@pimolu/themes/presets.css";
import { pimoluPresets } from "@pimolu/themes/presets";

import "./playground.css";

/* Discovered from the theme package, so a new preset can never be forgotten. */
const presets: PimoluStylePreset[] = [
  "default",
  ...(Object.keys(pimoluPresets) as PimoluStylePreset[]),
];

/* Color themes are not exposed as runtime data yet, so this stays explicit. */
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
const buttonSizes = optionsOf(buttonVariantMap.size);
const buttonRadii = optionsOf(buttonVariantMap.radius);

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

function Toolbar() {
  const {
    theme,
    stylePreset,
    setTheme,
    setStylePreset,
  } = usePimoluTheme();

  return (
    <header className="pg-header">
      <div className="pg-container pg-header__inner">
        <div className="pg-brand">
          <span className="pg-brand__mark" aria-hidden="true">
            P
          </span>
          <span>
            <strong className="pg-brand__name">Pimolu UI</strong>
            <span className="pg-brand__tag">Playground</span>
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

function Gallery() {
  const { resolvedTheme } = usePimoluTheme();

  return (
    <Section
      title="Style presets"
      hint="The same components, re-styled by each preset under the active color theme."
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
              <span className="pg-panel__name">{preset}</span>
              <span className="pg-panel__tag">{resolvedTheme}</span>
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
  );
}

function ThemePreview() {
  const { stylePreset } = usePimoluTheme();

  return (
    <Section
      title="Color themes"
      hint="Light and dark resolved side by side, using the selected preset."
    >
      <div className="pg-grid">
        {themes.map((theme) => (
          <div
            key={theme}
            className="pg-panel"
            data-pimolu-theme={theme}
            data-pimolu-style={stylePreset}
          >
            <div className="pg-panel__head">
              <span className="pg-panel__name">{theme}</span>
              <span className="pg-panel__tag">{stylePreset}</span>
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
              <Button appearance="outline">Outline</Button>
              <Button appearance="ghost">Ghost</Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Showcase() {
  const { theme, resolvedTheme, stylePreset } = usePimoluTheme();

  return (
    <main className="pg-main">
      <div className="pg-container">
        <div className="pg-hero">
          <h1 className="pg-hero__title">Pimolu UI</h1>
          <p className="pg-hero__lead">
            A design system for consistent interfaces. Tokens define
            the values, themes give them meaning, presets shape the
            character, and every component reacts to them through
            plain CSS.
          </p>
          <div className="pg-chips">
            <span className="pg-chip">
              theme {theme} → {resolvedTheme}
            </span>
            <span className="pg-chip">style {stylePreset}</span>
            <span className="pg-chip">{presets.length} presets</span>
            <span className="pg-chip">{themes.length} color themes</span>
            <span className="pg-chip">MIT licensed</span>
          </div>
        </div>

        <Section
          title="Variants"
          hint="Semantic meaning carried by each button tone."
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
          hint="The same variant, from solid to fully transparent."
        >
          <div className="pg-row">
            {buttonAppearances.map((appearance) => (
              <Button key={appearance} appearance={appearance}>
                {appearance}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="Sizes" hint="From xs to xxl.">
          <div className="pg-row">
            {buttonSizes.map((size) => (
              <Button key={size} size={size}>
                {size}
              </Button>
            ))}
          </div>
        </Section>

        <Section
          title="Shapes"
          hint="Radius variants, from square to fully rounded."
        >
          <div className="pg-row">
            {buttonRadii.map((radius) => (
              <Button key={radius} radius={radius}>
                {radius}
              </Button>
            ))}
          </div>
        </Section>

        <Section
          title="States and content"
          hint="Loading, disabled, icons and icon-only buttons."
        >
          <div className="pg-row">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button startIcon={<span>＋</span>}>Add item</Button>
            <Button endIcon={<span>→</span>}>Continue</Button>
            <Button
              iconOnly
              aria-label="Add"
              startIcon={<span>＋</span>}
            />
          </div>
        </Section>

        <Gallery />
        <ThemePreview />
      </div>

      <footer className="pg-footer">
        <div className="pg-container">
          Pimolu UI · MIT License · Workspace playground. Adjust the
          theme and style in the toolbar; changes apply instantly.
        </div>
      </footer>
    </main>
  );
}

function App() {
  return (
    <PimoluProvider persist className="pg-root">
      <Toolbar />
      <Showcase />
    </PimoluProvider>
  );
}

export default App;
