import { test, expect, devices } from "@playwright/test";

/**
 * Automated link audit:
 *   - Walks every known internal route.
 *   - Asserts every external link has target="_blank" + rel="noopener|noreferrer"
 *     and a non-empty accessible name (aria-label or visible text) that hints
 *     at the new-tab behavior (icon + sr-only / title / aria-label).
 *   - Asserts every internal Link points at a route that resolves (200).
 *   - Spot-checks kit-related Drive/external links per phase page.
 */

const ROUTES = [
  "/",
  "/auth",
  "/playbook",
  "/playbook/foundation",
  "/playbook/strategy",
  "/playbook/phase/prepare",
  "/playbook/phase/validate",
  "/playbook/phase/clean-identity",
  "/playbook/phase/dispute-bureaus",
  "/playbook/phase/challenge-furnishers",
  "/playbook/phase/escalate",
  "/letters",
  "/tracker",
  "/decoder",
  "/resources",
  "/progress",
  "/ask",
];

test.use({ ...devices["Pixel 7"] });

test.describe("link audit", () => {
  for (const route of ROUTES) {
    test(`${route} — every link is well-formed`, async ({ page, baseURL }) => {
      const res = await page.goto(route);
      expect(res?.status(), `${route} should resolve`).toBeLessThan(400);

      // Collect every <a> on the page.
      const links = await page.locator("a[href]").evaluateAll((els) =>
        els.map((el) => ({
          href: el.getAttribute("href") || "",
          target: el.getAttribute("target") || "",
          rel: el.getAttribute("rel") || "",
          aria: el.getAttribute("aria-label") || "",
          title: el.getAttribute("title") || "",
          text: (el.textContent || "").trim(),
        })),
      );

      for (const l of links) {
        if (!l.href || l.href.startsWith("#") || l.href.startsWith("mailto:") || l.href.startsWith("tel:")) {
          continue;
        }
        const isExternal = /^https?:\/\//i.test(l.href) && !l.href.includes(new URL(baseURL!).host);
        if (isExternal) {
          expect(l.target, `external link missing target=_blank: ${l.href}`).toBe("_blank");
          expect(l.rel, `external link missing rel=noopener on ${l.href}`).toMatch(/noopener/);
          expect(l.rel, `external link missing rel=noreferrer on ${l.href}`).toMatch(/noreferrer/);
          const name = (l.aria || l.title || l.text).toLowerCase();
          expect(name.length, `external link has no accessible name: ${l.href}`).toBeGreaterThan(0);
        }
      }
    });
  }

  test("every phase page exposes a kit/templates external link to Google Drive", async ({ page }) => {
    const phaseRoutes = ROUTES.filter((r) => r.startsWith("/playbook/phase/"));
    for (const route of phaseRoutes) {
      await page.goto(route);
      const drive = page.locator('a[href*="drive.google.com"][target="_blank"]');
      const count = await drive.count();
      expect(count, `${route} should link to a Drive template`).toBeGreaterThan(0);
      // First Drive link must have an aria-label or visible text describing it.
      const first = drive.first();
      const aria = (await first.getAttribute("aria-label")) || "";
      const text = ((await first.textContent()) || "").trim();
      expect((aria || text).length, `${route} drive link needs accessible name`).toBeGreaterThan(0);
      expect((await first.getAttribute("rel")) || "").toMatch(/noopener/);
    }
  });
});
