import { test, expect, Page, Locator } from "@playwright/test";

async function navbarHeader(page: Page): Promise<Locator> {
  const headerByTestId = page.getByTestId("navbar-header");
  if (await headerByTestId.count()) return headerByTestId;
  return page.locator("header").first();
}

async function desktopNavbar(page: Page): Promise<Locator> {
  const desktopByTestId = page.getByTestId("navbar-desktop-nav");
  if (await desktopByTestId.count()) return desktopByTestId;
  return (await navbarHeader(page)).locator("nav").first();
}

async function scrollToIfPresent(page: Page, selector: string) {
  const section = page.locator(selector).first();
  if (await section.count()) {
    await section.scrollIntoViewIfNeeded();
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const vp = page.viewportSize();
  expect(vp).not.toBeNull();
  expect(scrollWidth).toBeLessThanOrEqual(vp!.width + 5);
}

test.describe("Responsive smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navbar uses resilient hooks and adapts across breakpoints", async ({ page }) => {
    const vp = page.viewportSize()!;
    const header = await navbarHeader(page);
    await expect(header).toBeVisible();

    const desktopNav = await desktopNavbar(page);
    if (vp.width > 640) {
      await expect(desktopNav).toBeVisible();
      await expect(desktopNav.locator("a[href='#services']")).toBeVisible();
      await expect(desktopNav.locator("a[href='#contact']")).toBeVisible();
      await expect(desktopNav.locator("a[href^='tel:']")).toBeVisible();
    } else {
      const menuButton = header.getByRole("button");
      await expect(menuButton).toBeVisible();
      await menuButton.click();

      const mobileDrawer = page.getByTestId("navbar-mobile-drawer");
      await expect(mobileDrawer).toBeVisible();
      await expect(mobileDrawer.locator("a[href='#services']")).toBeVisible();
      await expect(mobileDrawer.locator("a[href='#contact']")).toBeVisible();
      await expect(mobileDrawer.locator("a[href^='tel:']")).toBeVisible();
    }
  });

  test("hero is visible with CTA", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();
    await expect(hero.getByRole("heading", { level: 1, name: /a1/i })).toBeVisible();

    const callCta = hero.locator("a[href='tel:8037832993']");
    const servicesCta = hero.locator("a[href='#services']");
    await expect(callCta).toBeVisible();
    await expect(servicesCta).toBeVisible();

    await callCta.focus();
    await expect(callCta).toBeFocused();
    await servicesCta.focus();
    await expect(servicesCta).toBeFocused();
  });

  test("services section is visible and does not overflow", async ({ page }) => {
    await scrollToIfPresent(page, "#services");
    await expect(page.locator("#services")).toBeVisible();

    for (const name of ["Classic Cut", "Fade", "Beard Trim", "Cut + Beard", "Hot Towel Shave", "Kid's Cut"]) {
      await expect(page.getByText(name, { exact: true })).toBeVisible();
    }

    await expectNoHorizontalOverflow(page);
  });

  test("barbers section exists at #barbers and is visible", async ({ page }) => {
    const barbers = page.locator("#barbers");
    await expect(barbers, "Expected #barbers section to exist").toHaveCount(1, { timeout: 2000 });
    await barbers.scrollIntoViewIfNeeded();

    for (const name of ["Marcus", "DeShawn", "Ray"]) {
      await expect(page.getByText(name, { exact: true })).toBeVisible();
    }

    await expectNoHorizontalOverflow(page);
  });

  test("contact section checks", async ({ page }) => {
    await scrollToIfPresent(page, "#contact");
    const contact = page.locator("#contact");
    await expect(contact).toBeVisible();
    await expect(page.getByText("1314 Leesburg Rd #D")).toBeVisible();
    await expect(page.getByText("Columbia, SC 29209")).toBeVisible();
    await expect(page.getByText("(803) 783-2993")).toBeVisible();

    const directions = contact.locator("a[href*='maps.app.goo.gl']");
    await expect(directions).toBeVisible();
    await expect(directions).toHaveAttribute("href", /maps\.app\.goo\.gl/);

    const contactCallCta = contact.locator("a[href='tel:8037832993']");
    await expect(contactCallCta).toBeVisible();

    await directions.focus();
    await expect(directions).toBeFocused();
    await contactCallCta.focus();
    await expect(contactCallCta).toBeFocused();

    await expectNoHorizontalOverflow(page);
  });
});
