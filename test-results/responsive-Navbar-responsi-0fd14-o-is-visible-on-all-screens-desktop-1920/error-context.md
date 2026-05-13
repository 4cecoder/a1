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
      - generic [ref=e13]:
        - link "Services" [ref=e14] [cursor=pointer]:
          - /url: "#services"
        - link "Barbers" [ref=e15] [cursor=pointer]:
          - /url: "#barbers"
        - link "Contact" [ref=e16] [cursor=pointer]:
          - /url: "#contact"
        - link "Book Now" [ref=e17] [cursor=pointer]:
          - /url: tel:8037832993
          - img
          - text: Book Now
  - generic [ref=e19]:
    - generic [ref=e22]:
      - generic [ref=e23]:
        - generic [ref=e24]: EST. 2010
        - generic [ref=e25]: COLUMBIA, SC
      - heading "A1 CUTS" [level=1] [ref=e26]:
        - text: A1
        - text: CUTS
    - paragraph [ref=e27]: Premium cuts. Classic craft. Walk in looking good, walk out looking great.
    - generic [ref=e28]:
      - link "CALL TO BOOK" [ref=e29] [cursor=pointer]:
        - /url: tel:8037832993
        - img
        - text: CALL TO BOOK
      - link "VIEW SERVICES" [ref=e30] [cursor=pointer]:
        - /url: "#services"
        - text: VIEW SERVICES
        - img
    - generic [ref=e31]:
      - generic [ref=e32]:
        - generic [ref=e33]: 10+
        - generic [ref=e34]: Years Open
      - generic [ref=e35]:
        - generic [ref=e36]: "3"
        - generic [ref=e37]: Expert Barbers
      - generic [ref=e38]:
        - generic [ref=e39]: 5★
        - generic [ref=e40]: Rated
  - generic [ref=e42]:
    - generic [ref=e43]:
      - img [ref=e44]
      - generic [ref=e50]: What We Do
    - heading "Services" [level=2] [ref=e51]
    - generic [ref=e52]:
      - generic [ref=e54]:
        - heading "Classic Cut" [level=3] [ref=e56]
        - paragraph [ref=e57]: Clean, sharp, timeless.
        - generic [ref=e58]:
          - generic [ref=e59]: $25
          - img [ref=e60]
      - generic [ref=e63]:
        - generic [ref=e64]:
          - heading "Fade" [level=3] [ref=e65]
          - generic [ref=e66]: POPULAR
        - paragraph [ref=e67]: Low, mid, or high — dialed in.
        - generic [ref=e68]:
          - generic [ref=e69]: $30
          - img [ref=e70]
      - generic [ref=e73]:
        - heading "Beard Trim" [level=3] [ref=e75]
        - paragraph [ref=e76]: Lined up and looking right.
        - generic [ref=e77]:
          - generic [ref=e78]: $15
          - img [ref=e79]
      - generic [ref=e82]:
        - generic [ref=e83]:
          - heading "Cut + Beard" [level=3] [ref=e84]
          - generic [ref=e85]: POPULAR
        - paragraph [ref=e86]: The full treatment.
        - generic [ref=e87]:
          - generic [ref=e88]: $40
          - img [ref=e89]
      - generic [ref=e92]:
        - heading "Hot Towel Shave" [level=3] [ref=e94]
        - paragraph [ref=e95]: Old school. The real deal.
        - generic [ref=e96]:
          - generic [ref=e97]: $35
          - img [ref=e98]
      - generic [ref=e101]:
        - heading "Kid's Cut" [level=3] [ref=e103]
        - paragraph [ref=e104]: Ages 12 and under.
        - generic [ref=e105]:
          - generic [ref=e106]: $18
          - img [ref=e107]
  - generic [ref=e110]:
    - generic [ref=e111]:
      - img [ref=e112]
      - generic [ref=e115]: The Team
    - heading "Your Barbers" [level=2] [ref=e116]
    - generic [ref=e117]:
      - generic [ref=e119]:
        - img [ref=e121]
        - heading "Marcus" [level=3] [ref=e127]
        - paragraph [ref=e128]: Master Barber
        - separator
        - paragraph [ref=e129]: Fades & Tapers
        - paragraph [ref=e130]: 12 yrs experience
      - generic [ref=e132]:
        - img [ref=e134]
        - heading "DeShawn" [level=3] [ref=e140]
        - paragraph [ref=e141]: Senior Barber
        - separator
        - paragraph [ref=e142]: Beards & Lineups
        - paragraph [ref=e143]: 8 yrs experience
      - generic [ref=e145]:
        - img [ref=e147]
        - heading "Ray" [level=3] [ref=e153]
        - paragraph [ref=e154]: Barber
        - separator
        - paragraph [ref=e155]: Classic Cuts
        - paragraph [ref=e156]: 4 yrs experience
  - generic [ref=e158]:
    - generic [ref=e159]:
      - img [ref=e160]
      - generic [ref=e163]: Find Us
    - heading "Contact & Hours" [level=2] [ref=e164]
    - generic [ref=e165]:
      - generic [ref=e167]:
        - generic [ref=e168]:
          - img [ref=e169]
          - generic [ref=e172]: Location
        - paragraph [ref=e173]:
          - text: "1314 Leesburg Rd #D"
          - text: Columbia, SC 29209
        - link "Get Directions" [ref=e174] [cursor=pointer]:
          - /url: https://maps.google.com/?q=1314+Leesburg+Rd+%23D+Columbia+SC+29209
          - text: Get Directions
          - img [ref=e175]
      - generic [ref=e178]:
        - generic [ref=e179]:
          - img [ref=e180]
          - generic [ref=e183]: Hours
        - generic [ref=e184]:
          - generic [ref=e185]:
            - generic [ref=e186]: Mon – Fri
            - generic [ref=e187]: 9AM – 7PM
          - generic [ref=e188]:
            - generic [ref=e189]: Saturday
            - generic [ref=e190]: 9AM – 6PM
          - generic [ref=e191]:
            - generic [ref=e192]: Sunday
            - generic [ref=e193]: Closed
      - generic [ref=e195]:
        - generic [ref=e196]:
          - img [ref=e197]
          - generic [ref=e199]: Book
        - paragraph [ref=e200]:
          - text: Walk-ins welcome.
          - text: Appointments recommended.
        - link "(803) 783-2993" [ref=e201] [cursor=pointer]:
          - /url: tel:8037832993
          - img
          - text: (803) 783-2993
  - contentinfo [ref=e202]:
    - generic [ref=e203]:
      - generic [ref=e204]:
        - img [ref=e206]
        - generic [ref=e212]: A1 CUTS
      - paragraph [ref=e213]: © 2025 A1 Cuts · Columbia, SC
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