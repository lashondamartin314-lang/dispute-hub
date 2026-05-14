import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, FileText } from "lucide-react";
import { EditorialHeader } from "@/components/editorial-header";
import { LETTERS, LETTERS_BY_ID, type LetterId } from "@/data/letters";
import { PHASES_BY_ID } from "@/data/phases";

const ALL_IDS = LETTERS.map((l) => l.id) as LetterId[];

export const Route = createFileRoute("/playbook/letter/$id")({
  head: ({ params }) => {
    const l = LETTERS_BY_ID[params.id as LetterId];
    if (!l) return { meta: [{ title: "Letter · Dispute Playbook" }] };
    return {
      meta: [
        { title: `${l.id} · ${l.title} — Dispute Playbook` },
        { name: "description", content: l.lede },
      ],
    };
  },
  loader: ({ params }) => {
    if (!ALL_IDS.includes(params.id as LetterId)) throw notFound();
    return null;
  },
  component: LetterDetail,
});

function LetterDetail() {
  const { id } = Route.useParams();
  const letter = LETTERS_BY_ID[id as LetterId];
  const phase = PHASES_BY_ID[letter.phaseId];

  const hero = `radial-gradient(900px 480px at 12% -10%, color-mix(in oklab, var(${phase.colorVar}) 30%, transparent), transparent 60%), var(--brand-cream)`;

  return (
    <div>
      <section className="relative border-b border-border" style={{ background: hero }}>
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
          <Link to="/playbook/phase/$id" params={{ id: letter.phaseId }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3" /> Back to {phase.name}
          </Link>
          <div className="mt-6">
            <EditorialHeader
              eyebrow={`${phase.eyebrow} · Letter ${letter.id}`}
              numeral={letter.id.replace("L", "")}
              numeralColor={`var(${phase.colorVar})`}
              title={letter.title}
              lede={letter.lede}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 md:px-10 space-y-10">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-elegant">
          <p className="eyebrow">Open the template</p>
          <h2 className="font-display mt-2 text-2xl">Two ways in.</h2>
          <p className="mt-2 text-foreground/75">"Use template" creates your own copy in Google Drive — that's the working version you edit and send. "Preview" opens read-only so you can read it before committing.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={letter.copyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-[color:var(--brand-magenta-deep)]">
              Use template <ArrowUpRight className="size-4" />
            </a>
            <a href={letter.viewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:border-[color:var(--brand-gold)]">
              <FileText className="size-4" /> Preview only
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-[color:color-mix(in_oklab,var(--brand-peach)_22%,var(--card))] p-6 md:p-8">
          <p className="eyebrow text-[color:var(--brand-gold-deep)]">Send checklist</p>
          <ul className="mt-4 space-y-2 text-foreground/85">
            {[
              "Make a copy in your own Drive (don't edit the master).",
              "Replace every bracketed [field] with your actual information.",
              "Print, sign, and date.",
              "Send by USPS Certified Mail · Return Receipt Requested.",
              "Log the date sent + tracking number on your Round Tracker.",
            ].map((s) => (
              <li key={s} className="flex gap-2"><span className="text-[color:var(--brand-magenta)]">✓</span><span>{s}</span></li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
