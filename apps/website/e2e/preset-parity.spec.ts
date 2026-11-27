import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { presetNames } from "../lib/preferences";

const catalog = JSON.parse(readFileSync(new URL("../content/generated/catalog.json", import.meta.url), "utf8")) as Array<{ family: string }>;

// Every reference is mounted in every preset and colour mode, at desktop and
// mobile widths. Chromium owns the matrix; targeted suites already cover the
// other engines. Each width gets its own fixed viewport so a check never pays
// for a costly re-layout.
const VIEWPORTS = [1440, 390] as const;
const PAGES_PER_WIDTH = 2;

// Hundreds of navigations per test: tracing would dominate the run time.
test.use({ trace: "off", screenshot: "only-on-failure" });

// The matrix navigates every reference at both widths in every preset and mode.
// With 143 references it needs more than the default five-minute budget.
test.describe.configure({ timeout: 600_000 });

for (const preset of presetNames) {
  for (const theme of ["light", "dark"] as const) {
    test(`${preset}/${theme}: every component reference fits both widths`, async ({ browser, browserName }) => {
      test.skip(browserName !== "chromium", "The parity matrix runs once, in Chromium.");
      const failures: string[] = [];
      const pageErrors: string[] = [];

      for (const width of VIEWPORTS) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          reducedMotion: "reduce",
        });
        const pages = await Promise.all(Array.from({ length: PAGES_PER_WIDTH }, () => context.newPage()));
        for (const page of pages) page.on("pageerror", (error) => pageErrors.push(error.message));
        let cursor = 0;

        const consume = async (page: (typeof pages)[number]) => {
          while (cursor < catalog.length) {
            const entry = catalog[cursor++];
            await page.goto(`/components/${entry.family}?preset=${preset}&theme=${theme}`, { waitUntil: "domcontentloaded" });
            await page.locator(".docs-preview").first().waitFor({ state: "attached" });
            const overflow = await page.evaluate(() => ({
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth,
            }));
            if (overflow.scrollWidth > overflow.innerWidth + 1) {
              failures.push(`${entry.family} @ ${width}px: ${overflow.scrollWidth}px content in ${overflow.innerWidth}px viewport`);
            }
          }
        };

        try {
          await Promise.all(pages.map(consume));
        } finally {
          await context.close();
        }
      }

      expect(pageErrors, "Unhandled page errors").toEqual([]);
      expect(failures, `Horizontal overflow in ${preset}/${theme}`).toEqual([]);
    });
  }
}
