import { test, expect } from "@playwright/test";

/**
 * End-to-end coverage for the mobile sidebar auto-scroll behavior.
 *
 * The sidebar is long (Playbook + 6 phases + active letters), so when a
 * user opens the sheet on a deep route the active item must be visible
 * inside the viewport — not scrolled off-screen.
 *
 * We verify the behavior on a phase route that lives near the bottom of
 * the navigation list, because the bug only shows up when the active
 * item would naturally render below the fold.
 */

test.describe("mobile sidebar auto-scroll", () => {
  test("active phase is in view after opening the sheet on /playbook/phase/escalate", async ({
    page,
  }) => {
    await page.goto("/playbook/phase/escalate");

    // Open the mobile sheet via the trigger in the header.
    const trigger = page.getByRole("button", { name: /open navigation|toggle sidebar|menu/i });
    await trigger.first().click();

    // The sheet renders the same nav. Find the active link by its
    // accessible state (aria-current="page" is set by TanStack Router's
    // active link behavior on Link components).
    const activeLink = page.locator('[role="dialog"] a[aria-current="page"]').first();

    // Wait for the auto-scroll + focus to settle.
    await expect(activeLink).toBeVisible();
    await expect(activeLink).toBeInViewport();
  });

  test("falls back to the top-level active link on the cover route", async ({
    page,
  }) => {
    await page.goto("/playbook");

    const trigger = page.getByRole("button", { name: /open navigation|toggle sidebar|menu/i });
    await trigger.first().click();

    const activeLink = page.locator('[role="dialog"] a[aria-current="page"]').first();
    await expect(activeLink).toBeVisible();
    await expect(activeLink).toBeInViewport();
  });
});
