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

  test("confirm route surfaces recoverable checkout failures", async ({ page }) => {
    await page.goto("/book/confirm?service=classic-cut&barber=no_preference&date=2026-05-30&slot=2026-05-30-no_preference-540&intent=pi_missing_demo");

    await expect(page.getByRole("heading", { name: /we could not finalize payment/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /try payment again/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /pick a different slot/i })).toBeVisible();
  });
});
