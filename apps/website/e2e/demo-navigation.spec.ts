import { test, expect } from "@playwright/test";

test("navbar examples stay in their iframe and preserve local interactions", async ({ page }) => {
  await page.goto("/components/navbar");
  const frame = page.frameLocator('iframe[src*="example=example-2"]');
  await frame.locator('[data-example-hydrated="true"]').waitFor();
  const original = await frame.locator('body').evaluate(() => location.href);
  for (const name of ["surface navigation", "transparent navigation", "floating navigation"]) {
    const item = frame.getByRole("navigation", { name, exact: true }).getByRole("link", { name: "Components", exact: true });
    await item.click();
    expect(await frame.locator('body').evaluate(() => location.href)).toBe(original);
  }
  await expect(page).toHaveURL(/\/components\/navbar$/);
  await expect(frame.locator(".site-header")).toBeHidden();
  await page.goto("/preview/navbar?example=example-3");
  await page.locator('[data-example-hydrated="true"]').waitFor();
  await page.getByRole("link", { name: "Components", exact: true }).click();
  await expect(page).toHaveURL(/\/preview\/navbar\?example=example-3$/);
  await page.goto("/preview/navbar");
  await page.locator('[data-example-hydrated="true"]').waitFor();
  await page.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Current view: Projects.");
});

test("links, external targets and portalled navigation cannot leave the example", async ({ page, context }) => {
  for (const path of ["/preview/link", "/preview/link?example=example-4", "/preview/breadcrumbs?example=example-2", "/preview/footer", "/preview/sidebar"]) {
    await page.goto(path);
    await page.locator('[data-example-hydrated="true"]').waitFor();
    const original = page.url();
    const links = page.locator('.example-ready a[href]').filter({ visible: true });
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      if (await links.nth(i).getAttribute('aria-disabled') === 'true') continue;
      await links.nth(i).click();
      expect(page.url()).toBe(original);
    }
    expect(context.pages()).toHaveLength(1);
  }
  await page.goto('/preview/drawer?example=example-2');
  await page.locator('[data-example-hydrated="true"]').waitFor();
  await page.getByRole('button', { name:'Open navigation', exact:true }).click();
  await page.getByRole('navigation', { name:'Drawer navigation' }).getByRole('link', { name:'Introduction' }).click();
  await expect(page).toHaveURL(/\/preview\/drawer\?example=example-2$/);
  await page.getByRole('button', { name:'Close navigation', exact:true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test("local fragments and real downloads remain functional", async ({ page }) => {
  await page.goto('/preview/table-of-contents?example=example-2');
  await page.locator('[data-example-hydrated="true"]').waitFor();
  await page.getByRole('link', { name:'Provider', exact:true }).click();
  await expect(page).toHaveURL(/#outline-provider$/);
  await page.goto('/preview/anchor');
  await page.locator('[data-example-hydrated="true"]').waitFor();
  await page.locator('.example-ready a[href^="#"]').click();
  await expect(page).toHaveURL(/#preview-linked-section$/);
  // Exercise the common boundary with the same blob download mechanism used by media demos.
  await page.locator('.example-ready').evaluate((node) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['Pimolu'], { type:'text/plain' }));
    link.download = 'pimolu.txt'; link.textContent = 'Download sample'; node.append(link);
  });
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name:'Download sample' }).click();
  expect((await download).suggestedFilename()).toBe('pimolu.txt');
});

test("header stays visible and anchor headings clear it on desktop and mobile", async ({ page }) => {
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height:844 });
    await page.goto('/docs/colors');
    await page.evaluate(() => scrollTo(0, 700));
    await expect.poll(() => page.locator('.site-header').evaluate((node) => Math.round(node.getBoundingClientRect().top))).toBe(0);
    await expect(page.getByRole('button', { name:'Customize site theme', exact:true }).filter({ visible:true })).toBeInViewport();
    await page.getByRole('button', { name:'Customize site theme', exact:true }).filter({ visible:true }).click();
    const panel = page.getByRole('dialog', { name:'Site appearance', exact:true });
    await expect(panel.locator('.site-preset-swatch')).toHaveCount(7);
    expect(await panel.evaluate((node) => node.getBoundingClientRect().height)).toBeLessThan(450);
    await expect(panel.locator('.site-preset-choice').last()).toBeInViewport({ ratio:1 });
    await page.keyboard.press('Escape');
    const section = page.locator('.docs-section').last();
    await section.evaluate((node) => node.scrollIntoView());
    expect(await section.evaluate((node) => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(90);
  }
});
