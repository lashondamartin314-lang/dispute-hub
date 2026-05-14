import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { EditorialHeader } from "@/components/editorial-header";

export const Route = createFileRoute("/playbook/")({
  head: () => ({
    meta: [
      { title: "The Dispute Playbook · Cover" },
      { name: "description", content: "The cover and entry point to the six-phase, five-round Dispute Playbook." },
    ],
  }),
  component: PlaybookCover,
});

function PlaybookCover() {
  return (
    <div className="relative min-h-[80vh]">
      <div aria-hidden className="bg-halo animate-halo-drift pointer-events-none absolute inset-0 opacity-90" />
      <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center md:py-28">
        <p className="eyebrow text-[color:var(--brand-gold-deep)]">Field Manual · Vol. I · Members Edition</p>
        <h1 className="font-display mt-6 text-6xl leading-none text-balance md:text-8xl">
          Your <em className="font-editorial bg-gradient-to-r from-[color:var(--brand-gold)] via-[color:var(--brand-magenta)] to-[color:var(--brand-violet)] bg-clip-text text-transparent not-italic">Dispute</em>
          <br />Playbook.
        </h1>
        <p className="font-editorial mt-8 max-w-2xl text-xl text-foreground/80 text-pretty md:text-2xl">
          A complete six-phase, five-round dispute system. Built on FCRA and FDCPA law. Walk through the work, slow down where it matters, finish on the other side.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/playbook/foundation" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-navy)] px-6 py-3 text-sm font-semibold text-[color:var(--brand-cream)] hover:bg-[color:var(--brand-violet-deep)]">
            Begin · Foundation <ArrowRight className="size-4" />
          </Link>
          <Link to="/playbook/strategy" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-[color:var(--brand-gold)]">
            Strategy first
          </Link>
        </div>

        <div className="mt-16 flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>Shonda Martin</span><span className="opacity-30">·</span>
          <span>Board-Certified Credit Educator</span><span className="opacity-30">·</span>
          <span>Edition 2026</span>
        </div>
      </section>
    </div>
  );
}
