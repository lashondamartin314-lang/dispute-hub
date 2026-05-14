import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import appCss from "../styles.css?url";

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
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <SidebarInset className="bg-transparent">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md">
              <SidebarTrigger />
              <div className="font-editorial text-sm text-muted-foreground">Credit Academy · The Dispute Playbook</div>
            </header>
            <main className="flex-1">
              <Outlet />
            </main>
            <footer className="border-t border-border/60 px-6 py-8 text-center text-xs text-muted-foreground">
              <p>Educational only · Not legal advice. © {new Date().getFullYear()} Shonda Martin · Credit Academy.</p>
            </footer>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
