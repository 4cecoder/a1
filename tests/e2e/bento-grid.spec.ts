import { test, expect } from "@playwright/test";

test.describe("Bento Grid Layout", () => {
  test("renders 4 bento cards in the DOM", async ({ page }) => {
    await page.goto("/");

    const cards = page.locator("[data-bento-card]");
    await expect(cards).toHaveCount(4);
  });

  test("bento wrapper has 12-col grid class", async ({ page }) => {
    await page.goto("/");

    const wrapper = page.locator("[data-bento-grid]");
    await expect(wrapper).toBeVisible();
    const cls = await wrapper.getAttribute("class");
    expect(cls).toContain("md:grid-cols-12");
  });

  test("Card A has col-span-8 class", async ({ page }) => {
    await page.goto("/");
    const cardA = page.locator("[data-bento-card='A']");
    await expect(cardA).toBeVisible();
    const cls = await cardA.getAttribute("class");
    expect(cls).toContain("md:col-span-8");
  });

  test("Card D (testimonials) has col-span-8 class", async ({ page }) => {
    await page.goto("/");
    const cardD = page.locator("[data-bento-card='D']");
    await expect(cardD).toBeVisible();
    const cls = await cardD.getAttribute("class");
    expect(cls).toContain("md:col-span-8");
  });
});
