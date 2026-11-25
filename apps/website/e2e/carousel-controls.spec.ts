import { expect, test } from "@playwright/test";

async function ready(page: import("@playwright/test").Page, path: string) {
  await page.goto(path);
  await expect(page.locator('.example-ready[data-example-hydrated="true"]').first()).toBeVisible();
}

test("carousel arrows center on the stage and hide on mobile when requested", async ({ page }) => {
  await ready(page, "/preview/multi-carousel?example=example-6&preset=default&theme=light");

  const geometry = await page.evaluate(() => {
    const root = document.querySelector(".pimolu-multi-carousel")!;
    const track = root.querySelector(".pimolu-carousel__viewport")!;
    const control = root.querySelector(".pimolu-carousel__control")!;
    const slide = root.querySelector(".pimolu-carousel__slide")!;
    const box = (node: Element) => node.getBoundingClientRect();
    return {
      trackCenter: box(track).top + box(track).height / 2,
      controlCenter: box(control).top + box(control).height / 2,
      border: getComputedStyle(slide).borderTopWidth,
      overflow: getComputedStyle(slide).overflow,
      mobile: root.getAttribute("data-controls-mobile"),
    };
  });

  expect(Math.abs(geometry.trackCenter - geometry.controlCenter)).toBeLessThan(2);
  expect(geometry.border).toBe("0px");
  expect(geometry.overflow).toBe("visible");
  expect(geometry.mobile).toBe("hidden");

  await page.setViewportSize({ width: 390, height: 900 });
  await expect(page.locator(".pimolu-multi-carousel .pimolu-carousel__control").first()).toBeHidden();
});

async function railState(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const root = document.querySelector(".pimolu-multi-carousel")!;
    const track = root.querySelector(".pimolu-carousel__viewport")!;
    const slides = [...root.querySelectorAll(".pimolu-carousel__slide")];
    const dots = [...root.querySelectorAll(".pimolu-carousel__dot")];
    const controls = [...root.querySelectorAll(".pimolu-carousel__control")];
    const box = (node: Element) => node.getBoundingClientRect();
    const trackBox = box(track);
    const first = slides[0] ? box(slides[0]) : null;
    const last = slides.at(-1) ? box(slides.at(-1)!) : null;
    return {
      slides: slides.length,
      dots: dots.length,
      activeDot: dots.findIndex((dot) => dot.getAttribute("aria-current") === "true"),
      controls: controls.map((control) => getComputedStyle(control).display),
      widths: slides.map((slide) => Math.round(box(slide).width)),
      trackWidth: Math.round(trackBox.width),
      gapLeft: first ? Math.round(first.left - trackBox.left) : null,
      gapRight: last ? Math.round(trackBox.right - last.right) : null,
      live: root.querySelector(".pimolu-carousel__live")?.textContent ?? null,
    };
  });
}

test("multi carousel keeps column width and updates navigation as the rail changes", async ({ page }) => {
  await ready(page, "/preview/multi-carousel?example=example-6&preset=default&theme=light");

  const initial = await railState(page);
  expect(initial.slides).toBe(5);
  expect(initial.dots).toBe(3);
  expect(initial.live).toBe("1 / 3");
  const columnWidth = initial.widths[0];

  await page.getByRole("button", { name: "2 products", exact: true }).click();
  await expect.poll(async () => (await railState(page)).dots).toBe(0);
  const two = await railState(page);
  expect(two.widths).toEqual([columnWidth, columnWidth]);
  expect(Math.abs(two.gapLeft! - two.gapRight!)).toBeLessThan(2);
  expect(two.controls).toEqual([]);
  expect(two.live).toBe("");

  await page.getByRole("button", { name: "1 product", exact: true }).click();
  await expect.poll(async () => (await railState(page)).dots).toBe(0);
  const one = await railState(page);
  expect(one.widths).toEqual([columnWidth]);
  expect(one.gapLeft).toBe(one.gapRight);

  await page.getByRole("button", { name: "5 products", exact: true }).click();
  await expect.poll(async () => (await railState(page)).dots).toBe(3);

  await page.getByRole("button", { name: "4 columns", exact: true }).click();
  await expect.poll(async () => (await railState(page)).dots).toBe(2);
  const fourColumns = await railState(page);
  expect(fourColumns.widths[0]).toBeLessThan(columnWidth);

  await page.getByRole("button", { name: "3 columns", exact: true }).click();
  await expect.poll(async () => (await railState(page)).dots).toBe(3);

  await page.setViewportSize({ width: 390, height: 900 });
  await expect.poll(async () => (await railState(page)).dots).toBe(5);
  const mobile = await railState(page);
  expect(mobile.controls).toEqual(["none", "none"]);

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect.poll(async () => (await railState(page)).dots).toBe(3);
});

test("a removed page does not return when the rail grows again", async ({ page }) => {
  await ready(page, "/preview/multi-carousel?example=example-6&preset=default&theme=light");
  await page.getByRole("button", { name: "Next slide" }).click();
  await expect.poll(async () => (await railState(page)).activeDot).toBe(1);
  expect((await railState(page)).live).toBe("2 / 3");

  await page.getByRole("button", { name: "2 products", exact: true }).click();
  await expect.poll(async () => (await railState(page)).dots).toBe(0);

  await page.getByRole("button", { name: "5 products", exact: true }).click();
  await expect.poll(async () => (await railState(page)).dots).toBe(3);
  expect((await railState(page)).activeDot).toBe(0);
});

test("focus moves to the viewport when a resize removes the navigation", async ({ page }) => {
  await ready(page, "/preview/multi-carousel?example=example-6&preset=default&theme=light");
  await page.getByRole("button", { name: "2 products", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 900 });
  await expect.poll(async () => (await railState(page)).dots).toBe(2);

  await page.getByRole("button", { name: "Go to slide 2", exact: true }).focus();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect.poll(async () => (await railState(page)).dots).toBe(0);
  await expect(page.locator(".pimolu-multi-carousel .pimolu-carousel__viewport")).toBeFocused();
});

test("peek cards accept a custom width and thumbnails share one crop", async ({ page }) => {
  await ready(page, "/preview/peek-carousel?example=example-6&preset=default&theme=light");
  const peek = await page.evaluate(() => {
    const root = document.querySelector(".pimolu-peek-carousel") as HTMLElement;
    const active = root.querySelector('.pimolu-carousel__slide[data-active="true"]')!;
    return {
      width: active.getBoundingClientRect().width,
      token: root.style.getPropertyValue("--pimolu-peek-slide-width"),
    };
  });
  expect(peek.token).toBe("min(320px, 78vw)");
  expect(Math.abs(peek.width - 320)).toBeLessThan(2);

  await ready(page, "/preview/thumbnail-carousel?example=example-6&preset=default&theme=light");
  const thumbnails = await page.evaluate(() =>
    [...document.querySelectorAll(".pimolu-carousel__thumbnail img")].map((image) => {
      const box = image.getBoundingClientRect();
      return {
        width: Math.round(box.width),
        height: Math.round(box.height),
        ratio: getComputedStyle(image).aspectRatio,
        className: image.className,
      };
    }),
  );
  expect(thumbnails.length).toBeGreaterThan(2);
  expect(new Set(thumbnails.map((item) => item.height)).size).toBe(1);
  expect(new Set(thumbnails.map((item) => item.width)).size).toBe(1);
  expect(thumbnails.every((item) => item.ratio === "1 / 1")).toBe(true);
  expect(thumbnails.every((item) => item.className.includes("thumbnail-crop"))).toBe(true);
});
