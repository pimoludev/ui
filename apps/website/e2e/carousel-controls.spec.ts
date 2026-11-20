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
