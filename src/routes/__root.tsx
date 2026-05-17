import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";
import { DisputeHub } from "@/components/dispute-hub";
import { DisputeHubFab } from "@/components/dispute-hub-fab";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/lenis-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

const SIDEBAR_STORAGE_KEY = "sidebar:open:v1";

function PersistedSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount to avoid SSR mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (raw === "true" || raw === "false") setOpen(raw === "true");
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open));
    } catch {
      /* ignore */
    }
  }, [hydrated, open]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      {children}
    </SidebarProvider>
  );
}


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md">
        <p className="eyebrow">404</p>
        <h1 className="font-display mt-2 text-5xl">Page not found</h1>
        <p className="mt-3 text-muted-foreground">That page isn't part of this Playbook.</p>
        <a href="/" className="mt-6 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground">Back to the Hub</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md">
        <h1 className="font-display text-3xl">Something didn't load</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-5 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "The Dispute Playbook · Credit Academy" },
      { name: "description", content: "Six phases. Five rounds. The interactive companion to the Credit Academy Dispute Playbook by Shonda Martin." },
      { name: "author", content: "Shonda Martin" },
      { property: "og:title", content: "The Dispute Playbook · Credit Academy" },
      { property: "og:description", content: "An interactive, editorial companion to the six-phase, five-round credit dispute kit." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LenisProvider />
        <PersistedSidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            <MobileNavDrawer />
            <SidebarInset className="bg-transparent">
              <header
                className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-3 sm:px-4 md:px-6 backdrop-blur-md"
                style={{
                  // `--header-bg` may be a gradient — use the `background` shorthand
                  // so gradients render. `color-mix()` on a gradient silently fails
                  // and would leave the header transparent (icons invisible).
                  background: "var(--header-bg)",
                  borderColor: "var(--header-border)",
                  color: "var(--header-fg)",
                }}
              >
                <SidebarTrigger className="text-[color:var(--header-fg)] hover:bg-[color:var(--header-border)]" />
                <div
                  className="font-editorial text-xs sm:text-sm truncate"
                  style={{ color: "var(--header-muted-fg)" }}
                >
                  Credit Academy · The Dispute Playbook
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <DisputeHub />
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex-1">
                <Outlet />
              </main>
              <footer className="border-t border-border/60 px-6 py-8 text-center text-xs text-muted-foreground">
                <p>Educational only · Not legal advice. © {new Date().getFullYear()} Shonda Martin · Credit Academy.</p>
              </footer>
            </SidebarInset>
          </div>
          <CoverOnlyFab />
          <Toaster />
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function CoverOnlyFab() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/") return null;
  return <DisputeHubFab />;
}
