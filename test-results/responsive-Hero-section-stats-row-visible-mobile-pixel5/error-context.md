# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> Hero section >> stats row visible
- Location: tests/e2e/responsive.spec.ts:74:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Expert Barbers')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Expert Barbers')

```

```yaml
- navigation:
  - link "A1 CUTS":
    - /url: "#hero"
  - button
- text: EST. 2010 COLUMBIA, SC
- heading "A1 CUTS" [level=1]
- paragraph: Premium cuts. Classic craft. Walk in looking good, walk out looking great.
- link "CALL TO BOOK":
  - /url: tel:8037832993
- link "VIEW SERVICES":
  - /url: "#services"
- text: 10+ Years Open 3 Barbers 5★ Rated What We Do
- heading "Services" [level=2]
- heading "Classic Cut" [level=3]
- paragraph: Clean, sharp, timeless.
- text: $25
- heading "Fade" [level=3]
- text: POPULAR
- paragraph: Low, mid, or high — dialed in.
- text: $30
- heading "Beard Trim" [level=3]
- paragraph: Lined up and looking right.
- text: $15
- heading "Cut + Beard" [level=3]
- text: POPULAR
- paragraph: The full treatment.
- text: $40
- heading "Hot Towel Shave" [level=3]
- paragraph: Old school. The real deal.
- text: $35
- heading "Kid's Cut" [level=3]
- paragraph: Ages 12 and under.
- text: $18 The Team
- heading "Your Barbers" [level=2]
- heading "Marcus" [level=3]
- paragraph: Master Barber
- paragraph: Fades & Tapers
- paragraph: 12 yrs experience
- heading "DeShawn" [level=3]
- paragraph: Senior Barber
- paragraph: Beards & Lineups
- paragraph: 8 yrs experience
- heading "Ray" [level=3]
- paragraph: Barber
- paragraph: Classic Cuts
- paragraph: 4 yrs experience
- text: Find Us
- heading "Contact & Hours" [level=2]
- text: Location
- paragraph: "1314 Leesburg Rd #D Columbia, SC 29209"
- link "Get Directions":
  - /url: https://maps.google.com/?q=1314+Leesburg+Rd+%23D+Columbia+SC+29209
- text: Hours Mon – Fri 9AM – 7PM Saturday 9AM – 6PM Sunday Closed Book
- paragraph: Walk-ins welcome. Appointments recommended.
- link "(803) 783-2993":
  - /url: tel:8037832993
- contentinfo:
  - text: A1 CUTS
  - paragraph: © 2025 A1 Cuts · Columbia, SC
- alert
```

# Test source

```ts
  1   | import { test, expect, Page } from "@playwright/test";
  2   | 
  3   | // Helper: check that an element is visible and within the viewport
  4   | async function isVisibleInViewport(page: Page, selector: string) {
  5   |   const el = page.locator(selector);
  6   |   await expect(el).toBeVisible();
  7   |   const box = await el.boundingBox();
  8   |   const vp = page.viewportSize()!;
  9   |   expect(box).not.toBeNull();
  10  |   expect(box!.x).toBeGreaterThanOrEqual(0);
  11  |   expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 1);
  12  | }
  13  | 
  14  | test.describe("Navbar responsiveness", () => {
  15  |   test.beforeEach(async ({ page }) => {
  16  |     await page.goto("/");
  17  |   });
  18  | 
  19  |   test("logo is visible on all screens", async ({ page }) => {
  20  |     await expect(page.locator("nav").first()).toBeVisible();
  21  |   });
  22  | 
  23  |   test("desktop nav links visible on wide screens", async ({ page }) => {
  24  |     const vp = page.viewportSize()!;
  25  |     if (vp.width >= 768) {
  26  |       await expect(page.locator("text=Services").first()).toBeVisible();
  27  |       await expect(page.locator("text=Barbers").first()).toBeVisible();
  28  |       await expect(page.locator("text=Contact").first()).toBeVisible();
  29  |     }
  30  |   });
  31  | 
  32  |   test("hamburger menu visible on mobile", async ({ page }) => {
  33  |     const vp = page.viewportSize()!;
  34  |     if (vp.width < 768) {
  35  |       // hamburger button (Menu icon)
  36  |       const hamburger = page.locator("nav button");
  37  |       await expect(hamburger).toBeVisible();
  38  |       // desktop nav should be hidden
  39  |       const desktopLinks = page.locator(".hidden.md\\:flex");
  40  |       await expect(desktopLinks).toBeHidden();
  41  |     }
  42  |   });
  43  | 
  44  |   test("hamburger opens mobile menu", async ({ page }) => {
  45  |     const vp = page.viewportSize()!;
  46  |     if (vp.width < 768) {
  47  |       await page.locator("nav button").click();
  48  |       await expect(page.locator("text=BOOK NOW")).toBeVisible();
  49  |     }
  50  |   });
  51  | });
  52  | 
  53  | test.describe("Hero section", () => {
  54  |   test.beforeEach(async ({ page }) => {
  55  |     await page.goto("/");
  56  |   });
  57  | 
  58  |   test("headline visible", async ({ page }) => {
  59  |     await expect(page.locator("h1")).toBeVisible();
  60  |     await expect(page.locator("h1")).toContainText("A1");
  61  |   });
  62  | 
  63  |   test("hero doesn't overflow viewport horizontally", async ({ page }) => {
  64  |     const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  65  |     const vp = page.viewportSize()!;
  66  |     expect(scrollWidth).toBeLessThanOrEqual(vp.width + 5);
  67  |   });
  68  | 
  69  |   test("CTA button visible and clickable", async ({ page }) => {
  70  |     const cta = page.locator("a[href='tel:8037832993']").first();
  71  |     await expect(cta).toBeVisible();
  72  |   });
  73  | 
  74  |   test("stats row visible", async ({ page }) => {
  75  |     await expect(page.locator("text=Years Open")).toBeVisible();
> 76  |     await expect(page.locator("text=Expert Barbers")).toBeVisible();
      |                                                       ^ Error: expect(locator).toBeVisible() failed
  77  |   });
  78  | });
  79  | 
  80  | test.describe("Services section", () => {
  81  |   test.beforeEach(async ({ page }) => {
  82  |     await page.goto("/");
  83  |     await page.locator("#services").scrollIntoViewIfNeeded();
  84  |   });
  85  | 
  86  |   test("all 6 services are visible", async ({ page }) => {
  87  |     for (const name of ["Classic Cut", "Fade", "Beard Trim", "Cut + Beard", "Hot Towel Shave", "Kid's Cut"]) {
  88  |       await expect(page.locator(`text=${name}`).first()).toBeVisible();
  89  |     }
  90  |   });
  91  | 
  92  |   test("popular badges render", async ({ page }) => {
  93  |     const badges = page.locator("text=POPULAR");
  94  |     await expect(badges).toHaveCount(2);
  95  |   });
  96  | 
  97  |   test("services grid doesn't overflow on mobile", async ({ page }) => {
  98  |     const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  99  |     const vp = page.viewportSize()!;
  100 |     expect(scrollWidth).toBeLessThanOrEqual(vp.width + 5);
  101 |   });
  102 | });
  103 | 
  104 | test.describe("Barbers section", () => {
  105 |   test.beforeEach(async ({ page }) => {
  106 |     await page.goto("/");
  107 |     await page.locator("#barbers").scrollIntoViewIfNeeded();
  108 |   });
  109 | 
  110 |   test("all barbers render", async ({ page }) => {
  111 |     for (const name of ["Marcus", "DeShawn", "Ray"]) {
  112 |       await expect(page.locator(`text=${name}`).first()).toBeVisible();
  113 |     }
  114 |   });
  115 | });
  116 | 
  117 | test.describe("Contact section", () => {
  118 |   test.beforeEach(async ({ page }) => {
  119 |     await page.goto("/");
  120 |     await page.locator("#contact").scrollIntoViewIfNeeded();
  121 |   });
  122 | 
  123 |   test("correct address is displayed", async ({ page }) => {
  124 |     await expect(page.locator("text=1314 Leesburg Rd")).toBeVisible();
  125 |     await expect(page.locator("text=Columbia, SC 29209")).toBeVisible();
  126 |   });
  127 | 
  128 |   test("correct phone number is displayed", async ({ page }) => {
  129 |     await expect(page.locator("text=(803) 783-2993")).toBeVisible();
  130 |   });
  131 | 
  132 |   test("hours are displayed", async ({ page }) => {
  133 |     await expect(page.locator("text=Mon – Fri")).toBeVisible();
  134 |     await expect(page.locator("text=9AM – 7PM")).toBeVisible();
  135 |   });
  136 | 
  137 |   test("get directions link present", async ({ page }) => {
  138 |     const link = page.locator("text=Get Directions");
  139 |     await expect(link).toBeVisible();
  140 |     await expect(link).toHaveAttribute("href", /maps\.google\.com/);
  141 |   });
  142 | });
  143 | 
  144 | test.describe("No horizontal scroll on any viewport", () => {
  145 |   const sections = ["#hero", "#services", "#barbers", "#contact"];
  146 | 
  147 |   for (const section of sections) {
  148 |     test(`no overflow at ${section}`, async ({ page }) => {
  149 |       await page.goto("/");
  150 |       await page.locator(section).scrollIntoViewIfNeeded();
  151 |       const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  152 |       const vp = page.viewportSize()!;
  153 |       expect(scrollWidth).toBeLessThanOrEqual(vp.width + 5);
  154 |     });
  155 |   }
  156 | });
  157 | 
```