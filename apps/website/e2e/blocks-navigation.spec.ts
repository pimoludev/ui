import { test, expect } from "@playwright/test";
import { presetNames, presetCookie, themeCookie } from "../lib/preferences";
import { blocks, blockCategories } from "../content/blocks";
import { authenticationBlocks } from "../content/blocks/authentication";

test("real block captures load in both color modes and remain inert", async ({ page, context, baseURL }) => {
  test.setTimeout(360000);
  for (const theme of ["light", "dark"]) {
    await context.addCookies([{ url: baseURL!, name: themeCookie, value: theme }]);
    for (const category of blockCategories) {
      await page.goto(`/blocks?category=${category.id}`);
      const thumbnails = page.locator(".block-thumbnail");
      await expect(thumbnails).toHaveCount(blocks.filter((block) => block.category === category.id).length);
      for (const thumbnail of await thumbnails.all()) {
        await expect(thumbnail).toHaveAttribute("inert", "");
        const image = thumbnail.locator(`.block-capture-${theme} img`);
        await image.scrollIntoViewIfNeeded();
        await expect(image).toBeVisible();
        await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth === 900)).toBe(true);
        await expect(thumbnail.locator(`.block-capture-${theme === "light" ? "dark" : "light"}`)).toBeHidden();
      }
    }
  }
});

test("catalog filters cannot lose input before hydration", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const scripts = /\/_next\/static\/.*\.js/;
  await page.route(scripts, async (route) => { await gate; await route.continue(); });
  try {
    await page.goto("/blocks", { waitUntil: "commit" });
    const search = page.getByRole("searchbox", { name: "Find a block", exact: true });
    await expect(search).toBeDisabled();
    await expect(page.getByRole("button", { name: "Authentication blocks", exact: true })).toBeDisabled();
    release();
    await expect(search).toBeEnabled();
    await search.fill("login");
    await expect(page.locator(".block-category-card")).toHaveCount(1);
  } finally {
    release();
    await page.unroute(scripts);
  }
});

test("new block collections have real source and responsive previews", async ({ page, context, baseURL }, testInfo) => {
  test.setTimeout(360000);
  const added = blocks.filter((block) => !["sign-in", "split-sign-in", "sign-up", "password-reset", "verification-code", "workspace", "studio-hero", "pricing"].includes(block.slug));
  for (const block of added) {
    await page.goto(`/blocks/${block.slug}`);
    await expect(page.locator(".block-preview").locator("h2, h3, form").first()).toBeVisible();
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.getByRole("tab", { name: "Code", exact: true }).click();
    const code = page.getByRole("tabpanel", { name: "Code", exact: true });
    await expect(code).toContainText('from "@pimolu/react"');
    await expect(code).not.toContainText("@/components");
    if (testInfo.project.name === "chromium") {
      await page.getByRole("tab", { name: "Preview", exact: true }).click();
      await page.screenshot({ path: testInfo.outputPath(`${block.slug}-desktop.png`), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: testInfo.outputPath(`${block.slug}-mobile.png`), fullPage: true });
    }
  }
  for (const theme of ["light", "dark"]) {
    await context.addCookies([{ url: baseURL!, name: themeCookie, value: theme }]);
    for (const category of blockCategories) {
      await page.goto(`/blocks?category=${category.id}`);
      await expect(page.locator(".block-card")).toHaveCount(blocks.filter((block) => block.category === category.id).length);
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const clipped = await page.locator(".block-thumbnail").evaluateAll((nodes) => nodes.filter((node) => {
          const frame = node.getBoundingClientRect();
          const content = node.firstElementChild!.getBoundingClientRect();
          return content.left < frame.left || content.right > frame.right + 1 || content.bottom > frame.bottom + 1;
        }).map((node) => node.className));
        expect(clipped, `${category.id}/${theme}/${width}`).toEqual([]);
      }
    }
  }
});

test("new marketing and authentication blocks have working forms, FAQ and checklist", async ({ page }) => {
  await page.goto("/blocks/product-launch");
  await page.getByRole("textbox", { name: "Work email", exact: true }).fill("alex@example.com");
  await page.getByRole("button", { name: "Join the early access list", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Invitation prepared for alex@example.com");
  await page.goto("/blocks/product-bento");
  await page.getByRole("button", { name: "Approve launch", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  await page.getByRole("button", { name: "Reset checklist", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "67");
  await page.goto("/blocks/product-questions");
  const question = page.getByRole("button", { name: "Can we bring our existing projects?", exact: true });
  await question.focus(); await question.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await question.press("Enter"); await expect(question).toHaveAttribute("aria-expanded", "false");
  await page.goto("/blocks/project-inquiry");
  await page.getByRole("textbox", { name: "Your name", exact: true }).fill("Alex");
  await page.getByRole("textbox", { name: "Contact email", exact: true }).fill("alex@example.com");
  await page.getByRole("textbox", { name: "A few words about your project", exact: true }).fill("A workspace for our small studio.");
  await page.getByRole("button", { name: "Prepare inquiry", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Brief prepared for Alex: Product design");
  await page.goto("/blocks/email-link");
  await page.getByRole("textbox", { name: "Sign-in email", exact: true }).fill("alex@example.com");
  await page.getByRole("button", { name: "Send sign-in link", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Link request prepared for alex@example.com");
  await page.goto("/blocks/workspace-setup");
  await page.getByRole("textbox", { name: "Workspace name", exact: true }).fill("Moon studio");
  await page.getByRole("button", { name: "Continue setup", exact: true }).click();
  await page.getByRole("button", { name: "Back to details", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Workspace name", exact: true })).toHaveValue("Moon studio");
  await page.getByRole("button", { name: "Continue setup", exact: true }).click();
  await page.getByRole("button", { name: "Create workspace", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Moon studio is ready");
});

test("application, commerce, newsletter and navigation blocks update local state", async ({ page }) => {
  await page.goto("/blocks/project-list");
  await page.getByRole("textbox", { name: "Project name", exact: true }).fill("New project");
  await page.getByRole("button", { name: "Create project", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("New project created locally.");
  await page.getByRole("searchbox", { name: "Search projects", exact: true }).fill("New project");
  await page.getByRole("button", { name: "Archive New project", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("New project archived");
  await page.goto("/blocks/notification-preferences");
  await page.getByRole("switch", { name: "Email notifications", exact: true }).click();
  await page.getByRole("button", { name: "Save preferences", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("email off");
  await page.getByRole("button", { name: "Restore defaults", exact: true }).click();
  await expect(page.getByRole("switch", { name: "Email notifications", exact: true })).toBeChecked();
  await page.goto("/blocks/studio-headphones");
  await page.getByRole("combobox", { name: "Finish", exact: true }).click();
  await page.getByRole("option", { name: "Ivory", exact: true }).click();
  await page.getByRole("combobox", { name: "Quantity", exact: true }).click();
  await page.getByRole("option", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag", exact: false }).click();
  await expect(page.getByRole("status")).toContainText("2 ivory headphones");
  await expect(page.getByRole("status")).toContainText("$258");
  await page.goto("/blocks/order-summary");
  await page.getByRole("switch", { name: "Gift wrapping", exact: true }).click();
  await page.getByRole("button", { name: "Review checkout", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("$134");
  await page.getByRole("button", { name: "Remove item", exact: true }).click();
  await expect(page.getByRole("button", { name: "Review checkout", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Restore item", exact: true }).click();
  await expect(page.getByRole("button", { name: "Review checkout", exact: true })).toBeEnabled();
  await page.goto("/blocks/editorial-signup");
  const subscribe = page.getByRole("button", { name: "Subscribe to the letter", exact: true });
  await expect(subscribe).toBeDisabled();
  await page.getByRole("textbox", { name: "Newsletter email", exact: true }).fill("alex@example.com");
  await page.getByRole("checkbox").check(); await subscribe.click();
  await expect(page.getByRole("status")).toContainText("Subscription prepared for alex@example.com");
  await page.goto("/blocks/workspace-bar");
  await page.getByRole("searchbox", { name: "Find a workspace page", exact: true }).fill("Atlas");
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await expect(page.getByRole("tab", { name: "Projects", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
});

test("All blocks shows category counts and detail back links restore the originating filters", async ({ page }) => {
  await page.goto("/blocks");
  await expect(page.locator(".block-category-card")).toHaveCount(blockCategories.length);
  const authentication = page.locator(".block-category-card").filter({ has: page.getByRole("heading", { name: "Authentication", exact: true }) });
  await expect(authentication).toContainText(`${authenticationBlocks.length} blocks`);
  await authentication.getByRole("link").press("Enter");
  await expect(page).toHaveURL(/category=authentication$/);
  await expect(page.locator(".block-category-card")).toHaveCount(0);
  await expect(page.locator(".block-card")).toHaveCount(authenticationBlocks.length);
  await page.getByRole("searchbox", { name: "Find a block", exact: true }).fill("password");
  const origin = page.url();
  await page.getByRole("link", { name: "Explore Welcome back", exact: true }).click();
  await page.reload();
  await page.getByRole("link", { name: "Back to Authentication" }).click();
  await expect(page).toHaveURL(origin);
  await expect(page.getByRole("searchbox", { name: "Find a block", exact: true })).toHaveValue("password");
  await page.goto("/blocks?category=authentication&subcategory=sign-in");
  await page.getByRole("link", { name: "Explore Welcome back", exact: true }).click();
  await page.getByRole("link", { name: "Back to Authentication" }).click();
  await expect(page).toHaveURL(/category=authentication&subcategory=sign-in$/);
  await page.goto("/blocks/sign-up");
  await expect(page.getByRole("link", { name: "Back to Authentication" })).toHaveAttribute("href", "/blocks?category=authentication");
  await page.goto("/blocks/sign-up?from=https%3A%2F%2Fevil.example");
  await expect(page.getByRole("link", { name: "Back to all categories" })).toHaveAttribute("href", "/blocks");
});

test("the shared CSS styles the header and interactive controls", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-home-discovery-ready="true"]').waitFor();
  const header = page.locator(".site-header");
  await expect(header.getByRole("button", { name: "Open navigation", exact: true })).toBeHidden();
  expect(await page.locator(".site-root").evaluate((node) => getComputedStyle(node).getPropertyValue("--pimolu-primary").trim())).not.toBe("");
  expect(await page.locator(".pimolu-navbar__inner").evaluate((node) => getComputedStyle(node).display)).toBe("flex");
  expect(await page.locator(".site-mark").evaluate((node) => getComputedStyle(node).maskImage)).toContain("icon.svg");
});

test("Resources supports hover without stealing focus, keyboard and mobile click", async ({ page }) => {
  await page.goto("/");
  const header = page.locator(".site-header");
  const trigger = header.getByRole("button", { name: "Resources", exact: true });
  const blog = header.getByRole("link", { name: /^Blog/ });
  const search = header.getByRole("button", { name: "Search Pimolu", exact: true }).filter({ visible: true });
  await expect(header.getByRole("link", { name: "Showcase", exact: true })).toBeVisible();
  await expect(header.getByRole("link", { name: "Blocks", exact: true })).toBeVisible();
  await search.focus();
  await trigger.hover();
  await expect(blog).toBeVisible();
  await expect(search).toBeFocused();
  await blog.hover();
  await expect(blog).toBeVisible();
  await page.mouse.move(5, 800);
  await expect(blog).toBeHidden();
  await trigger.focus();
  await trigger.press("ArrowDown");
  await expect(blog).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(blog).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await header.getByRole("button", { name: "Open navigation", exact: true }).click();
  await trigger.click();
  await expect(blog).toBeVisible();
  expect(await header.locator(".pimolu-navigation-menu__content").evaluate((node) => getComputedStyle(node).position)).toBe("static");
  await blog.click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(header.getByRole("button", { name: "Open navigation", exact: true })).toBeVisible();
});

test("blocks filter, expose the real copyable source and keep form values local", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (value: string) => sessionStorage.setItem("block-source", value) } }));
  await page.goto("/blocks");
  await expect(page.locator(".block-card")).toHaveCount(blockCategories.length);
  await page.getByRole("navigation", { name: "Block categories", exact: true }).getByRole("button", { name: "Authentication blocks", exact: true }).click();
  await expect(page.locator(".block-card")).toHaveCount(authenticationBlocks.length);
  await page.getByRole("link", { name: "Explore Welcome back", exact: true }).click();
  await expect(page).toHaveURL(/\/blocks\/sign-in\?from=/);
  await page.getByRole("textbox", { name: "Email address", exact: true }).fill("demo@example.com");
  await page.getByPlaceholder("Use a fictional password").fill("demo-only-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Form ready for demo@example.com");
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  const code = page.getByRole("tabpanel", { name: "Code", exact: true });
  await expect(code).toContainText("export function SignInBlock");
  await code.getByRole("button", { name: /Copy/ }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("block-source"))).toContain('from "@pimolu/react"');
});

test("authentication blocks validate forms and demonstrate reset and verification without a backend", async ({ page }) => {
  await page.goto("/blocks/sign-up");
  await page.getByRole("textbox", { name: "Full name", exact: true }).fill("Alex Morgan");
  await page.getByRole("textbox", { name: "Email address", exact: true }).fill("alex@example.com");
  const password = page.locator('input[name="password"]');
  const confirmation = page.locator('input[name="confirmPassword"]');
  await password.fill("demo-password");
  await confirmation.fill("another-password");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.getByText("The passwords do not match.", { exact: true })).toBeVisible();
  await expect(confirmation).toHaveAttribute("aria-invalid", "true");
  await confirmation.fill("demo-password");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Profile ready for Alex Morgan");
  await page.goto("/blocks/password-reset");
  const accountEmail = page.getByRole("textbox", { name: "Account email", exact: true });
  await accountEmail.fill("invalid-email");
  await page.getByRole("button", { name: "Request reset link", exact: true }).click();
  await expect(page.getByText("Reset request ready", { exact: true })).toHaveCount(0);
  await accountEmail.fill("alex@example.com");
  await page.getByRole("button", { name: "Request reset link", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Request prepared for alex@example.com");
  await page.getByRole("textbox", { name: "Account email", exact: true }).fill("another@example.com");
  await expect(page.getByText("Reset request ready", { exact: true })).toHaveCount(0);
  await page.goto("/blocks/verification-code");
  const verify = page.getByRole("button", { name: "Verify code", exact: true });
  const cells = page.locator(".pimolu-pin-input__cell");
  await expect(verify).toBeDisabled();
  for (let index = 0; index < 6; index++) await cells.nth(index).fill("654321"[index]);
  await verify.click();
  await expect(page.getByText("That code does not match. Try the demo code 123456.", { exact: true })).toBeVisible();
  for (let index = 0; index < 6; index++) await cells.nth(index).fill("123456"[index]);
  await verify.click();
  await expect(page.getByRole("status")).toContainText("Code accepted in this local preview");
  await page.getByRole("button", { name: "Clear code", exact: true }).click();
  await expect(cells.first()).toHaveValue("");
  await expect(verify).toBeDisabled();
  await page.goto("/blocks/split-sign-in");
  await page.getByRole("textbox", { name: "Email address", exact: true }).fill("alex@example.com");
  await page.locator('input[name="password"]').fill("demo-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Ready to sign in as alex@example.com");
});

test("every authentication block has standalone source and stays usable at narrow widths", async ({ page, context, baseURL }, testInfo) => {
  test.setTimeout(360000);
  for (const block of authenticationBlocks) {
    for (const theme of ["light", "dark"]) {
      await context.addCookies([{ url: baseURL!, name: themeCookie, value: theme }]);
      await page.goto(`/blocks/${block.slug}`);
      // An email-link waiting screen opens its correction form on demand.
      if (block.slug === "market-authentication-verification") {
        await page.locator(".block-preview").getByRole("button", { name: "Change email address" }).click();
      }
      await expect(page.locator(".block-preview form")).toBeVisible();
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (testInfo.project.name === "chromium" && [390, 1440].includes(width)) {
          await page.screenshot({ path: testInfo.outputPath(`${block.slug}-${theme}-${width}.png`), fullPage: true });
        }
      }
      await page.getByRole("tab", { name: "Code", exact: true }).click();
      const code = page.getByRole("tabpanel", { name: "Code", exact: true });
      await expect(code).toContainText('from "@pimolu/react"');
      await expect(code).not.toContainText("@/components");
      await page.getByRole("tab", { name: "Preview", exact: true }).click();
      await expect(page.locator(".block-preview form")).toBeVisible();
    }
  }
});

test("block view controls wait for hydration before accepting a code-view click", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const scripts = /\/_next\/static\/.*\.js/;
  await page.route(scripts, async (route) => { await gate; await route.continue(); });
  try {
    await page.goto("/blocks/sign-in", { waitUntil: "commit" });
    const codeTab = page.getByRole("tab", { name: "Code", exact: true });
    await expect(codeTab).toBeDisabled();
    await expect(page.locator(".block-preview form")).toHaveCount(0);
    release();
    await expect(codeTab).toBeEnabled();
    await codeTab.click();
    await expect(page.getByRole("tabpanel", { name: "Code", exact: true })).toContainText("export function SignInBlock");
  } finally {
    release();
    await page.unroute(scripts);
  }
});

test("block search combines category labels, words, clear actions and shareable filters", async ({ page }) => {
  await page.goto("/blocks");
  const search = page.getByRole("searchbox", { name: "Find a block", exact: true });
  await expect(search).toHaveAttribute("autocomplete", "off");
  await expect(page.locator(".block-thumbnail input")).toHaveCount(0);
  await search.fill("login");
  await expect(page.locator(".block-category-card")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Browse Authentication blocks", exact: true })).toBeVisible();
  await search.fill("  BUTTON   PRICING  ");
  await expect(page.locator(".block-card")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Browse Marketing blocks", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear block search", exact: true }).click();
  await expect(search).toBeFocused();
  await expect(page.locator(".block-card")).toHaveCount(blockCategories.length);
  await search.fill("admin@example.com");
  await expect(page.getByRole("heading", { name: "No matching blocks.", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(page.locator(".block-card")).toHaveCount(blockCategories.length);
  const navigation = page.getByRole("navigation", { name: "Block categories", exact: true });
  await navigation.getByRole("button", { name: "Marketing blocks", exact: true }).click();
  await expect(page.locator(".block-card")).toHaveCount(blocks.filter((block) => block.category === "marketing").length);
  await navigation.getByRole("button", { name: "Hero blocks", exact: true }).click();
  await expect(page).toHaveURL(/category=marketing&subcategory=hero$/);
  await expect(page.locator(".block-card")).toHaveCount(blocks.filter(b => b.category === "marketing" && b.subcategory === "hero").length);
  await page.goBack();
  await expect(page.locator(".block-card")).toHaveCount(blocks.filter((block) => block.category === "marketing").length);
  await page.goto("/blocks?category=marketing&subcategory=pricing&q=annual");
  await page.reload();
  await expect(search).toHaveValue("annual");
  await expect(page.locator(".block-card")).toHaveCount(2);
  await search.press("Escape");
  await expect(search).toHaveValue("");
  await expect(page.locator(".block-card")).toHaveCount(blocks.filter(b => b.category === "marketing" && b.subcategory === "pricing").length);
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(page).toHaveURL(/\/blocks$/);
  await expect(page.locator(".block-card")).toHaveCount(blockCategories.length);
});

test("block categories use a mobile drawer with real counts, focus return and planned collections", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/blocks");
  await expect(page.getByRole("main")).toHaveCount(1);
  const opener = page.getByRole("button", { name: "Browse categories", exact: true });
  await opener.click();
  const drawer = page.getByRole("dialog", { name: "Block categories", exact: true });
  await expect(drawer).toBeVisible();
  const expand = drawer.getByRole("button", { name: "Expand Authentication subcategories", exact: true });
  await expand.click();
  if (testInfo.project.name === "chromium") await page.screenshot({ path: testInfo.outputPath("categories-mobile.png") });
  await drawer.getByRole("button", { name: "Sign in blocks", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.locator(".block-card")).toHaveCount(authenticationBlocks.filter((block) => block.subcategory === "sign-in").length);
  await expect(page.locator(".blocks-count")).toContainText("Authentication / Sign in");
  await opener.click();
  await drawer.getByRole("button", { name: "Expand Application subcategories", exact: true }).click();
  await expect(drawer.getByRole("button", { name: "Planning & calendars blocks", exact: true })).toBeDisabled();
  await drawer.getByRole("button", { name: "All blocks", exact: true }).click();
  await expect(page.locator(".block-card")).toHaveCount(blockCategories.length);
  await expect(drawer).toBeHidden();
  await opener.click();
  await expect(drawer).toBeVisible();
  await expect.poll(() => drawer.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await expect(drawer).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Block categories", exact: true })).toBeVisible();
});

test("the block catalogue keeps its illustrations and search contained in every preset", async ({ page, context, baseURL }, testInfo) => {
  for (const preset of presetNames) {
    for (const theme of ["light", "dark"]) {
      await context.addCookies([
        { url: baseURL!, name: presetCookie, value: preset },
        { url: baseURL!, name: themeCookie, value: theme },
      ]);
      await page.goto("/blocks");
      await expect(page.locator(".site-root")).toHaveAttribute("data-pimolu-style", preset);
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const clipped = await page.locator(".block-thumbnail").evaluateAll((nodes) => nodes.filter((node) => {
          const frame = node.getBoundingClientRect();
          const content = node.firstElementChild!.getBoundingClientRect();
          return content.left < frame.left || content.right > frame.right || content.top < frame.top || content.bottom > frame.bottom + 1;
        }).map((node) => node.className));
        expect(clipped, `${preset}/${theme}/${width}`).toEqual([]);
        if (testInfo.project.name === "chromium" && preset === "default") {
          await page.screenshot({ path: testInfo.outputPath(`blocks-${theme}-${width}.png`), fullPage: true });
        }
      }
    }
  }
});

test("pricing and workspace blocks have working interactions and responsive previews", async ({ page }) => {
  await page.goto("/blocks/pricing");
  await page.getByRole("switch", { name: "Annual billing", exact: true }).click();
  await expect(page.getByText("$15", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Choose Studio", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Studio selected");
  await page.goto("/blocks/workspace");
  await page.getByRole("textbox", { name: "New project", exact: true }).fill("A new chapter");
  await page.getByRole("button", { name: "Add project", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("A new chapter added");
  await page.getByRole("searchbox", { name: "Find a project", exact: true }).fill("A new chapter");
  await expect(page.getByText("Atlas website", { exact: true })).toHaveCount(0);
  for (const route of ["/blocks", "/blocks/studio-hero", "/blocks/sign-in", "/blocks/pricing", "/blocks/workspace"]) {
    await page.goto(route);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  expect((await page.goto("/blocks/not-a-block"))?.status()).toBe(404);
});

test("hover navigation remains legible across presets and color modes", async ({ page }, testInfo) => {
  for (const preset of ["default", "adaptive", "monochrome", "cartoon", "glass", "luxury", "neo-brutalism"]) {
    for (const theme of ["light", "dark"]) {
      await page.goto(`/preview/navigation-menu?example=example-2&preset=${preset}&theme=${theme}`);
      await page.locator('[data-example-hydrated="true"]').waitFor();
      // Firefox can retain pointer coordinates between documents. Enter the
      // trigger from outside so this exercises a real pointer-enter event.
      await page.mouse.move(0, 0);
      await page.getByRole("button", { name: "Resources", exact: true }).hover();
      const link = page.getByRole("link", { name: "Quick start", exact: true });
      await expect(link).toBeVisible();
      await expect(page.getByRole("link", { name: "Themes", exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (testInfo.project.name === "chromium") {
        await page.screenshot({ path: testInfo.outputPath(`${preset}-${theme}.png`) });
      }
    }
  }
  if (testInfo.project.name === "chromium") {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/blocks");
    await page.screenshot({ path: testInfo.outputPath("blocks-mobile.png"), fullPage: true });
    await page.goto("/blocks/workspace");
    await page.screenshot({ path: testInfo.outputPath("workspace-mobile.png"), fullPage: true });
  }
});
