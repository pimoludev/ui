import { Button, usePimoluTheme } from "@pimolu/react";

import { presets, themes } from "../demo-data";
import { groupPages, pageHref } from "../router";
import { Section } from "../section";

/* Derived from the router, so the index can never fall behind. */

function ComponentIndex() {
  const groups = groupPages().filter(
    (group) => group.name !== "Getting started",
  );

  return (
    <Section
      title="Components"
      hint="Every family has its own page, with its variants, its states and real-world examples."
    >
      <div className="pg-grid">
        {groups.map((group) => (
          <div key={group.name} className="pg-panel">
            <div className="pg-panel__head">
              <span className="pg-panel__name">
                {group.name}
              </span>

              <span className="pg-panel__tag">
                {group.items.length}
              </span>
            </div>

            <div className="pg-index">
              {group.items.map((page) => (
                <a
                  key={page.id}
                  className="pg-index__link"
                  href={pageHref(page.id)}
                >
                  {page.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
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

export function OverviewPage() {
  const { theme, resolvedTheme, stylePreset } =
    usePimoluTheme();

  return (
    <>
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
          <span className="pg-chip">
            {themes.length} color themes
          </span>
          <span className="pg-chip">MIT licensed</span>
        </div>
      </div>

      <ComponentIndex />
      <Gallery />
      <ThemePreview />
    </>
  );
}
