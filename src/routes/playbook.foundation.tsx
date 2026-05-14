import { createFileRoute } from "@tanstack/react-router";
import { EditorialHeader } from "@/components/editorial-header";
import { Ref } from "@/components/ref";
import { PHASES } from "@/data/phases";

export const Route = createFileRoute("/playbook/foundation")({
  head: () => ({
    meta: [
      { title: "Foundation · The Dispute Playbook" },
      { name: "description", content: "Read this first. The truth about the dispute process, how the Playbook is structured, and the difference between Phases and Rounds." },
    ],
  }),
  component: FoundationPage,
});

function FoundationPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24 space-y-24">
      <EditorialHeader
        eyebrow="Before you start · The truth"
        numeral="i"
        numeralColor="var(--brand-magenta)"
        title="The truth about this process."
        lede="Understand this upfront and you will finish the journey while others quit halfway. This is the most important page in the kit."
      />

      <section className="space-y-10">
        {[
          { n: "01", t: "Not all accounts are equal", b: "Some accounts delete quickly because they are newer errors or furnisher mistakes. Others fight back for months because the furnisher has documentation. Medical collections often delete faster than credit card charge-offs. Student loans and mortgages run on different rules entirely. The kit accounts for all of it." },
          { n: "02", t: "Your score will move", b: "Your score might dip before it rises. That is data shifting, not failure. New negative marks may appear as old ones get removed because the bureaus catch up. Utilization changes can swing your score 20 to 50 points in a single month. None of that means you did anything wrong. The work continues." },
          { n: "03", t: "They will resist", b: "The credit industry profits from keeping negative data on your file. The bureaus have zero incentive to help you. When they stall or send a generic response, that is the system working as designed. This kit counters their standard tactics with strategy that holds up under that pressure." },
          { n: "04", t: "The timeline reality", b: "Real transformation usually shows between months three and nine. Do not expect linear progress. You might see 40-point jumps followed by plateaus. That is not the kit failing. That is the system working." },
        ].map((s) => (
          <article key={s.n} className="space-y-3">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-5xl text-[color:var(--brand-gold)]">{s.n}</span>
              <h3 className="font-display text-2xl md:text-3xl">{s.t}</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed pl-1">{s.b}</p>
          </article>
        ))}

        <div className="grid grid-cols-3 gap-4 pt-4">
          {[
            { n: "30", l: "Days per round", s: "FCRA §611(a)(1)(A) bureau investigation window." },
            { n: "5–7", l: "Weeks per round", s: "Mailing time both ways added to the response window." },
            { n: "6–12", l: "Months total", s: "Full damaged-to-stable journey for a typical file." },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-border bg-card p-5">
              <div className="font-display text-4xl text-[color:var(--brand-magenta)] md:text-5xl">{s.n}</div>
              <p className="eyebrow mt-2">{s.l}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.s}</p>
            </div>
          ))}
        </div>

        <blockquote className="font-editorial border-l-2 border-[color:var(--brand-gold)] pl-6 text-xl text-foreground/85 md:text-2xl">
          Credit repair is progress through correction, not just removal.
        </blockquote>
      </section>

      <section id="phases-rounds" className="space-y-8 scroll-mt-20">
        <EditorialHeader
          eyebrow="Foundation · Read this first"
          title={<>Phases <em className="font-editorial text-[color:var(--brand-magenta)]">&</em> Rounds.</>}
          lede="Two different units of work. Confuse them and the whole system slows down."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-[color:color-mix(in_oklab,var(--brand-peach)_30%,var(--card))] p-6">
            <p className="eyebrow">Phases</p>
            <h3 className="font-display mt-2 text-3xl">Stages of work.</h3>
            <p className="mt-4 text-foreground/80"><strong>Six stages. Each a different kind of work.</strong> You walk through them in order. Finish one. Start the next. <Ref to="phase-prepare">Phase 1</Ref> reveals which phases your file actually needs.</p>
          </div>
          <div className="rounded-2xl border border-border bg-[color:color-mix(in_oklab,var(--brand-sage-soft)_60%,var(--card))] p-6">
            <p className="eyebrow">Rounds</p>
            <h3 className="font-display mt-2 text-3xl">Letters back and forth.</h3>
            <p className="mt-4 text-foreground/80"><strong>A round is a letter.</strong> You write to a bureau or furnisher. They write back, or stay silent past 30 days. That exchange is one round. Each new round is a stronger letter on the same account.</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="eyebrow">How they fit together</p>
          {PHASES.map((p) => (
            <div key={p.id} className="flex items-center gap-5 rounded-xl border border-border bg-card p-5">
              <div className="font-display text-4xl w-10 text-center" style={{ color: `var(${p.colorVar}-deep)` }}>{p.number}</div>
              <div className="flex-1">
                <h4 className="font-display text-xl" style={{ color: `var(${p.colorVar}-deep)` }}>{p.name.toUpperCase()}</h4>
                <p className="text-sm text-foreground/75">{p.lede}</p>
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {p.rounds === 0 ? "No rounds" : `${p.rounds} round${p.rounds > 1 ? "s" : ""}`}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
