import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  CircleAlert,
  ChevronDown,
  CircleCheck,
  FileText,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Search,
  ShieldAlert,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { Shell } from "@/components/Shell";
import {
  analyzeResponse,
  type AnalysisResult,
  type Finding,
  type Level,
} from "@/lib/foodwise-rules";
import { LESSONS } from "@/lib/lessons";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze an AI Answer — FoodWise" },
      {
        name: "description",
        content:
          "Paste a food question and the AI's answer. FoodWise shows what it includes, what is missing, and how to verify it.",
      },
      { property: "og:title", content: "Analyze an AI Answer — FoodWise" },
      {
        property: "og:description",
        content: "Transparent, rule-based checks for AI food and nutrition answers.",
      },
    ],
  }),
  component: Analyze,
});

const SAMPLE = {
  q: "Is this granola bar healthy, and is it safe for my nut allergy?",
  a: "This granola bar is 100% healthy and definitely safe for a nut allergy. It is all-natural and has only 8 g of sugar, so you can eat it without worry.",
};

const LEVEL: Record<Level, { icon: LucideIcon; color: string; label: string }> = {
  green: { icon: CircleCheck, color: "text-ok", label: "Looks fine" },
  amber: { icon: CircleAlert, color: "text-warn", label: "Worth a check" },
  red: { icon: TriangleAlert, color: "text-bad", label: "Concern" },
};

// Findings that talk about allergies or diets (rule 4) go to the safety card. The rest go by section.
const isSafety = (f: Finding) => f.section !== "verify" && f.rules.includes(4);

function Analyze() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [errs, setErrs] = useState<{ q?: string; a?: string }>({});
  const [res, setRes] = useState<AnalysisResult | null>(null);
  const results = useRef<HTMLElement>(null);

  const run = () => {
    const e: { q?: string; a?: string } = {};
    if (q.trim().length < 5)
      e.q = "Please type the question you asked the AI (at least 5 characters).";
    if (a.trim().length < 20) e.a = "Please paste the AI's answer (at least 20 characters).";
    setErrs(e);
    if (e.q || e.a) return;
    setRes(analyzeResponse(q, a));
    setTimeout(() => results.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const reset = () => {
    setQ("");
    setA("");
    setErrs({});
    setRes(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-5 pb-6 pt-12 md:pt-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-warm">Analyze</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold sm:text-4xl md:text-5xl">
          Let&apos;s Take a Closer Look at That Answer.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Paste your original question and the AI&apos;s response. FoodWise will help you understand
          what information is included, what may be missing, and what deserves a second look.
        </p>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
          className="mt-8 space-y-5 rounded-[1.75rem] border border-border bg-card p-5 shadow-soft sm:p-7"
        >
          <Field id="q" label="Your original question" error={errs.q}>
            <textarea
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              rows={2}
              aria-invalid={!!errs.q}
              aria-describedby={errs.q ? "q-err" : undefined}
              placeholder="e.g. Which snack has more sodium per 100 g?"
              className="w-full resize-y rounded-2xl border border-input bg-background p-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30 aria-[invalid=true]:border-destructive"
            />
          </Field>
          <Field id="a" label="The AI's response" error={errs.a}>
            <textarea
              id="a"
              value={a}
              onChange={(e) => setA(e.target.value)}
              rows={9}
              aria-invalid={!!errs.a}
              aria-describedby={errs.a ? "a-err" : undefined}
              placeholder="Paste the full answer here…"
              className="w-full resize-y rounded-2xl border border-input bg-background p-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30 aria-[invalid=true]:border-destructive"
            />
          </Field>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lift transition hover:-translate-y-0.5 hover:bg-forest"
            >
              <Search className="h-5 w-5" aria-hidden /> Analyze Answer
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 text-base font-semibold text-foreground transition hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Reset
            </button>
            <button
              type="button"
              onClick={() => {
                setQ(SAMPLE.q);
                setA(SAMPLE.a);
                setErrs({});
              }}
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline sm:ml-auto"
            >
              Try a sample answer
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            The checks run in your browser using fixed rules. No AI judges the answer.
          </p>
        </form>
      </section>

      {res && <Results res={res} sectionRef={results} onReset={reset} />}
    </Shell>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-err`}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-sm text-destructive"
        >
          <CircleAlert className="h-4 w-4" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

function ResultCard({
  icon: Icon,
  title,
  count,
  tone = "default",
  open = false,
  children,
}: {
  icon: LucideIcon;
  title: string;
  count?: number;
  tone?: "default" | "safety";
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={open}
      className={`group rounded-3xl border shadow-soft ${tone === "safety" ? "border-warm/40 bg-warm-soft/60" : "border-border bg-card"}`}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone === "safety" ? "bg-warm/25 text-forest" : "bg-sage text-primary"}`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="flex-1 text-lg font-semibold sm:text-xl">{title}</h2>
        {count !== undefined && (
          <span className="rounded-full bg-background px-2.5 py-0.5 text-sm font-semibold">
            {count}
          </span>
        )}
        <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="px-4 pb-5 sm:px-5">{children}</div>
    </details>
  );
}

function FindingList({ items, empty }: { items: Finding[]; empty: string }) {
  if (!items.length)
    return <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-3">
      {items.map((f) => {
        const L = LEVEL[f.level];
        return (
          <li
            key={`${f.title}-${f.detail}`}
            className="flex gap-3 rounded-2xl bg-background/80 p-4"
          >
            <L.icon className={`mt-0.5 h-5 w-5 shrink-0 ${L.color}`} aria-label={L.label} />
            <div className="min-w-0">
              <div className="font-semibold">{f.title}</div>
              <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{f.detail}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {f.rules.map((n) => (
                  <Link
                    key={n}
                    to="/learn"
                    hash={`rule-${n}`}
                    className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-sage-deep"
                  >
                    Rule {n}
                  </Link>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Results({
  res,
  sectionRef,
  onReset,
}: {
  res: AnalysisResult;
  sectionRef: React.RefObject<HTMLElement | null>;
  onReset: () => void;
}) {
  const f = res.findings;
  const safety = f.filter(isSafety);
  const rest = f.filter((x) => !isSafety(x));
  const included = rest.filter((x) => x.section === "provided");
  const attention = rest.filter((x) => x.section === "missing" || x.section === "concerns");
  const verify = f.filter((x) => x.section === "verify");
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <section
      ref={sectionRef}
      aria-label="Results"
      className="scroll-mt-20 border-t border-border bg-muted/50 px-5 py-12"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold">Here&apos;s what we found</h2>
            <p className="mt-1 text-muted-foreground">
              A screening to help you check, not a final verdict.
            </p>
          </div>
        </div>

        <ResultCard icon={FileText} title="What the Answer Includes" count={included.length}>
          <FindingList
            items={included}
            empty="We did not find specific numbers, comparisons, or sources in this answer."
          />
        </ResultCard>

        <ResultCard
          icon={CircleAlert}
          title="What Deserves Attention"
          count={attention.length}
          open
        >
          <FindingList
            items={attention}
            empty="Nothing stood out here. You should still check the label yourself."
          />
        </ResultCard>

        <ResultCard
          icon={ShieldAlert}
          tone="safety"
          title="Potential Safety Concerns"
          count={safety.length}
          open
        >
          <FindingList
            items={safety}
            empty="No allergy or diet terms were found. If this is about an allergy or a medical diet, always check the label and ask a professional."
          />
        </ResultCard>

        <ResultCard icon={ListChecks} title="How to Verify" count={verify.length}>
          {verify.length === 0 ? (
            <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
              Compare the answer with the real product label.
            </p>
          ) : (
            <ul className="space-y-3">
              {verify.map((v) => {
                const n = v.rules[0] ?? 1;
                const id = `v-${n}`;
                return (
                  <li key={id}>
                    <label
                      htmlFor={id}
                      className="flex cursor-pointer gap-3 rounded-2xl bg-background/80 p-4 transition hover:bg-background"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={!!done[id]}
                        onChange={(e) => setDone((d) => ({ ...d, [id]: e.target.checked }))}
                        className="mt-1 h-5 w-5 shrink-0 accent-[var(--primary)]"
                      />
                      <span>
                        <span
                          className={`block font-semibold ${done[id] ? "text-muted-foreground line-through" : ""}`}
                        >
                          {LESSONS[n - 1]?.title}
                        </span>
                        <span className="mt-0.5 block text-[15px] leading-relaxed text-muted-foreground">
                          {v.detail}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </ResultCard>

        <ResultCard icon={Lightbulb} title="Your FoodWise Learning Tip">
          <ul className="space-y-2">
            {res.takeaways.map((t) => (
              <li key={t} className="flex gap-2.5 text-[15px] leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warm" />
                {t}
              </li>
            ))}
          </ul>
          {res.rules.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold">Rules to revisit</p>
              <div className="flex flex-wrap gap-2">
                {res.rules.map((n) => (
                  <Link
                    key={n}
                    to="/learn"
                    hash={`rule-${n}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-sage px-3.5 py-1.5 text-sm font-medium text-primary transition hover:bg-sage-deep"
                  >
                    {n}. {LESSONS[n - 1]?.title} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          )}
          <p className="mt-5 text-xs text-muted-foreground">
            This is a screening, not a verification. FoodWise never says an answer is accurate or
            guaranteed safe.
          </p>
        </ResultCard>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-semibold transition hover:bg-secondary"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Check another answer
        </button>
      </div>
    </section>
  );
}
