import { expect, test } from "@playwright/test";

test.describe("full system smoke baseline", () => {
  test("home route renders core sections and booking entrypoint", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1, name: /a1/i })).toBeVisible();

    await expect(page.locator("#services")).toBeVisible();
    await expect(page.locator("#barbers")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();

    await expect(page.getByTestId("booking-open")).toBeVisible();
  });

  test("admin routes return non-500 responses", async ({ page }) => {
    await page.context().setExtraHTTPHeaders({ "x-user-role": "admin" });

    for (const path of ["/admin", "/admin/settings", "/admin/settings/automation", "/admin/appointments"]) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response, `No response for ${path}`).not.toBeNull();
      expect(response!.status(), `Unexpected status for ${path}`).toBeGreaterThanOrEqual(200);
      expect(response!.status(), `Unexpected status for ${path}`).toBeLessThan(500);
    }
  });
});
