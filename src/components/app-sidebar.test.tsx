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
  await screen.findByRole("link", { name: /cover/i });
  return trigger;
}

describe("AppSidebar mobile sheet", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("closes the sheet and returns focus to the trigger when an internal link is tapped", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const trigger = await openSheet(user);

    const coverLink = screen.getByRole("link", { name: /cover/i });
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
