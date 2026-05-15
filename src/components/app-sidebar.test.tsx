import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

// Mutable pathname so individual tests can simulate different active routes.
let currentPathname = "/";
const setPathname = (p: string) => {
  currentPathname = p;
};

// Mock TanStack Router so AppSidebar can render outside a real router tree.
// `Link` becomes a plain anchor that still fires onClick (which the sidebar
// uses to close the mobile sheet). `useRouterState` reads from the mutable
// `currentPathname` so tests can drive the active route.
vi.mock("@tanstack/react-router", () => {
  return {
    Link: React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }>(
      ({ to, children, onClick, ...rest }, ref) => (
        <a ref={ref} href={typeof to === "string" ? to : "#"} onClick={onClick} {...rest}>
          {children}
        </a>
      ),
    ),
    useRouterState: (opts?: { select?: (s: { location: { pathname: string } }) => unknown }) => {
      const state = { location: { pathname: currentPathname } };
      return opts?.select ? opts.select(state) : currentPathname;
    },
  };
});

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function Harness() {
  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarTrigger data-testid="trigger" />
      <AppSidebar />
    </SidebarProvider>
  );
}

async function openSheet(user: ReturnType<typeof userEvent.setup>) {
  const trigger = screen.getByTestId("trigger");
  await user.click(trigger);
  // The mobile sheet is rendered into a Radix portal — wait for any link.
  await screen.findByRole("link", { name: /home/i });
  return trigger;
}

describe("AppSidebar mobile sheet", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    setPathname("/");
  });

  it("closes the sheet and returns focus to the trigger when an internal link is tapped", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const trigger = await openSheet(user);

    const coverLink = screen.getByRole("link", { name: /home/i });
    await user.click(coverLink);

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });

  it("closes the sheet and returns focus to the trigger when an external companion link is tapped", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const trigger = await openSheet(user);

    const externalLink = screen.getByRole("link", { name: /annualcreditreport/i });
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", expect.stringContaining("noopener"));

    await user.click(externalLink);

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });
});

describe("AppSidebar auto-scroll on open", () => {
  let scrollSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.body.innerHTML = "";
    setPathname("/");
    scrollSpy = vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => {});
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    scrollSpy.mockRestore();
  });

  async function openMobileSheet() {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Harness />);
    await user.click(screen.getByTestId("trigger"));
    await screen.findByRole("link", { name: /home/i });
  }

  it("scrolls the active phase link into view when the sheet opens", async () => {
    setPathname("/playbook/phase/prepare");
    await openMobileSheet();

    const phaseLink = document.querySelector<HTMLElement>(
      '[data-mobile="true"][data-sidebar="sidebar"] [data-active-scroll="phase"]',
    );
    expect(phaseLink).not.toBeNull();

    scrollSpy.mockClear();
    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    expect(scrollSpy).toHaveBeenCalled();
    expect(scrollSpy.mock.instances).toContain(phaseLink);
  });

  it("scrolls a top-level link into view when it is the active route", async () => {
    setPathname("/tracker");
    await openMobileSheet();

    const trackerLink = document.querySelector<HTMLElement>(
      '[data-mobile="true"][data-sidebar="sidebar"] [data-active-scroll="link"]',
    );
    expect(trackerLink).not.toBeNull();
    expect(trackerLink?.getAttribute("href")).toBe("/tracker");

    scrollSpy.mockClear();
    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    expect(scrollSpy.mock.instances).toContain(trackerLink);
  });

  it("falls back to the first menu item when no active sublink matches", async () => {
    setPathname("/some/unknown/route");
    await openMobileSheet();

    scrollSpy.mockClear();
    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    expect(scrollSpy).toHaveBeenCalledTimes(1);
    const sheet = document.querySelector<HTMLElement>(
      '[data-mobile="true"][data-sidebar="sidebar"]',
    );
    const firstMenuItem = sheet?.querySelector<HTMLElement>(
      '[data-sidebar="menu-button"]',
    );
    expect(firstMenuItem).toBeTruthy();
    expect(scrollSpy.mock.instances).toContain(firstMenuItem);
  });
});
