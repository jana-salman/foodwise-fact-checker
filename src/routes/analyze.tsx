import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RotateCcw, Search, X } from "lucide-react";
import { Shell } from "@/components/Shell";
import { analyzeResponse, getCase, type AnalysisResult, type CaseId, type Level, type Section } from "@/lib/foodwise-rules";
import { LESSONS } from "@/lib/lessons";

export const Route = createFileRoute("/analyze")({
  validateSearch: (s: Record<string, unknown>): { case?: CaseId } =>
    ["castania", "indomie", "celiac"].includes(s["case"] as string) ? { case: s["case"] as CaseId } : {},
  head: () => ({
    meta: [
      { title: "Analyze an AI Answer — FoodWise" },
      { name: "description", content: "Paste a ChatGPT or Gemini food answer and screen it with transparent, rule-based checks." },
      { property: "og:title", content: "Analyze an AI Answer — FoodWise" },
      { property: "og:description", content: "Rule-based screening of AI nutrition answers, right in your browser." },
    ],
  }),
  component: Analyze,
});

const SECTIONS: { key: Section; label: string }[] = [
  { key: "provided", label: "What the AI provided" },
  { key: "missing", label: "What may be missing" },
  { key: "concerns", label: "Potential concerns" },
  { key: "verify", label: "How to verify" },
];
const DOT: Record<Level, string> = { green: "bg-ok", amber: "bg-warn", red: "bg-bad" };
const LBL: Record<Level, string> = { green: "Check passed", amber: "Needs review", red: "Concern" };

function Analyze() {
  const { case: caseId } = Route.useSearch();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [err, setErr] = useState("");
  const [res, setRes] = useState<AnalysisResult | null>(null);
  const c = getCase(caseId);

  useEffect(() => {
    if (c) { setQ(c.question); setA(c.answer); setRes(null); setErr(""); }
  }, [c]);

  const run = () => {
    if (a.trim().length < 20) return setErr("Please paste an AI response of at least 20 characters.");
    setErr("");
    setRes(analyzeResponse(q, a, caseId));
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
  };
  const reset = () => { setQ(""); setA(""); setRes(null); setErr(""); navigate({ to: "/analyze", search: {} }); };

  return (
    <Shell>
      <h1 className="font-display text-3xl font-semibold">Analyze an AI Answer</h1>
      <p className="text-muted-foreground mt-2 text-sm">Transparent rule-based checks run in your browser. Nothing is uploaded or stored, and no AI judges the answer.</p>
      {c && (
        <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-secondary p-3 text-sm">
          <span>Loaded <b>Case {c.number}: {c.title}</b> — reference facts will be compared.{c.illustrative && " (Illustrative statement.)"}</span>
          <button onClick={reset} aria-label="Clear case"><X className="h-4 w-4" /></button>
        </div>
      )}
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="font-semibold text-sm">What did you ask ChatGPT or Gemini?</span>
          <textarea value={q} onChange={(e) => setQ(e.target.value)} rows={2}
            className="mt-1 w-full rounded-xl border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Which has more sodium per 100 g?" />
        </label>
        <label className="block">
          <span className="font-semibold text-sm">Paste the AI response</span>
          <textarea value={a} onChange={(e) => setA(e.target.value)} rows={7}
            className="mt-1 w-full rounded-xl border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Paste the full answer here…" />
        </label>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <div className="flex flex-wrap gap-2">
          <button onClick={run} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
            <Search className="h-4 w-4" /> Analyze Response
          </button>
          {!c && <Link to="/research" className="rounded-full border px-5 py-3 text-sm font-semibold hover:bg-secondary">Load a research case</Link>}
        </div>
      </div>

      {res && (
        <section id="results" className="mt-10 space-y-6">
          <div className="flex flex-wrap gap-3 text-xs">
            {(["green", "amber", "red"] as Level[]).map((l) => (
              <span key={l} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-full ${DOT[l]}`} />{LBL[l]}</span>
            ))}
          </div>
          {SECTIONS.map((s) => {
            const items = res.findings.filter((f) => f.section === s.key);
            return (
              <div key={s.key}>
                <h2 className="font-display text-xl font-semibold mb-2">{s.label}</h2>
                {items.length === 0 ? <p className="text-sm text-muted-foreground">No findings in this category.</p> : (
                  <ul className="space-y-2">
                    {items.map((f, i) => (
                      <li key={i} className="rounded-xl border bg-card p-3 flex gap-3">
                        <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${DOT[f.level]}`} aria-label={LBL[f.level]} />
                        <div className="text-sm">
                          <div className="font-semibold">{f.title}</div>
                          <p className="text-muted-foreground mt-0.5">{f.detail}</p>
                          <p className="text-xs text-primary mt-1">{f.rules.map((r) => `Rule ${r}`).join(" · ")}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          {res.caseUsed && (
            <div className="rounded-2xl border bg-card p-4 text-sm">
              <h3 className="font-semibold mb-1">Case {res.caseUsed.number} reference facts</h3>
              <ul className="list-disc pl-5 space-y-1">{res.caseUsed.explanation.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          )}
          <div className="rounded-2xl bg-secondary p-5">
            <h2 className="font-display text-xl font-semibold">What you learned</h2>
            <ul className="list-disc pl-5 text-sm mt-2 space-y-1">{res.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
            <div className="mt-3 flex flex-wrap gap-2">
              {res.rules.map((n) => (
                <span key={n} className="rounded-full bg-card px-3 py-1 text-xs">Rule {n}: {LESSONS[n - 1]?.title}</span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">This is a screening, not a verification. FoodWise never labels a response scientifically accurate or guaranteed safe.</p>
          </div>
          <button onClick={() => { reset(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-semibold hover:bg-secondary">
            <RotateCcw className="h-4 w-4" /> Try another answer
          </button>
        </section>
      )}
    </Shell>
  );
}
