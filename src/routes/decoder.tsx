import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  ScrollText,
  ArrowUpRight,
  BookOpen,
  Sparkles,
  ClipboardPlus,
  Keyboard,
} from "lucide-react";
import { toast } from "sonner";
import { EditorialHeader } from "@/components/editorial-header";
import { cn } from "@/lib/utils";
import {
  BUREAU_RESPONSES,
  RESPONSE_CATEGORIES,
  SEVERITY_LABEL,
  searchResponses,
  type ResponseCategory,
  type ResponseSeverity,
  type BureauResponse,
} from "@/data/bureau-responses";
import { LETTERS_BY_ID, type LetterId } from "@/data/letters";
import { appendTrackerEntry } from "@/lib/tracker-storage";

export const Route = createFileRoute("/decoder")({
  head: () => ({
    meta: [
      { title: "Bureau Response Decoder · The Dispute Playbook" },
      {
        name: "description",
        content:
          "Translate bureau dispute responses — 'verified,' 'remains,' 'frivolous,' 'updated,' 'deleted' — into plain English with the next best move.",
      },
      {
        property: "og:title",
        content: "Bureau Response Decoder · Credit Academy",
      },
      {
        property: "og:description",
        content:
          "Decode what the credit bureaus actually mean — and exactly what to do next.",
      },
    ],
  }),
  component: DecoderPage,
});

const SEVERITY_TOKEN: Record<
  ResponseSeverity,
  { color: string; bg: string; ring: string; icon: typeof CheckCircle2 }
> = {
  good: {
    color: "var(--phase-1-deep)",
    bg: "color-mix(in oklab, var(--phase-1) 14%, var(--brand-paper))",
    ring: "color-mix(in oklab, var(--phase-1) 45%, transparent)",
    icon: CheckCircle2,
  },
  neutral: {
    color: "var(--brand-ink)",
    bg: "color-mix(in oklab, var(--brand-ink) 6%, var(--brand-paper))",
    ring: "color-mix(in oklab, var(--brand-ink) 22%, transparent)",
    icon: Info,
  },
  warning: {
    color: "var(--brand-gold-deep)",
    bg: "color-mix(in oklab, var(--brand-gold) 16%, var(--brand-paper))",
    ring: "color-mix(in oklab, var(--brand-gold) 50%, transparent)",
    icon: AlertTriangle,
  },
  bad: {
    color: "var(--brand-magenta-deep)",
    bg: "color-mix(in oklab, var(--brand-magenta) 12%, var(--brand-paper))",
    ring: "color-mix(in oklab, var(--brand-magenta) 45%, transparent)",
    icon: XCircle,
  },
};

function DecoderPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<ResponseCategory | "all">("all");

  const filtered = useMemo(() => {
    let list: BureauResponse[] = searchResponses(query);
    if (activeCat !== "all") list = list.filter((r) => r.category === activeCat);
    return list;
  }, [query, activeCat]);

  const counts = useMemo(() => {
    const c: Record<ResponseSeverity, number> = {
      good: 0,
      neutral: 0,
      warning: 0,
      bad: 0,
    };
    BUREAU_RESPONSES.forEach((r) => c[r.severity]++);
    return c;
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <EditorialHeader
        eyebrow="Companion tool · Response decoder"
        numeral="?"
        numeralColor="var(--brand-magenta)"
        accentColor="var(--brand-magenta-deep)"
        title={
          <>
            What the bureaus
            <br />
            <em className="font-editorial italic text-[color:var(--brand-magenta-deep)]">
              actually
            </em>{" "}
            mean.
          </>
        }
        lede="Paste, search, or scroll. Every common dispute response — verified, remains, frivolous, updated, deleted — translated into plain English with the right next move."
      />

      {/* Severity legend */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.keys(counts) as ResponseSeverity[]).map((sev) => {
          const tok = SEVERITY_TOKEN[sev];
          const Icon = tok.icon;
          return (
            <div
              key={sev}
              className="flex items-center gap-3 rounded-2xl border-2 p-3"
              style={{ borderColor: tok.ring, background: tok.bg }}
            >
              <span
                className="inline-flex size-9 items-center justify-center rounded-xl text-[color:var(--brand-cream)]"
                style={{ background: tok.color }}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p
                  className="eyebrow text-[10px]"
                  style={{ color: tok.color }}
                >
                  {SEVERITY_LABEL[sev]}
                </p>
                <p className="font-display text-lg leading-none">
                  {counts[sev]}{" "}
                  <span className="text-xs font-sans text-muted-foreground">
                    phrases
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search bar */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search bureau response phrases</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a phrase from your bureau letter — e.g. 'verified', 'remains', 'frivolous'"
            className="w-full rounded-full border-2 border-border bg-card py-3 pl-11 pr-12 text-sm font-medium shadow-card outline-none transition-colors focus:border-[color:var(--brand-magenta)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
        <p className="text-xs text-muted-foreground md:w-48 md:text-right">
          Showing <strong className="text-foreground">{filtered.length}</strong> of{" "}
          {BUREAU_RESPONSES.length}
        </p>
      </div>

      {/* Category chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        <CategoryChip
          active={activeCat === "all"}
          onClick={() => setActiveCat("all")}
        >
          All
        </CategoryChip>
        {RESPONSE_CATEGORIES.map((c) => (
          <CategoryChip
            key={c.id}
            active={activeCat === c.id}
            onClick={() => setActiveCat(c.id)}
          >
            {c.label}
          </CategoryChip>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-16 rounded-3xl border-2 border-dashed border-border p-12 text-center">
          <p className="font-display text-2xl">No match yet.</p>
          <p className="mt-2 text-muted-foreground">
            Try a shorter phrase or pick a category. If your letter says
            something we haven't catalogued, screenshot it and add it to the
            tracker — Shonda updates this list often.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filtered.map((r) => (
            <li key={r.id}>
              <ResponseCard response={r} />
            </li>
          ))}
        </ul>
      )}

      {/* Footer CTAs */}
      <section className="mt-16 grid gap-4 md:grid-cols-2">
        <Link
          to="/tracker"
          className="group flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <span
            className="inline-flex size-12 items-center justify-center rounded-2xl text-[color:var(--brand-cream)]"
            style={{ background: "var(--brand-magenta-deep)" }}
          >
            <ScrollText className="size-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="eyebrow text-[10px]">Log the outcome</p>
            <p className="font-display text-lg leading-tight">
              Open the dispute tracker
            </p>
          </div>
          <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
        <Link
          to="/letters"
          className="group flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <span
            className="inline-flex size-12 items-center justify-center rounded-2xl text-[color:var(--brand-cream)]"
            style={{ background: "var(--brand-ink)" }}
          >
            <BookOpen className="size-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="eyebrow text-[10px]">Send the next letter</p>
            <p className="font-display text-lg leading-tight">
              Browse the letter library
            </p>
          </div>
          <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </section>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
        active
          ? "border-[color:var(--brand-magenta-deep)] bg-[color:var(--brand-magenta-deep)] text-[color:var(--brand-cream)] shadow-card"
          : "border-border bg-card text-foreground/70 hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ResponseCard({ response }: { response: BureauResponse }) {
  const tok = SEVERITY_TOKEN[response.severity];
  const Icon = tok.icon;
  const suggested =
    response.suggestedLetters
      ?.map((id) => LETTERS_BY_ID[id as keyof typeof LETTERS_BY_ID])
      .filter(Boolean) ?? [];

  return (
    <article
      className="relative flex h-full flex-col gap-4 rounded-3xl border-2 bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 md:p-7"
      style={{ borderColor: tok.ring }}
    >
      <header className="flex items-start gap-3">
        <span
          className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-2xl text-[color:var(--brand-cream)]"
          style={{ background: tok.color }}
          aria-hidden
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-[10px]" style={{ color: tok.color }}>
            {SEVERITY_LABEL[response.severity]} ·{" "}
            {RESPONSE_CATEGORIES.find((c) => c.id === response.category)?.label}
          </p>
          <h3 className="font-display mt-1 text-xl leading-tight md:text-2xl">
            “{response.phrase}”
          </h3>
          {response.aliases && response.aliases.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Also seen as: {response.aliases.join(" · ")}
            </p>
          )}
        </div>
      </header>

      <Field label="What it means" body={response.meaning} />
      <Field label="Impact on your file" body={response.impact} />
      <Field
        label="Your next move"
        body={response.nextStep}
        emphasis
        accent={tok.color}
      />

      {(suggested.length > 0 || response.citation) && (
        <footer className="mt-auto flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          {suggested.map((l) => (
            <Link
              key={l.id}
              to="/playbook/letter/$id"
              params={{ id: l.id }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-ink)] px-3 py-1.5 text-xs font-bold text-[color:var(--brand-cream)] transition-transform hover:-translate-y-0.5"
            >
              <Sparkles className="size-3" aria-hidden />
              {l.id} · {l.title}
            </Link>
          ))}
          {response.citation && (
            <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {response.citation}
            </span>
          )}
        </footer>
      )}
    </article>
  );
}

function Field({
  label,
  body,
  emphasis,
  accent,
}: {
  label: string;
  body: string;
  emphasis?: boolean;
  accent?: string;
}) {
  return (
    <div>
      <p
        className="eyebrow text-[9px]"
        style={emphasis && accent ? { color: accent } : undefined}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-sm leading-relaxed text-pretty",
          emphasis ? "font-semibold text-foreground" : "text-foreground/85",
        )}
      >
        {body}
      </p>
    </div>
  );
}
