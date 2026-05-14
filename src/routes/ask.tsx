import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitQuestion } from "@/lib/questions.functions";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Submit a Question to Shonda · The Dispute Playbook" },
      {
        name: "description",
        content:
          "Send Shonda Martin a question about your credit dispute, a stuck account, or a bureau response. She reviews submissions weekly.",
      },
    ],
  }),
  component: AskPage,
});

const TOPICS = [
  "Pulling my credit reports",
  "Drafting a dispute letter",
  "A bureau response I don't understand",
  "Furnisher / collector pushback",
  "CFPB or State AG escalation",
  "Best Pay Date / utilization",
  "Identity theft",
  "Something else",
];

const MAX_LEN = 4000;

function AskPage() {
  const submit = useServerFn(submitQuestion);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your name.";
    else if (name.trim().length > 100) next.name = "Keep your name under 100 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email.";
    if (!topic) next.topic = "Pick a topic so Shonda can route this.";
    const q = question.trim();
    if (q.length < 10) next.question = "Give Shonda a little more detail (10+ characters).";
    else if (q.length > MAX_LEN) next.question = `Please keep it under ${MAX_LEN.toLocaleString()} characters.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          name: name.trim(),
          email: email.trim(),
          topic,
          question: question.trim(),
        },
      });
      if (res.ok) {
        setDone(true);
        toast.success("Your question is in. Shonda reviews submissions weekly.");
        setName("");
        setEmail("");
        setTopic("");
        setQuestion("");
      } else {
        toast.error(res.error ?? "Could not save your question. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10 md:py-24">
      <header className="mb-10">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-gold-deep)]">
          Ask Shonda
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold leading-tight md:text-5xl">
          Submit a question to Shonda.
        </h1>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-foreground/80 md:text-lg">
          Stuck on a letter, a bureau response, or a furnisher tactic? Send the details below.
          Shonda reviews submissions weekly and answers in the monthly Q&amp;A or directly by email.
        </p>
      </header>

      {done ? (
        <div className="rounded-2xl border-2 border-[color:var(--brand-gold-deep)] bg-card p-8 shadow-card">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 size-6 text-[color:var(--brand-gold-deep)]" aria-hidden />
            <div>
              <h2 className="font-display text-2xl font-bold">Question received.</h2>
              <p className="mt-2 text-foreground/80">
                Shonda reviews questions weekly. Watch your inbox for a reply, and check the
                monthly Q&amp;A inside Credit Academy.
              </p>
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => setDone(false)}
              >
                Submit another question
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-6 rounded-2xl border-2 border-border bg-card p-6 shadow-card md:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ask-name">Your name</Label>
              <Input
                id="ask-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last"
                maxLength={100}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "ask-name-err" : undefined}
              />
              {errors.name && (
                <p id="ask-name-err" className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ask-email">Email</Label>
              <Input
                id="ask-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={255}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "ask-email-err" : undefined}
              />
              {errors.email && (
                <p id="ask-email-err" className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ask-topic">Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger id="ask-topic" aria-invalid={!!errors.topic}>
                <SelectValue placeholder="Pick the closest match" />
              </SelectTrigger>
              <SelectContent>
                {TOPICS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.topic && <p className="text-xs text-destructive">{errors.topic}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ask-question">Your question</Label>
            <Textarea
              id="ask-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Share the bureau, account, what you've already mailed, and what response (if any) you got back. The more specific, the faster Shonda can help."
              rows={8}
              maxLength={MAX_LEN}
              aria-invalid={!!errors.question}
              aria-describedby={errors.question ? "ask-question-err" : "ask-question-help"}
            />
            <div className="flex items-center justify-between">
              <p
                id={errors.question ? "ask-question-err" : "ask-question-help"}
                className={`text-xs ${errors.question ? "text-destructive" : "text-muted-foreground"}`}
              >
                {errors.question ?? "Tip: include the bureau, account name, and round number if you can."}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {question.length.toLocaleString()} / {MAX_LEN.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="size-3.5" aria-hidden />
              Replies come from Shonda's team within ~7 days.
            </p>
            <Button type="submit" disabled={submitting} className="gap-2">
              <Send className="size-4" aria-hidden />
              {submitting ? "Sending…" : "Send to Shonda"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
