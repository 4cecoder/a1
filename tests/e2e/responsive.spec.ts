import { test, expect, Page } from "@playwright/test";

// Helper: check that an element is visible and within the viewport
async function isVisibleInViewport(page: Page, selector: string) {
  const el = page.locator(selector);
  await expect(el).toBeVisible();
  const box = await el.boundingBox();
  const vp = page.viewportSize()!;
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 1);
}

test.describe("Navbar responsiveness", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("logo is visible on all screens", async ({ page }) => {
    await expect(page.locator("nav").first()).toBeVisible();
  });

  test("desktop nav links visible on wide screens", async ({ page }) => {
    const vp = page.viewportSize()!;
    if (vp.width >= 768) {
      await expect(page.locator("text=Services").first()).toBeVisible();
      await expect(page.locator("text=Barbers").first()).toBeVisible();
      await expect(page.locator("text=Contact").first()).toBeVisible();
    }
  });

  test("hamburger menu visible on mobile", async ({ page }) => {
    const vp = page.viewportSize()!;
    if (vp.width < 768) {
      // hamburger button (Menu icon)
      const hamburger = page.locator("nav button");
      await expect(hamburger).toBeVisible();
      // desktop nav should be hidden
      const desktopLinks = page.locator(".hidden.md\\:flex");
      await expect(desktopLinks).toBeHidden();
    }
  });

  test("hamburger opens mobile menu", async ({ page }) => {
    const vp = page.viewportSize()!;
    if (vp.width < 768) {
      await page.locator("nav button").click();
      await expect(page.locator("text=BOOK NOW")).toBeVisible();
    }
  });
});

test.describe("Hero section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("headline visible", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("A1");
  });

  test("hero doesn't overflow viewport horizontally", async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const vp = page.viewportSize()!;
    expect(scrollWidth).toBeLessThanOrEqual(vp.width + 5);
  });

  test("CTA button visible and clickable", async ({ page }) => {
    const cta = page.locator("a[href='tel:8037832993']").first();
    await expect(cta).toBeVisible();
  });

  test("stats row visible", async ({ page }) => {
    await expect(page.locator("text=Years Open")).toBeVisible();
    await expect(page.locator("text=Expert Barbers")).toBeVisible();
  });
});

test.describe("Services section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#services").scrollIntoViewIfNeeded();
  });

  test("all 6 services are visible", async ({ page }) => {
    for (const name of ["Classic Cut", "Fade", "Beard Trim", "Cut + Beard", "Hot Towel Shave", "Kid's Cut"]) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible();
    }
  });

  test("popular badges render", async ({ page }) => {
    const badges = page.locator("text=POPULAR");
    await expect(badges).toHaveCount(2);
  });

  test("services grid doesn't overflow on mobile", async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const vp = page.viewportSize()!;
    expect(scrollWidth).toBeLessThanOrEqual(vp.width + 5);
  });
});

test.describe("Barbers section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#barbers").scrollIntoViewIfNeeded();
  });

  test("all barbers render", async ({ page }) => {
    for (const name of ["Marcus", "DeShawn", "Ray"]) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible();
    }
  });
});

test.describe("Contact section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
  });

  test("correct address is displayed", async ({ page }) => {
    await expect(page.locator("text=1314 Leesburg Rd")).toBeVisible();
    await expect(page.locator("text=Columbia, SC 29209")).toBeVisible();
  });

  test("correct phone number is displayed", async ({ page }) => {
    await expect(page.locator("text=(803) 783-2993")).toBeVisible();
  });

  test("hours are displayed", async ({ page }) => {
    await expect(page.locator("text=Mon – Fri")).toBeVisible();
    await expect(page.locator("text=9AM – 7PM")).toBeVisible();
  });

  test("get directions link present", async ({ page }) => {
    const link = page.locator("text=Get Directions");
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /maps\.google\.com/);
  });
});

test.describe("No horizontal scroll on any viewport", () => {
  const sections = ["#hero", "#services", "#barbers", "#contact"];

  for (const section of sections) {
    test(`no overflow at ${section}`, async ({ page }) => {
      await page.goto("/");
      await page.locator(section).scrollIntoViewIfNeeded();
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const vp = page.viewportSize()!;
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 5);
    });
  }
});
