import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Mail, FileDown, ExternalLink, Clock, CheckCircle2, Folder, ArrowRight } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { EditorialHeader } from "@/components/editorial-header";
import { getMyLetters } from "@/lib/my-letters.functions";
import { LETTERS, PARENT_DRIVE_FOLDER, type LetterId } from "@/data/letters";

export const Route = createFileRoute("/my-letters")({
  head: () => ({
    meta: [
      { title: "My Letters · The Dispute Playbook" },
      {
        name: "description",
        content:
          "Every dispute letter you've prepared or sent, plus the downloadable template library.",
      },
    ],
  }),
  component: MyLettersGated,
});

function MyLettersGated() {
  return (
    <AuthGate
      title="Sign in to see your letters."
      description="We track the dispute letters you've prepared and sent so you can pick up exactly where you left off."
    >
      <MyLettersPage />
    </AuthGate>
  );
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

function MyLettersPage() {
  const fetchMine = useServerFn(getMyLetters);
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-letters"],
    queryFn: () => fetchMine({}),
  });

  const letters = data?.letters ?? [];
  const responses = data?.responses ?? [];
  const responseByLetter = new Map(responses.map((r) => [r.letter_id, r] as const));
  const templateById = new Map(LETTERS.map((l) => [l.id as string, l] as const));

  return (
    <div>
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            "radial-gradient(900px 480px at 12% -10%, color-mix(in oklab, var(--brand-pink) 60%, transparent), transparent 60%), radial-gradient(800px 420px at 100% 10%, color-mix(in oklab, var(--brand-peach) 65%, transparent), transparent 60%), var(--brand-cream)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
          <EditorialHeader
            eyebrow="Your dispute mail room"
            numeral="M"
            numeralColor="var(--brand-magenta)"
            title="My letters."
            lede="Everything you've prepared or sent, plus the full template library — one tap to copy a fresh draft into your Drive."
          />
        </div>
      </section>

      {/* SENT / PREPARED */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-[11px] text-[color:var(--brand-magenta-deep)]">Your activity</p>
              <h2 className="font-display mt-1 text-2xl font-bold md:text-3xl">Sent &amp; prepared letters</h2>
              <p className="font-editorial mt-1 text-foreground/70">
                Logged from the Dispute tracker. Add a new one any time you send a letter.
              </p>
            </div>
            <Link
              to="/tracker"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground/80 transition-all hover:-translate-y-0.5 hover:shadow-elegant"
            >
              Open tracker <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading your letters…</p>
          )}
          {error && (
            <p className="text-sm text-destructive">Couldn't load your letters. Try refreshing.</p>
          )}
          {!isLoading && !error && letters.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-background/60 p-8 text-center">
              <Mail className="mx-auto mb-3 size-6 text-muted-foreground" aria-hidden />
              <p className="font-semibold">No letters logged yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Send your first letter? Log it from the Dispute tracker so we can time the 30-day response window.
              </p>
              <Link
                to="/tracker"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-magenta)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--brand-cream)] transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                Log a letter <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          )}

          {letters.length > 0 && (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {letters.map((l) => {
                const tpl = l.letter_template_id ? templateById.get(l.letter_template_id) : undefined;
                const resp = responseByLetter.get(l.id);
                const overdue = l.response_due_at && !resp && new Date(l.response_due_at) < new Date();
                return (
                  <li
                    key={l.id}
                    className="rounded-2xl border border-border bg-background p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                          {tpl ? `${tpl.id} · ${tpl.title}` : l.letter_template_id ?? "Custom letter"}
                        </p>
                        <p className="mt-1 truncate font-display text-lg font-bold">{l.bureau_or_furnisher}</p>
                      </div>
                      {resp ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--brand-magenta-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--brand-magenta-deep)]">
                          <CheckCircle2 className="size-3" aria-hidden /> {resp.outcome}
                        </span>
                      ) : overdue ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-destructive">
                          <Clock className="size-3" aria-hidden /> Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/70">
                          <Clock className="size-3" aria-hidden /> Awaiting
                        </span>
                      )}
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-foreground/80">
                      <div>
                        <dt className="font-semibold text-muted-foreground">Sent</dt>
                        <dd>{fmtDate(l.sent_at)}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-muted-foreground">Response due</dt>
                        <dd>{fmtDate(l.response_due_at)}</dd>
                      </div>
                      {l.tracking_number && (
                        <div className="col-span-2">
                          <dt className="font-semibold text-muted-foreground">Tracking</dt>
                          <dd className="font-mono">{l.tracking_number}</dd>
                        </div>
                      )}
                    </dl>
                    {tpl && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href={tpl.viewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                        >
                          <ExternalLink className="size-3.5" aria-hidden /> View template
                        </a>
                        <a
                          href={tpl.copyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-magenta-soft)] px-3 py-1.5 text-xs font-bold text-[color:var(--brand-magenta-deep)] transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                        >
                          <FileDown className="size-3.5" aria-hidden /> Copy to Drive
                        </a>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* TEMPLATE LIBRARY */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-[11px] text-[color:var(--brand-gold-deep)]">Download templates</p>
              <h2 className="font-display mt-1 text-2xl font-bold md:text-3xl">All {LETTERS.length} letter templates</h2>
              <p className="font-editorial mt-1 text-foreground/70">
                Each link opens the Google Doc — "Copy to Drive" force-copies a clean draft into your account.
              </p>
            </div>
            <a
              href={PARENT_DRIVE_FOLDER}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground/80 transition-all hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <Folder className="size-3.5" aria-hidden /> Drive folder
            </a>
          </div>

          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {LETTERS.map((l) => (
              <li
                key={l.id}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[color:var(--brand-magenta-soft)] px-2 text-xs font-bold text-[color:var(--brand-magenta-deep)]">
                    {l.id}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-bold">{l.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-foreground/70">{l.lede}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={l.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold transition-all hover:-translate-y-0.5"
                  >
                    <ExternalLink className="size-3" aria-hidden /> View
                  </a>
                  <a
                    href={l.copyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-magenta)] px-3 py-1.5 text-[11px] font-bold text-[color:var(--brand-cream)] transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                  >
                    <FileDown className="size-3" aria-hidden /> Copy to Drive
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
