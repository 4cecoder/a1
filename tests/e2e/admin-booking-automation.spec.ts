import { expect, test } from "@playwright/test";

test.describe("admin + booking automation flow", () => {
  test("admin pages are reachable and automation controls render", async ({ page }) => {
    await page.context().setExtraHTTPHeaders({ "x-user-role": "admin" });

    const adminRoutes = ["/admin", "/admin/settings", "/admin/settings/automation", "/admin/appointments"];

    for (const path of adminRoutes) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response, `No response for ${path}`).not.toBeNull();
      expect(response!.status(), `Unexpected status for ${path}`).toBeGreaterThanOrEqual(200);
      expect(response!.status(), `Unexpected status for ${path}`).toBeLessThan(500);
    }

    await page.goto("/admin/settings/automation", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /automation settings/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^cadence$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^templates$/i })).toBeVisible();

    await expect(page.getByLabel(/reminder #1 minutes before/i)).toBeVisible();
    await expect(page.getByLabel(/internal gap alert threshold/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /save automation settings/i })).toBeVisible();
  });

  test("book flow renders and progresses through key steps with stable selectors", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(500);

    await expect(page.getByTestId("booking-open")).toBeVisible();
    await page.getByTestId("booking-open").click();

    await expect(page.getByTestId("booking-drawer")).toBeVisible();
    const step1 = page.getByTestId("booking-step-1");
    await expect(step1).toBeVisible();

    await step1.locator("input").nth(0).fill("Wave 4 QA");
    await step1.locator("input").nth(1).fill("8035550111");

    const serviceSelect = step1.locator("select").first();
    const optionCount = await serviceSelect.locator("option").count();
    expect(optionCount).toBeGreaterThan(0);
    const serviceValue = (await serviceSelect.locator("option").first().getAttribute("value")) ?? "";
    expect(serviceValue.length).toBeGreaterThan(0);
    await serviceSelect.selectOption(serviceValue);

    await page.getByTestId("booking-next").click();

    const step2 = page.getByTestId("booking-step-2");
    await expect(step2).toBeVisible();

    const selects = step2.locator("select");
    const selectCount = await selects.count();
    expect(selectCount).toBeGreaterThanOrEqual(2);
    await selects.nth(0).selectOption({ label: "No preference" });
    await selects.nth(1).selectOption({ label: "No preference" });
    await step2.locator("textarea").fill("Playwright Wave 4 flow");

    await page.getByTestId("booking-submit").click();
    await expect(page.getByTestId("booking-success")).toBeVisible();
  });
});
