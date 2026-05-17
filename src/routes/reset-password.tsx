import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password · The Dispute Playbook" },
      { name: "description", content: "Choose a new password for your account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery hash and emits PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
      }
      setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setHasSession(true);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => {
        navigate({ to: "/progress", replace: true });
      }, 1200);
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
          Account · Password reset
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight md:text-4xl">
          Choose a new password.
        </h1>
        <p className="font-editorial mt-2 text-base text-foreground/75">
          {ready && !hasSession
            ? "This reset link is invalid or has expired. Request a new one from the sign-in page."
            : "Pick something at least 8 characters long. We'll sign you in once it's saved."}
        </p>
      </div>

      {ready && hasSession && !done && (
        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-3xl border-2 bg-card p-6 shadow-card"
          style={{ borderColor: "color-mix(in oklab, var(--brand-magenta) 22%, transparent)" }}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              New password
            </span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Confirm new password
            </span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputCls}
            />
          </label>

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
            style={{ background: "var(--brand-ink)", color: "var(--brand-cream)" }}
          >
            {loading ? "Saving…" : "Save new password"}
          </button>
        </form>
      )}

      {done && (
        <p className="mt-8 rounded-2xl border-2 border-[color:var(--brand-gold)]/40 bg-card p-4 text-center text-sm">
          Password updated. Redirecting you to your progress…
        </p>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/auth" className="font-semibold underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-magenta-deep)]/40";
