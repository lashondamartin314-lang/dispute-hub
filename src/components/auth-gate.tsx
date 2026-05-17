import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface AuthGateProps {
  /** Headline shown to visitors (e.g. "Sign in to read the Playbook"). */
  title?: string;
  /** Short explanation of why the content is gated. */
  description?: string;
  children: React.ReactNode;
}

/**
 * Client-side gate. Renders children only for authenticated users; shows a
 * sign-in / sign-up prompt for visitors with the current URL preserved as
 * the post-auth redirect target.
 */
export function AuthGate({
  title = "Members only",
  description = "Sign in to continue. Your account keeps your phase progress and badges saved across devices.",
  children,
}: AuthGateProps) {
  const { user, isLoading } = useAuth();
  const currentHref = useRouterState({ select: (s) => s.location.href });

  // When gated content mounts (auth resolves to a signed-in user), the page
  // height changes dramatically. Nudge Lenis / any scroll observers to
  // re-measure so smooth scrolling tracks the new document height.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLoading || !user) return;
    // Defer to next frame so the children have laid out first.
    const id = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
    return () => window.cancelAnimationFrame(id);
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-md items-center justify-center px-6 py-16">
        <p className="text-sm text-muted-foreground">Checking your access…</p>
      </div>
    );
  }

  if (user) return <>{children}</>;

  const redirect = currentHref?.startsWith("/auth") ? undefined : currentHref;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 md:py-24">
      <div
        className="rounded-3xl border-2 bg-card p-8 text-center shadow-card md:p-10"
        style={{
          borderColor: "color-mix(in oklab, var(--brand-magenta) 22%, transparent)",
        }}
      >
        <span
          aria-hidden="true"
          className="mx-auto mb-5 inline-flex size-12 items-center justify-center rounded-full bg-[color:var(--brand-magenta-soft)] text-[color:var(--brand-magenta-deep)]"
        >
          <Lock className="size-5" />
        </span>
        <p className="eyebrow" style={{ color: "var(--brand-magenta-deep)" }}>
          Member access
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight md:text-4xl">
          {title}
        </h1>
        <p className="font-editorial mt-3 text-base text-foreground/75">
          {description}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Link
            to="/auth"
            search={redirect ? { redirect } : undefined}
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-[color:var(--brand-cream)]"
            style={{ background: "var(--brand-ink)" }}
          >
            <LogIn className="size-4" aria-hidden="true" />
            Sign in
          </Link>
          <Link
            to="/auth"
            search={redirect ? { mode: "signup", redirect } : { mode: "signup" }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--brand-magenta)]/30 bg-[color:var(--brand-magenta-soft)] px-5 py-2.5 text-sm font-bold text-[color:var(--brand-magenta-deep)] hover:bg-[color:var(--brand-magenta)]/10"
          >
            <UserPlus className="size-4" aria-hidden="true" />
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
