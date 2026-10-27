"use client";

import { Prose } from "@pimolu/react";

const gradientImage = "/images/pimolu-atmosphere.webp";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="min-w-0 rounded-lg border border-border p-6">
            <Prose
              as="article"
              aria-label="Design system article"
              classNames={{
                root: "custom-prose-root"
              }}
            >
              <h2>Why a shared design system wins</h2>
              <p>
                A design system is a contract. It fixes the
                vocabulary before teams write screens, so a
                button means the same thing on the web, in the
                playground and in the native application. The
                contract is made of{" "}
                <strong>tokens</strong>,{" "}
                <em>components</em> and documented behaviour.
              </p>
              <p>
                Read the <a href="#/overview">token pipeline</a>{" "}
                first, then the component rules. The{" "}
                <code>data-pimolu-theme</code> and{" "}
                <code>data-pimolu-style</code> attributes are
                the only switches a consumer needs.
              </p>
              <h2>What the wrapper covers</h2>
              <ul>
                <li>Headings from h1 to h6</li>
                <li>
                  Paragraphs, strong, emphasis and{" "}
                  <a href="#/overview">links</a>
                </li>
                <li>Ordered lists, unordered lists and nested lists</li>
                <li>Blockquotes, inline code and labelled code blocks</li>
                <li>Tables with captions, dividers, images and figure captions</li>
              </ul>
              <h2>Release checklist</h2>
              <ol>
                <li>
                  Run <code>pnpm build:all</code> so the preset
                  assets exist.
                </li>
                <li>Run the React tests and the web-style tests.</li>
                <li>Check the page in light and dark, in all six presets.</li>
              </ol>
              <blockquote>
                <p>
                  Automated tests secure behaviour, not visual quality. Open the
                  page and look at it.
                </p>
              </blockquote>
              <h2>Install</h2>
              <pre>
                <code>{
                  (
                    "pnpm add @pimolu/react\npnpm add -D @pimolu/web-styles\n\n# then, " +
                    "at the root of the app\nimport \"@pimolu/web-styles/styles.css\";"
                  )
                }</code>
              </pre>
              <p>
                Press <kbd>Ctrl</kbd> + <kbd>K</kbd> in the
                playground to jump between component pages.
              </p>
              <h2>Token summary</h2>
              <table>
                <caption>The semantic tokens every article inherits.</caption>
                <thead>
                  <tr>
                    <th scope="col">Token</th>
                    <th scope="col">Light</th>
                    <th scope="col">Dark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">foreground</th>
                    <td>slate.950</td>
                    <td>slate.50</td>
                  </tr>
                  <tr>
                    <th scope="row">surface</th>
                    <td>slate.50</td>
                    <td>slate.900</td>
                  </tr>
                  <tr>
                    <th scope="row">primary</th>
                    <td>indigo.600</td>
                    <td>indigo.400</td>
                  </tr>
                </tbody>
              </table>
              <hr />
              <figure>
                {/* Native content intentionally exercises Prose's rich-text image rules. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gradientImage}
                  alt="An original Pimolu emblem study in a lavender architectural studio."
                />
                <figcaption>
                  Images stay fluid and inherit the same radius as the surrounding
                  surfaces.
                </figcaption>
              </figure>
              <h3>Inline details</h3>
              <p>
                Nested lists keep their markers. A link inside a
                paragraph is underlined, and{" "}
                <code>inline code</code> stays monospaced
                without breaking the line height.
              </p>
              <ul>
                <li>
                  Tokens
                  <ul>
                    <li>Primitive colours and spacing</li>
                    <li>Semantic aliases</li>
                  </ul>
                </li>
                <li>
                  Components
                  <ul>
                    <li>Web styles</li>
                    <li>React source</li>
                  </ul>
                </li>
              </ul>
              <p>
                <small>
                  Last reviewed on 21 October 2026 by the documentation group.
                </small>
              </p>
            </Prose>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-prose-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
