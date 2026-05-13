# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> Navbar responsiveness >> hamburger opens mobile menu
- Location: tests/e2e/responsive.spec.ts:44:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=BOOK NOW')
Expected: visible
Error: strict mode violation: locator('text=BOOK NOW') resolved to 2 elements:
    1) <a href="tel:8037832993" class="group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-d…>…</a> aka getByText('Book Now', { exact: true })
    2) <a href="tel:8037832993" class="text-[#C9A84C] text-xs tracking-[0.2em] uppercase no-underline font-sans">BOOK NOW</a> aka getByRole('link', { name: 'BOOK NOW' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=BOOK NOW')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "A1 CUTS" [ref=e4] [cursor=pointer]:
        - /url: "#hero"
        - img [ref=e6]
        - generic [ref=e12]: A1 CUTS
      - button [active] [ref=e13] [cursor=pointer]:
        - img [ref=e14]
    - generic [ref=e17]:
      - link "Services" [ref=e18] [cursor=pointer]:
        - /url: "#services"
      - link "Barbers" [ref=e19] [cursor=pointer]:
        - /url: "#barbers"
      - link "Contact" [ref=e20] [cursor=pointer]:
        - /url: "#contact"
      - link "BOOK NOW" [ref=e21] [cursor=pointer]:
        - /url: tel:8037832993
  - generic [ref=e23]:
    - generic [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]: EST. 2010
        - generic [ref=e29]: COLUMBIA, SC
      - heading "A1 CUTS" [level=1] [ref=e30]:
        - text: A1
        - text: CUTS
    - paragraph [ref=e31]: Premium cuts. Classic craft. Walk in looking good, walk out looking great.
    - generic [ref=e32]:
      - link "CALL TO BOOK" [ref=e33] [cursor=pointer]:
        - /url: tel:8037832993
        - img
        - text: CALL TO BOOK
      - link "VIEW SERVICES" [ref=e34] [cursor=pointer]:
        - /url: "#services"
        - text: VIEW SERVICES
        - img
    - generic [ref=e35]:
      - generic [ref=e36]:
        - generic [ref=e37]: 10+
        - generic [ref=e38]: Years Open
      - generic [ref=e39]:
        - generic [ref=e40]: "3"
        - generic [ref=e41]: Expert Barbers
      - generic [ref=e42]:
        - generic [ref=e43]: 5★
        - generic [ref=e44]: Rated
  - generic [ref=e46]:
    - generic [ref=e47]:
      - img [ref=e48]
      - generic [ref=e54]: What We Do
    - heading "Services" [level=2] [ref=e55]
    - generic [ref=e56]:
      - generic [ref=e58]:
        - heading "Classic Cut" [level=3] [ref=e60]
        - paragraph [ref=e61]: Clean, sharp, timeless.
        - generic [ref=e62]:
          - generic [ref=e63]: $25
          - img [ref=e64]
      - generic [ref=e67]:
        - generic [ref=e68]:
          - heading "Fade" [level=3] [ref=e69]
          - generic [ref=e70]: POPULAR
        - paragraph [ref=e71]: Low, mid, or high — dialed in.
        - generic [ref=e72]:
          - generic [ref=e73]: $30
          - img [ref=e74]
      - generic [ref=e77]:
        - heading "Beard Trim" [level=3] [ref=e79]
        - paragraph [ref=e80]: Lined up and looking right.
        - generic [ref=e81]:
          - generic [ref=e82]: $15
          - img [ref=e83]
      - generic [ref=e86]:
        - generic [ref=e87]:
          - heading "Cut + Beard" [level=3] [ref=e88]
          - generic [ref=e89]: POPULAR
        - paragraph [ref=e90]: The full treatment.
        - generic [ref=e91]:
          - generic [ref=e92]: $40
          - img [ref=e93]
      - generic [ref=e96]:
        - heading "Hot Towel Shave" [level=3] [ref=e98]
        - paragraph [ref=e99]: Old school. The real deal.
        - generic [ref=e100]:
          - generic [ref=e101]: $35
          - img [ref=e102]
      - generic [ref=e105]:
        - heading "Kid's Cut" [level=3] [ref=e107]
        - paragraph [ref=e108]: Ages 12 and under.
        - generic [ref=e109]:
          - generic [ref=e110]: $18
          - img [ref=e111]
  - generic [ref=e114]:
    - generic [ref=e115]:
      - img [ref=e116]
      - generic [ref=e119]: The Team
    - heading "Your Barbers" [level=2] [ref=e120]
    - generic [ref=e121]:
      - generic [ref=e123]:
        - img [ref=e125]
        - heading "Marcus" [level=3] [ref=e131]
        - paragraph [ref=e132]: Master Barber
        - separator
        - paragraph [ref=e133]: Fades & Tapers
        - paragraph [ref=e134]: 12 yrs experience
      - generic [ref=e136]:
        - img [ref=e138]
        - heading "DeShawn" [level=3] [ref=e144]
        - paragraph [ref=e145]: Senior Barber
        - separator
        - paragraph [ref=e146]: Beards & Lineups
        - paragraph [ref=e147]: 8 yrs experience
      - generic [ref=e149]:
        - img [ref=e151]
        - heading "Ray" [level=3] [ref=e157]
        - paragraph [ref=e158]: Barber
        - separator
        - paragraph [ref=e159]: Classic Cuts
        - paragraph [ref=e160]: 4 yrs experience
  - generic [ref=e162]:
    - generic [ref=e163]:
      - img [ref=e164]
      - generic [ref=e167]: Find Us
    - heading "Contact & Hours" [level=2] [ref=e168]
    - generic [ref=e169]:
      - generic [ref=e171]:
        - generic [ref=e172]:
          - img [ref=e173]
          - generic [ref=e176]: Location
        - paragraph [ref=e177]:
          - text: "1314 Leesburg Rd #D"
          - text: Columbia, SC 29209
        - link "Get Directions" [ref=e178] [cursor=pointer]:
          - /url: https://maps.google.com/?q=1314+Leesburg+Rd+%23D+Columbia+SC+29209
          - text: Get Directions
          - img [ref=e179]
      - generic [ref=e182]:
        - generic [ref=e183]:
          - img [ref=e184]
          - generic [ref=e187]: Hours
        - generic [ref=e188]:
          - generic [ref=e189]:
            - generic [ref=e190]: Mon – Fri
            - generic [ref=e191]: 9AM – 7PM
          - generic [ref=e192]:
            - generic [ref=e193]: Saturday
            - generic [ref=e194]: 9AM – 6PM
          - generic [ref=e195]:
            - generic [ref=e196]: Sunday
            - generic [ref=e197]: Closed
      - generic [ref=e199]:
        - generic [ref=e200]:
          - img [ref=e201]
          - generic [ref=e203]: Book
        - paragraph [ref=e204]:
          - text: Walk-ins welcome.
          - text: Appointments recommended.
        - link "(803) 783-2993" [ref=e205] [cursor=pointer]:
          - /url: tel:8037832993
          - img
          - text: (803) 783-2993
  - contentinfo [ref=e206]:
    - generic [ref=e207]:
      - generic [ref=e208]:
        - img [ref=e210]
        - generic [ref=e216]: A1 CUTS
      - paragraph [ref=e217]: © 2025 A1 Cuts · Columbia, SC
  - button "Open Next.js Dev Tools" [ref=e223] [cursor=pointer]:
    - img [ref=e224]
  - alert [ref=e227]
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
> 48  |       await expect(page.locator("text=BOOK NOW")).toBeVisible();
      |                                                   ^ Error: expect(locator).toBeVisible() failed
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
  148 |     test(`no overflow at ${section}`, async ({ page }) => {
```