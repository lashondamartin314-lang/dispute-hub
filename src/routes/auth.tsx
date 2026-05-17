import { useState } from "react";
import { createFileRoute, useRouter, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    mode: (search.mode === "signup" ? "signup" : "signin") as Mode,
  }),
  head: () => ({
    meta: [
      { title: "Sign in · The Dispute Playbook" },
      { name: "description", content: "Sign in or create your account to save your phase progress and earn milestone badges." },
    ],
  }),
  component: AuthPage,
});

function safeRedirect(target: string | undefined): string {
  if (!target) return "/progress";
  // Only allow same-origin internal paths
  if (target.startsWith("/") && !target.startsWith("//")) return target;
  return "/progress";
}

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const target = safeRedirect(search.redirect);
  const [mode, setMode] = useState<Mode>(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectTo = `${window.location.origin}${target}`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        setError("Check your email to confirm your account, then sign in.");
        setMode("signin");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setError("Check your email for a link to reset your password.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await router.invalidate();
        await navigate({ to: target as string, replace: true } as Parameters<typeof navigate>[0]);
        if (typeof window !== "undefined" && window.location.pathname !== target) {
          window.location.assign(target);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="text-center">
        <p className="eyebrow" style={{ color: "var(--brand-magenta-deep)" }}>
          Your progress · Your badges
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight md:text-4xl">
          {mode === "signin" ? "Welcome back, Cousin." : "Save your progress."}
        </h1>
        <p className="font-editorial mt-2 text-base text-foreground/75">
          {mode === "signin"
            ? "Sign in to see your milestone badges across devices."
            : "Create an account so every phase you finish earns a badge that's saved to your profile."}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-3xl border-2 bg-card p-6 shadow-card"
        style={{
          borderColor: "color-mix(in oklab, var(--brand-magenta) 22%, transparent)",
        }}
      >
        {mode === "signup" && (
          <Field label="Display name (optional)">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={80}
              className={inputCls}
              placeholder="Cousin Shonda"
            />
          </Field>
        )}
        <Field label="Email">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </Field>

        {error && (
          <p
            className="rounded-md border px-3 py-2 text-sm"
            style={{
              borderColor: "color-mix(in oklab, var(--brand-magenta) 30%, transparent)",
              color: "var(--brand-magenta-deep)",
              background: "color-mix(in oklab, var(--brand-magenta) 6%, var(--card))",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0",
          )}
          style={{
            background: "var(--brand-ink)",
            color: "var(--brand-cream)",
          }}
        >
          {loading ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setMode((m) => (m === "signin" ? "signup" : "signin"));
          }}
          className="block w-full text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have one? Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Just browsing?{" "}
        <Link to="/playbook" className="font-semibold underline-offset-4 hover:underline">
          Back to the Playbook
        </Link>
      </p>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-magenta-deep)]/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
