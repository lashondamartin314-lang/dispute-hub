import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Folder } from "lucide-react";
import { EditorialHeader } from "@/components/editorial-header";
import { LetterCard } from "@/components/letter-card";
import { PHASES } from "@/data/phases";
import { lettersForPhase, PARENT_DRIVE_FOLDER } from "@/data/letters";

export const Route = createFileRoute("/letters")({
  head: () => ({
    meta: [
      { title: "Letter Library · The Dispute Playbook" },
      { name: "description", content: "All 19 dispute letter templates, grouped by phase. Click to open the Google Doc and force-copy into your Drive." },
    ],
  }),
  component: LettersPage,
});

function LettersPage() {
  const phasesWithLetters = PHASES.filter((p) => lettersForPhase(p.id).length > 0);
  const totalLetters = phasesWithLetters.reduce((n, p) => n + lettersForPhase(p.id).length, 0);

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
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <EditorialHeader
            eyebrow={`The library · ${totalLetters} templates`}
            numeral="L"
            numeralColor="var(--brand-magenta)"
            title="Every letter, one click away."
            lede="Each card opens the Google Doc template in a new tab. The force-copy URL drops it straight into your Drive — your master stays clean."
          />

          {/* Quick jump strip */}
          <nav aria-label="Jump to phase" className="mt-10 flex flex-wrap gap-2">
            {phasesWithLetters.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="group inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                style={{
                  borderColor: `color-mix(in oklab, var(${p.colorVar}) 45%, transparent)`,
                  color: `var(${p.colorVar}-deep)`,
                }}
              >
                <span
                  aria-hidden
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-[color:var(--brand-cream)]"
                  style={{ background: `var(${p.colorVar})` }}
                >
                  {p.number}
                </span>
                {p.shortName}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* PHASE BANDS */}
      {phasesWithLetters.map((p, i) => {
        const letters = lettersForPhase(p.id);
        const isAlt = i % 2 === 1;

        // Distinct background per phase: tinted wash + phase-color radial glow + subtle texture
        const bandBg = isAlt
          ? `radial-gradient(700px 360px at 90% 0%, color-mix(in oklab, var(${p.colorVar}) 22%, transparent), transparent 65%), radial-gradient(600px 320px at 0% 100%, color-mix(in oklab, var(${p.colorVar}-soft) 80%, transparent), transparent 65%), color-mix(in oklab, var(${p.colorVar}-soft) 35%, var(--brand-paper))`
          : `radial-gradient(700px 360px at 10% 0%, color-mix(in oklab, var(${p.colorVar}-soft) 90%, transparent), transparent 65%), radial-gradient(600px 320px at 100% 100%, color-mix(in oklab, var(${p.colorVar}) 18%, transparent), transparent 65%), color-mix(in oklab, var(${p.colorVar}-soft) 22%, var(--brand-cream))`;

        return (
          <section
            key={p.id}
            id={p.id}
            className="relative scroll-mt-20 border-b border-border"
            style={{ background: bandBg }}
          >
            {/* Top hairline accent in phase color */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{
                background: `linear-gradient(90deg, transparent, var(${p.colorVar}) 30%, var(${p.colorVar}-deep) 70%, transparent)`,
              }}
            />

            {/* Soft noise/texture overlay */}
            <div aria-hidden className="bg-noise pointer-events-none absolute inset-0 opacity-[0.4] mix-blend-multiply" />

            <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
              {/* Phase header — oversized numeral + bold title block */}
              <header className="relative mb-12 grid grid-cols-[auto_1fr] items-center gap-6 md:gap-10">
                <div
                  aria-hidden
                  className="font-display select-none text-[110px] leading-none font-bold md:text-[180px]"
                  style={{
                    color: `var(${p.colorVar})`,
                    textShadow: `4px 4px 0 color-mix(in oklab, var(${p.colorVar}-deep) 25%, transparent)`,
                  }}
                >
                  {p.number}
                </div>
                <div className="min-w-0">
                  <p
                    className="eyebrow text-[11px]"
                    style={{ color: `var(${p.colorVar}-deep)` }}
                  >
                    {p.eyebrow}
                  </p>
                  <h2
                    className="font-display mt-1 text-3xl font-bold leading-[1.05] md:text-5xl lg:text-6xl"
                    style={{ color: `var(${p.colorVar}-deep)` }}
                  >
                    {p.name}.
                  </h2>
                  <p className="font-editorial mt-3 max-w-2xl text-base leading-snug text-foreground/80 md:text-lg">
                    {p.lede}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--brand-cream)]"
                      style={{ background: `var(${p.colorVar}-deep)` }}
                    >
                      {letters.length} letter{letters.length > 1 ? "s" : ""}
                    </span>
                    <a
                      href={PARENT_DRIVE_FOLDER}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open the Google Drive folder containing all ${phase.eyebrow} letter templates (opens in a new tab)`}
                      className="group inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                      style={{
                        borderColor: `color-mix(in oklab, var(${p.colorVar}) 50%, transparent)`,
                        color: `var(${p.colorVar}-deep)`,
                      }}
                    >
                      <Folder className="size-3.5" aria-hidden />
                      Drive folder
                    </a>
                    <Link
                      to="/playbook/phase/$id"
                      params={{ id: p.id }}
                      className="group inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                      style={{
                        borderColor: `color-mix(in oklab, var(${p.colorVar}) 50%, transparent)`,
                        color: `var(${p.colorVar}-deep)`,
                      }}
                    >
                      View full phase{" "}
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </header>

              {/* Letter grid */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {letters.map((l) => (
                  <LetterCard key={l.id} id={l.id} />
                ))}
              </div>
            </div>

            {/* Bottom divider — phase-tinted, never plain */}
            <div
              aria-hidden
              className="relative h-px w-full"
              style={{
                background: `linear-gradient(90deg, transparent, color-mix(in oklab, var(${p.colorVar}-deep) 35%, transparent), transparent)`,
              }}
            />
          </section>
        );
      })}
    </div>
  );
}
