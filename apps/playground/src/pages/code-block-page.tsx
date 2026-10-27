import { CustomizationExample } from "./code-block-customization-demo";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CodeBlock,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const welcomeSnippet = `import { Button } from "@pimolu/react";

export function Welcome() {
  return (
    <Button appearance="solid">
      Start building
    </Button>
  );
}`;

const styleSnippet = `.pimolu-codeblock {
  border: 1px solid var(--pimolu-border);
  border-radius: var(--pimolu-radius-lg);
}`;

const tokenSnippet = `{
  "primary": "#4F46E5",
  "radius": 10,
  "dark": true
}`;

const commandSnippet = `$ pnpm install
$ pnpm build:all
$ pnpm "playground dev"`;

const htmlSnippet = `<section class="hero">
  <h1>Design once.</h1>
  <p>Ship everywhere.</p>
</section>`;

const textSnippet = `Pimolu UI renders source text exactly as written.
No markup is interpreted and no highlighting dependency is loaded.`;

const longSnippet = `.pimolu-codeblock__example {
  background: linear-gradient(120deg, var(--pimolu-primary), var(--pimolu-accent, #8B5CF6));
  border: 1px solid var(--pimolu-border);
  border-radius: var(--pimolu-radius-lg);
}`;

const languageSamples = [
  {
    language: "tsx",
    filename: "welcome.tsx",
    code: welcomeSnippet,
  },
  {
    language: "css",
    filename: "code-block.css",
    code: styleSnippet,
  },
  {
    language: "json",
    filename: "tokens.json",
    code: tokenSnippet,
  },
  {
    language: "bash",
    filename: "terminal",
    code: commandSnippet,
  },
  {
    language: "html",
    filename: "hero.html",
    code: htmlSnippet,
  },
  {
    language: "text",
    filename: "readme.txt",
    code: textSnippet,
  },
] as const;

export function CodeBlockPage() {
  return (
    <>
      <PageHeader
        title="CodeBlock"
        hint="A documentation code sample with language and file labels, optional line numbers, line highlights, wrapped or capped scrolling, and a keyboard-accessible copy action. The tokenizer is a small regex scanner; there is no syntax-highlighting dependency and no HTML injection."
      />

      <Section
        title="Documentation sample"
        hint="File name, language label, line numbers, highlighted lines and copy feedback."
      >
        <CodeBlock
          code={welcomeSnippet}
          language="tsx"
          filename="welcome.tsx"
          showLineNumbers
          highlightLines={[3, 4, 5]}
        />
      </Section>

      <Section
        title="Languages"
        hint="Every supported language shares the same surface; only the token rules differ."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          {languageSamples.map((sample) => (
            <CodeBlock
              key={sample.language}
              code={sample.code}
              language={sample.language}
              filename={sample.filename}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Long lines, height and wrapping"
        hint="Without wrap, the code area scrolls horizontally. maxHeight caps the vertical scroll; wrap breaks long lines instead."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <CodeBlock
            code={longSnippet}
            language="css"
            filename="scrolling.css"
            maxHeight={180}
          />

          <CodeBlock
            code={longSnippet}
            language="css"
            filename="wrapped.css"
            maxHeight={180}
            wrap
          />
        </div>
      </Section>

      <Section
        title="Copy behavior"
        hint="Copy uses the Clipboard API with a legacy fallback; success and failure are announced through an aria-live status."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Custom labels</CardTitle>
              <CardDescription>
                The visible action and the live announcement can use
                documentation-specific wording.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <CodeBlock
                code={commandSnippet}
                language="bash"
                filename="Install"
                copyLabel="Copy installation commands"
                copiedLabel="Installation commands copied"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reading only</CardTitle>
              <CardDescription>
                Turn the action off when the snippet is part of a
                printed reference.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <CodeBlock
                code={tokenSnippet}
                language="json"
                filename="tokens.json"
                copyable={false}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Example: release note"
        hint="A compact surface for a changelog or migration note."
      >
        <Card>
          <CardHeader>
            <div className="pg-row pg-row--between">
              <div>
                <CardTitle>Migration notes</CardTitle>
                <CardDescription>
                  How a documentation page can frame a code sample.
                </CardDescription>
              </div>

              <Badge variant="primary" appearance="soft">
                v1.4
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <CodeBlock
              code={`// Before
theme="light"

// After
theme={{ mode: "light" }}`}
              language="ts"
              filename="migration.ts"
              showLineNumbers
              highlightLines={[4]}
            />
          </CardContent>
        </Card>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
