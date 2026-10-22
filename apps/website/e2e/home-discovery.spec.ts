import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/"); await page.locator('[data-home-discovery-ready="true"]').waitFor(); });

test("the added strip supports joining, date selection and dismissible feedback", async ({ page }) => {
  const strip = page.getByRole('region', { name:'A few things you can build' });
  await strip.getByRole('button', { name:'Join the team', exact:true }).click();
  await expect(strip.getByRole('button', { name:'Joined', exact:true })).toHaveAttribute('aria-pressed','true');
  await strip.getByRole('button', { name:'Your next launch', exact:true }).click();
  const picker = page.getByRole('dialog', { name:'Your next launch', exact:true });
  await picker.getByRole('gridcell', { name:'Saturday, October 24, 2026', exact:true }).click();
  await expect(strip.getByRole('status').filter({hasText:'Pencil it in'})).toHaveText('Pencil it in for Oct 24.');
  await strip.getByRole('button', { name:'Dismiss saved notification' }).click();
  await expect(strip.getByText('Ready when you are.')).toHaveCount(0);
  await strip.getByRole('button', { name:'Show notification' }).click();
  await expect(strip.getByText('Ready when you are.')).toBeVisible();
});

test("the sign-in preview validates locally and the product card updates its bag", async ({ page }) => {
  const form = page.getByRole('article', { name:'A warm welcome', exact:true });
  await form.getByRole('textbox', { name:'Email address', exact:true }).fill('visitor@example.com');
  await form.getByPlaceholder('Your demo password', { exact:true }).fill('demo-only');
  await form.getByRole('button', { name:'Show password', exact:true }).click();
  await expect(form.getByPlaceholder('Your demo password', { exact:true })).toHaveAttribute('type','text');
  await form.getByRole('button', { name:'Try signing in' }).click();
  await expect(form.getByRole('status')).toContainText('No account was created.');
  const product = page.getByRole('article', { name:'Worth a closer look', exact:true });
  await product.getByRole('img').scrollIntoViewIfNeeded();
  await expect(product.getByRole('img')).toHaveAttribute('data-loaded','true');
  await expect(product.getByRole('img')).toBeVisible();
  await expect.poll(() => product.locator('img').evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  await product.getByRole('radio', { name:'L', exact:true }).click();
  await product.getByRole('radio', { name:'5 stars', exact:true }).click();
  await product.getByRole('button', { name:'Add to bag', exact:true }).click();
  await expect(product.getByRole('status')).toHaveText('1 pair added · latest size L.');
});

test("calendar selection and command keyboard search are real interactions", async ({ page }) => {
  const calendar = page.getByRole('article', { name:'Make a little time', exact:true });
  await calendar.getByRole('gridcell', { name:'Friday, October 23, 2026', exact:true }).click();
  await expect(calendar.getByRole('status')).toHaveText('Your studio day: Oct 23.');
  const command = page.getByRole('article', { name:'One thought away', exact:true });
  await command.getByRole('button', { name:'Search actions', exact:true }).click();
  const dialog = page.getByRole('dialog', { name:'Quick actions', exact:true });
  const search = dialog.getByRole('combobox', { name:'Explore sample commands', exact:true });
  await search.fill('invite');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await search.press('Enter');
  await expect(command.getByRole('status')).toHaveText('Selected: Invite your team.');
});

test("notification counts and preferences stay local to their composition", async ({ page }) => {
  const sample = page.getByRole('article', { name:'The right kind of update', exact:true });
  const trigger = sample.getByRole('button', { name:/Open sample notifications/ });
  await trigger.click();
  await page.getByRole('button', { name:'Mark all as read', exact:true }).click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(sample.getByText('0 unread', { exact:true })).toBeVisible();
  await sample.getByRole('switch', { name:'Email updates', exact:true }).click();
  await expect(sample.getByRole('status')).toHaveText('Email updates are off for this preview.');
});

test("the audio sample really plays, pauses and switches tracks", async ({ page }) => {
  const sample = page.getByRole('article', { name:'Press play', exact:true });
  await sample.getByRole('button', { name:'Play', exact:true }).click();
  await expect.poll(() => sample.locator('audio').evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0);
  await sample.getByRole('button', { name:'Pause', exact:true }).click();
  expect(await sample.locator('audio').evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await sample.getByRole('radio', { name:'Pixel', exact:true }).click();
  await expect(sample.locator('audio')).toHaveAttribute('src', '/sounds/pixel-art-game.mp3');
  await expect(sample.getByRole('button', { name:'Play', exact:true })).toBeVisible();
});

test("four product worlds offer independent actions and keyboard tabs", async ({ page }) => {
  const worlds = page.locator('#product-worlds');
  await worlds.getByRole('button', { name:'Approve launch', exact:true }).click();
  await expect(worlds.getByRole('status')).toContainText('Launch approved.');
  await worlds.getByRole('tab', { name:'Enterprise / SaaS', exact:true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(worlds.getByRole('tab', { name:'E-commerce', exact:true })).toHaveAttribute('aria-selected','true');
  await worlds.getByRole('switch', { name:'Add gift wrapping', exact:true }).click();
  await expect(worlds.getByText('$134', { exact:true })).toBeVisible();
  await worlds.getByRole('button', { name:'Add a little joy' }).click();
  await expect(worlds.getByRole('status')).toHaveText('1 item in your sample bag.');
  await worlds.getByRole('tab', { name:'Gaming', exact:true }).click();
  await worlds.getByRole('button', { name:'Claim season reward', exact:true }).click();
  await expect(worlds.getByRole('button', { name:'Reward claimed', exact:true })).toBeDisabled();
  await worlds.getByRole('tab', { name:'Creative', exact:true }).click();
  await worlds.getByRole('radio', { name:'Color study', exact:true }).click();
  await expect(worlds.getByRole('status')).toHaveText('Selected work / Color study, 2026.');
});

test("existing workspace, artwork and identity controls remain intact", async ({ page }) => {
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator('.home-identity-art')).toHaveCount(1);
  await expect(page.locator('#home-title')).toHaveText('One system.Your identity.');
  const workspace = page.locator('.home-workspace');
  await workspace.getByRole('button', { name:'New project', exact:true }).click();
  const dialog = page.getByRole('dialog', { name:'A fresh start.', exact:true });
  await dialog.getByRole('textbox', { name:'Project name', exact:true }).fill('Kept existing workspace');
  await dialog.getByRole('button', { name:'Create project', exact:true }).click();
  await workspace.getByRole('tab', { name:'Projects (4)', exact:true }).click();
  await expect(workspace.getByText('Kept existing workspace', { exact:true }).filter({visible:true})).toBeVisible();
  await page.locator('#make-it-yours').getByRole('button', { name:'Save preferences', exact:true }).click();
  await expect(page.locator('#make-it-yours').getByRole('status').filter({hasText:'Saved for this preview'})).toContainText('Saved for this preview');
});

test("new sections stay contained in light and dark at desktop, tablet and mobile widths", async ({ page }) => {
  const errors: string[]=[];
  page.on('pageerror', error => errors.push(error.message));
  for(const colorScheme of ['light','dark'] as const) {
    await page.emulateMedia({colorScheme,reducedMotion:'reduce'});
    for(const [width,height] of [[1440,900],[768,1024],[390,844]]) {
      await page.setViewportSize({width,height});
      for(const id of ['component-stories','product-worlds']) {
        await page.locator('#'+id).evaluate(node => node.scrollIntoView());
        expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
      const gallery=page.locator('.discovery-gallery');
      await expect(gallery.getByRole('article')).toHaveCount(6);
      for(const tab of ['Enterprise / SaaS','E-commerce','Gaming','Creative']) {
        await page.locator('#product-worlds').getByRole('tab',{name:tab,exact:true}).click();
        const bounds=await page.locator('.discovery-worlds [role="tabpanel"]:visible').boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width);
      }
    }
  }
  expect(errors).toEqual([]);
});
