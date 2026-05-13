# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> Navbar responsiveness >> hamburger opens mobile menu
- Location: tests/e2e/responsive.spec.ts:44:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('nav button')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "A1 CUTS" [ref=e4] [cursor=pointer]:
        - /url: "#hero"
        - img [ref=e6]
        - generic [ref=e12]: A1 CUTS
      - button [ref=e13] [cursor=pointer]:
        - img [ref=e14]
  - generic [ref=e16]:
    - generic [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]: EST. 2010
        - generic [ref=e22]: COLUMBIA, SC
      - heading "A1 CUTS" [level=1] [ref=e23]:
        - text: A1
        - text: CUTS
    - paragraph [ref=e24]:
      - text: Premium cuts. Classic craft.
      - text: Walk in looking good, walk out looking great.
    - generic [ref=e25]:
      - link "CALL TO BOOK" [ref=e26] [cursor=pointer]:
        - /url: tel:8037832993
        - img [ref=e27]
        - text: CALL TO BOOK
      - link "VIEW SERVICES" [ref=e29] [cursor=pointer]:
        - /url: "#services"
        - text: VIEW SERVICES
        - img [ref=e30]
    - generic [ref=e32]:
      - generic [ref=e33]:
        - generic [ref=e34]: 10+
        - generic [ref=e35]: Years Open
      - generic [ref=e36]:
        - generic [ref=e37]: "3"
        - generic [ref=e38]: Expert Barbers
      - generic [ref=e39]:
        - generic [ref=e40]: 5★
        - generic [ref=e41]: Rated
  - generic [ref=e43]:
    - generic [ref=e44]:
      - generic [ref=e45]:
        - img [ref=e46]
        - generic [ref=e52]: What We Do
      - heading "Services" [level=2] [ref=e53]
    - generic [ref=e54]:
      - generic [ref=e55]:
        - heading "Classic Cut" [level=3] [ref=e57]
        - paragraph [ref=e58]: Clean, sharp, timeless.
        - generic [ref=e59]:
          - generic [ref=e60]: $25
          - img [ref=e61]
      - generic [ref=e63]:
        - generic [ref=e64]:
          - heading "Fade" [level=3] [ref=e65]
          - generic [ref=e66]: POPULAR
        - paragraph [ref=e67]: Low, mid, or high — dialed in.
        - generic [ref=e68]:
          - generic [ref=e69]: $30
          - img [ref=e70]
      - generic [ref=e72]:
        - heading "Beard Trim" [level=3] [ref=e74]
        - paragraph [ref=e75]: Lined up and looking right.
        - generic [ref=e76]:
          - generic [ref=e77]: $15
          - img [ref=e78]
      - generic [ref=e80]:
        - generic [ref=e81]:
          - heading "Cut + Beard" [level=3] [ref=e82]
          - generic [ref=e83]: POPULAR
        - paragraph [ref=e84]: The full treatment.
        - generic [ref=e85]:
          - generic [ref=e86]: $40
          - img [ref=e87]
      - generic [ref=e89]:
        - heading "Hot Towel Shave" [level=3] [ref=e91]
        - paragraph [ref=e92]: Old school. The real deal.
        - generic [ref=e93]:
          - generic [ref=e94]: $35
          - img [ref=e95]
      - generic [ref=e97]:
        - heading "Kid's Cut" [level=3] [ref=e99]
        - paragraph [ref=e100]: Ages 12 and under.
        - generic [ref=e101]:
          - generic [ref=e102]: $18
          - img [ref=e103]
  - generic [ref=e106]:
    - generic [ref=e107]:
      - generic [ref=e108]:
        - img [ref=e109]
        - generic [ref=e112]: The Team
      - heading "Your Barbers" [level=2] [ref=e113]
    - generic [ref=e114]:
      - generic [ref=e115]:
        - img [ref=e117]
        - heading "Marcus" [level=3] [ref=e123]
        - paragraph [ref=e124]: Master Barber
        - paragraph [ref=e126]: Fades & Tapers
        - paragraph [ref=e127]: 12 yrs experience
      - generic [ref=e128]:
        - img [ref=e130]
        - heading "DeShawn" [level=3] [ref=e136]
        - paragraph [ref=e137]: Senior Barber
        - paragraph [ref=e139]: Beards & Lineups
        - paragraph [ref=e140]: 8 yrs experience
      - generic [ref=e141]:
        - img [ref=e143]
        - heading "Ray" [level=3] [ref=e149]
        - paragraph [ref=e150]: Barber
        - paragraph [ref=e152]: Classic Cuts
        - paragraph [ref=e153]: 4 yrs experience
  - generic [ref=e155]:
    - generic [ref=e156]:
      - generic [ref=e157]:
        - img [ref=e158]
        - generic [ref=e161]: Find Us
      - heading "Contact & Hours" [level=2] [ref=e162]
    - generic [ref=e163]:
      - generic [ref=e164]:
        - generic [ref=e165]:
          - img [ref=e166]
          - generic [ref=e169]: Location
        - paragraph [ref=e171]:
          - text: "1314 Leesburg Rd #D"
          - text: Columbia, SC 29209
        - link "Get Directions" [ref=e172] [cursor=pointer]:
          - /url: https://maps.google.com/?q=1314+Leesburg+Rd+%23D+Columbia+SC+29209
          - text: Get Directions
          - img [ref=e173]
      - generic [ref=e175]:
        - generic [ref=e176]:
          - img [ref=e177]
          - generic [ref=e180]: Hours
        - generic [ref=e182]:
          - generic [ref=e183]:
            - generic [ref=e184]: Mon – Fri
            - generic [ref=e185]: 9AM – 7PM
          - generic [ref=e186]:
            - generic [ref=e187]: Saturday
            - generic [ref=e188]: 9AM – 6PM
          - generic [ref=e189]:
            - generic [ref=e190]: Sunday
            - generic [ref=e191]: Closed
      - generic [ref=e192]:
        - generic [ref=e193]:
          - img [ref=e194]
          - generic [ref=e196]: Book
        - paragraph [ref=e198]:
          - text: Walk-ins welcome.
          - text: Appointments recommended.
        - link "(803) 783-2993" [ref=e199] [cursor=pointer]:
          - /url: tel:8037832993
          - img [ref=e200]
          - text: (803) 783-2993
  - contentinfo [ref=e202]:
    - generic [ref=e203]:
      - generic [ref=e204]:
        - img [ref=e206]
        - generic [ref=e212]: A1 CUTS
      - generic [ref=e213]: © 2025 A1 Cuts · Columbia, SC
  - button "Open Next.js Dev Tools" [ref=e219] [cursor=pointer]:
    - img [ref=e220]
  - alert [ref=e223]
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
> 47  |       await page.locator("nav button").click();
      |                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  76  |     await expect(page.locator("text=Expert Barbers")).toBeVisible();
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
```