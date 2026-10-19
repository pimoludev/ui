import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Code,
  Kbd,
  Paragraph,
  Text,
} from "@pimolu/react";

import { codeSizes } from "../demo-data";
import { PageHeader, Section } from "../section";

const snippet = `import { PimoluProvider } from "@pimolu/react";

export function Root() {
  return (
    <PimoluProvider defaultTheme="system">
      <App />
    </PimoluProvider>
  );
}`;

export function CodePage() {
  return (
    <>
      <PageHeader
        title="Code & Kbd"
        hint="Inline code, preformatted blocks and keyboard keys. Both use the monospace stack, the shared border and surface tokens, and a relative size axis. Styles come from @pimolu/web-styles/code.css."
      />

      <Section
        title="Inline"
        hint="Code sits inside a paragraph without breaking its rhythm."
      >
        <Paragraph>
          Install the workspace with <Code>pnpm install</Code>,
          run <Code>pnpm build:all</Code> once, then start the
          playground with <Code>pnpm "playground dev"</Code>.
        </Paragraph>
      </Section>

      <Section
        title="Block"
        hint="block wraps the code in a preformatted surface with horizontal scrolling."
      >
        <Code block>{snippet}</Code>
      </Section>

      <Section
        title="Keyboard"
        hint="Kbd names a physical key; combine several keys in a row."
      >
        <div className="pg-stack">
          <div className="pg-row">
            <span className="pg-meta">search</span>

            <span className="pg-row">
              <Kbd>Cmd</Kbd>
              <Kbd>K</Kbd>
            </span>
          </div>

          <div className="pg-row">
            <span className="pg-meta">save</span>

            <span className="pg-row">
              <Kbd>Ctrl</Kbd>
              <Kbd>S</Kbd>
            </span>
          </div>

          <div className="pg-row">
            <span className="pg-meta">close</span>

            <Kbd>Esc</Kbd>
          </div>
        </div>
      </Section>

      <Section
        title="Sizes"
        hint="Enumerated from codeVariantMap: sm, md and lg are relative to the surrounding text."
      >
        <div className="pg-stack">
          {codeSizes.map((size) => (
            <div key={size} className="pg-row">
              <span className="pg-meta">{size}</span>

              <Code size={size}>const value = 42;</Code>

              <Kbd size={size}>Enter</Kbd>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Shortcuts</CardTitle>
              <CardDescription>
                A compact keyboard reference.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                {[
                  ["Command palette", ["Cmd", "K"]],
                  ["Search", ["/"]],
                  ["Save", ["Ctrl", "S"]],
                  ["Close", ["Esc"]],
                ].map(([label, keys]) => (
                  <div
                    key={label as string}
                    className="pg-row pg-row--between"
                  >
                    <Text size="sm">
                      {label as string}
                    </Text>

                    <span className="pg-row">
                      {(keys as string[]).map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terminal</CardTitle>
              <CardDescription>
                A block is the right surface for a command.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Code block>
                {`$ pnpm install
$ pnpm build:all
$ pnpm "playground dev"`}
              </Code>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
