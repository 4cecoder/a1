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

  test("book wizard confirms payment and exposes receipt route", async ({ page }) => {
    const response = await page.goto("/book", { waitUntil: "domcontentloaded" });
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(500);

    await page.getByRole("button", { name: /^Classic Cut/i }).click();
    await page.getByRole("button", { name: /No preference/i }).first().click();
    await page.getByRole("button", { name: /continue to barber preference/i }).click();

    await page.getByRole("button", { name: /continue to date & slot/i }).click();
    await page.getByRole("button", { name: /9:00 AM -/i }).click();
    await page.getByRole("button", { name: /review checkout/i }).click();
    await page.getByRole("button", { name: /confirm booking/i }).click();

    await expect(page).toHaveURL(/\/book\/confirm\?/);
    await expect(page.getByRole("heading", { name: /payment confirmed/i })).toBeVisible();

    const receiptLink = page.getByRole("link", { name: /view receipt/i });
    await expect(receiptLink).toBeVisible();
    const href = await receiptLink.getAttribute("href");
    expect(href).toMatch(/^\/book\/receipt\//);

    await receiptLink.click();
    await expect(page).toHaveURL(/\/book\/receipt\//);
    await expect(page.getByRole("heading", { name: /payment receipt/i })).toBeVisible();
    await expect(page.getByText(/paid in full via mock provider/i)).toBeVisible();
  });
});
