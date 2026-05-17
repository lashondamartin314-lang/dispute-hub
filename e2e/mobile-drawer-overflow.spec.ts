import { test, expect, devices } from "@playwright/test";

/**
 * Mobile drawer hygiene across common phone breakpoints.
 *
 * Verifies, for each viewport:
 *   1. The page never produces horizontal overflow when the drawer is open.
 *   2. There is exactly one Home control (no duplicated Home/Cover row).
 *   3. The P1–P6 phase list is visible (every "Phase N: …" link present),
 *      i.e. the rail is not cut off the side of the panel.
 *   4. The TOC trigger (when present) opens a readable on-this-page menu.
 */

const BREAKPOINTS = [
  { name: "iphone-se", width: 320, height: 568 },
  { name: "small-android", width: 360, height: 800 },
  { name: "pixel-7", width: 412, height: 915 },
];

for (const bp of BREAKPOINTS) {
  test.describe(`mobile drawer @ ${bp.name} (${bp.width}px)`, () => {
    test.use({
      ...devices["Pixel 7"],
      viewport: { width: bp.width, height: bp.height },
    });

    test("no horizontal overflow, single Home, P1–P6 visible", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /toggle sidebar|open navigation|menu/i }).first().click();

      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();

      // No horizontal overflow on the document or on the drawer panel itself.
      const overflow = await page.evaluate(() => ({
        docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        bodyOverflow: document.body.scrollWidth - document.body.clientWidth,
      }));
      expect(overflow.docOverflow).toBeLessThanOrEqual(0);
      expect(overflow.bodyOverflow).toBeLessThanOrEqual(0);

      // Exactly one Home control inside the drawer.
      const homeLinks = dialog.getByRole("link", { name: /^home$/i });
      await expect(homeLinks).toHaveCount(1);
      // No literal "Cover" link should exist anymore.
      await expect(dialog.getByRole("link", { name: /^cover$/i })).toHaveCount(0);

      // All 6 phase links present and within the panel bounds.
      const phaseLinks = dialog.getByRole("link", { name: /^Phase [1-6]:/i });
      await expect(phaseLinks).toHaveCount(6);
      const panel = dialog.locator("aside").first();
      const panelBox = await panel.boundingBox();
      expect(panelBox).not.toBeNull();
      for (let i = 0; i < 6; i++) {
        const box = await phaseLinks.nth(i).boundingBox();
        expect(box).not.toBeNull();
        if (box && panelBox) {
          // Right edge must not exceed the drawer panel.
          expect(box.x + box.width).toBeLessThanOrEqual(panelBox.x + panelBox.width + 1);
        }
      }
    });

    test("TOC drawer opens and lists items on a phase page", async ({ page }) => {
      await page.goto("/playbook/phase/validate");
      // The mobile TOC trigger button is the floating List button.
      const tocTrigger = page.getByRole("button", { name: /on this page|table of contents/i }).first();
      if (await tocTrigger.count() === 0) test.skip(true, "no TOC on this route");
      await tocTrigger.click();
      // The TOC drawer (vaul) renders as role="dialog".
      const tocDialog = page.getByRole("dialog").filter({ hasText: /on this page/i }).first();
      await expect(tocDialog).toBeVisible();
      // At least one menu item with min-h 44 tap target.
      const items = tocDialog.locator("a[data-toc-item]");
      await expect(items.first()).toBeVisible();
      const itemBox = await items.first().boundingBox();
      expect(itemBox?.height ?? 0).toBeGreaterThanOrEqual(40);
    });
  });
}
