# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> Navbar responsiveness >> logo is visible on all screens
- Location: tests/e2e/responsive.spec.ts:19:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=A1 CUTS')
Expected: visible
Error: strict mode violation: locator('text=A1 CUTS') resolved to 3 elements:
    1) <span class="font-bold text-[#C9A84C] tracking-[0.2em] text-lg">A1 CUTS</span> aka getByRole('link', { name: 'A1 CUTS' })
    2) <span class="text-[#C9A84C] text-xs tracking-[0.2em] font-sans">A1 CUTS</span> aka getByRole('contentinfo').getByText('A1 CUTS', { exact: true })
    3) <p class="text-[#333] text-xs font-sans tracking-wide">© 2025 A1 Cuts · Columbia, SC</p> aka getByText('© 2025 A1 Cuts · Columbia, SC')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=A1 CUTS')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
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
    - paragraph [ref=e24]: Premium cuts. Classic craft. Walk in looking good, walk out looking great.
    - generic [ref=e25]:
      - link "CALL TO BOOK" [ref=e26] [cursor=pointer]:
        - /url: tel:8037832993
        - img
        - text: CALL TO BOOK
      - link "VIEW SERVICES" [ref=e27] [cursor=pointer]:
        - /url: "#services"
        - text: VIEW SERVICES
        - img
    - generic [ref=e28]:
      - generic [ref=e29]:
        - generic [ref=e30]: 10+
        - generic [ref=e31]: Years Open
      - generic [ref=e32]:
        - generic [ref=e33]: "3"
        - generic [ref=e34]: Expert Barbers
      - generic [ref=e35]:
        - generic [ref=e36]: 5★
        - generic [ref=e37]: Rated
  - generic [ref=e39]:
    - generic [ref=e40]:
      - img [ref=e41]
      - generic [ref=e47]: What We Do
    - heading "Services" [level=2] [ref=e48]
    - generic [ref=e49]:
      - generic [ref=e51]:
        - heading "Classic Cut" [level=3] [ref=e53]
        - paragraph [ref=e54]: Clean, sharp, timeless.
        - generic [ref=e55]:
          - generic [ref=e56]: $25
          - img [ref=e57]
      - generic [ref=e60]:
        - generic [ref=e61]:
          - heading "Fade" [level=3] [ref=e62]
          - generic [ref=e63]: POPULAR
        - paragraph [ref=e64]: Low, mid, or high — dialed in.
        - generic [ref=e65]:
          - generic [ref=e66]: $30
          - img [ref=e67]
      - generic [ref=e70]:
        - heading "Beard Trim" [level=3] [ref=e72]
        - paragraph [ref=e73]: Lined up and looking right.
        - generic [ref=e74]:
          - generic [ref=e75]: $15
          - img [ref=e76]
      - generic [ref=e79]:
        - generic [ref=e80]:
          - heading "Cut + Beard" [level=3] [ref=e81]
          - generic [ref=e82]: POPULAR
        - paragraph [ref=e83]: The full treatment.
        - generic [ref=e84]:
          - generic [ref=e85]: $40
          - img [ref=e86]
      - generic [ref=e89]:
        - heading "Hot Towel Shave" [level=3] [ref=e91]
        - paragraph [ref=e92]: Old school. The real deal.
        - generic [ref=e93]:
          - generic [ref=e94]: $35
          - img [ref=e95]
      - generic [ref=e98]:
        - heading "Kid's Cut" [level=3] [ref=e100]
        - paragraph [ref=e101]: Ages 12 and under.
        - generic [ref=e102]:
          - generic [ref=e103]: $18
          - img [ref=e104]
  - generic [ref=e107]:
    - generic [ref=e108]:
      - img [ref=e109]
      - generic [ref=e112]: The Team
    - heading "Your Barbers" [level=2] [ref=e113]
    - generic [ref=e114]:
      - generic [ref=e116]:
        - img [ref=e118]
        - heading "Marcus" [level=3] [ref=e124]
        - paragraph [ref=e125]: Master Barber
        - separator
        - paragraph [ref=e126]: Fades & Tapers
        - paragraph [ref=e127]: 12 yrs experience
      - generic [ref=e129]:
        - img [ref=e131]
        - heading "DeShawn" [level=3] [ref=e137]
        - paragraph [ref=e138]: Senior Barber
        - separator
        - paragraph [ref=e139]: Beards & Lineups
        - paragraph [ref=e140]: 8 yrs experience
      - generic [ref=e142]:
        - img [ref=e144]
        - heading "Ray" [level=3] [ref=e150]
        - paragraph [ref=e151]: Barber
        - separator
        - paragraph [ref=e152]: Classic Cuts
        - paragraph [ref=e153]: 4 yrs experience
  - generic [ref=e155]:
    - generic [ref=e156]:
      - img [ref=e157]
      - generic [ref=e160]: Find Us
    - heading "Contact & Hours" [level=2] [ref=e161]
    - generic [ref=e162]:
      - generic [ref=e164]:
        - generic [ref=e165]:
          - img [ref=e166]
          - generic [ref=e169]: Location
        - paragraph [ref=e170]:
          - text: "1314 Leesburg Rd #D"
          - text: Columbia, SC 29209
        - link "Get Directions" [ref=e171] [cursor=pointer]:
          - /url: https://maps.google.com/?q=1314+Leesburg+Rd+%23D+Columbia+SC+29209
          - text: Get Directions
          - img [ref=e172]
      - generic [ref=e175]:
        - generic [ref=e176]:
          - img [ref=e177]
          - generic [ref=e180]: Hours
        - generic [ref=e181]:
          - generic [ref=e182]:
            - generic [ref=e183]: Mon – Fri
            - generic [ref=e184]: 9AM – 7PM
          - generic [ref=e185]:
            - generic [ref=e186]: Saturday
            - generic [ref=e187]: 9AM – 6PM
          - generic [ref=e188]:
            - generic [ref=e189]: Sunday
            - generic [ref=e190]: Closed
      - generic [ref=e192]:
        - generic [ref=e193]:
          - img [ref=e194]
          - generic [ref=e196]: Book
        - paragraph [ref=e197]:
          - text: Walk-ins welcome.
          - text: Appointments recommended.
        - link "(803) 783-2993" [ref=e198] [cursor=pointer]:
          - /url: tel:8037832993
          - img
          - text: (803) 783-2993
  - contentinfo [ref=e199]:
    - generic [ref=e200]:
      - generic [ref=e201]:
        - img [ref=e203]
        - generic [ref=e209]: A1 CUTS
      - paragraph [ref=e210]: © 2025 A1 Cuts · Columbia, SC
```

# Test source

```ts
  1   | import { test, expect, Page } from "@playwright/test";
  2   | 
  3   | // Helper: check that an element is visible and within the viewport
  4   | async function isVisibleInViewport(page: Page, selector: string) {
  5   |   const el = page.locator(selector);
> 6   |   await expect(el).toBeVisible();
      |                    ^ Error: expect(locator).toBeVisible() failed
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
  20  |     await isVisibleInViewport(page, "text=A1 CUTS");
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
```