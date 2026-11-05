import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { Shell } from "@/components/Shell";
import { CASES } from "@/lib/foodwise-rules";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Cases — FoodWise" },
      { name: "description", content: "Real examples where ChatGPT and Gemini got food labels and safety wrong." },
      { property: "og:title", content: "Research Cases — FoodWise" },
      { property: "og:description", content: "Real AI food-answer mistakes from our AGSC 205 research." },
    ],
  }),
  component: Research,
});

function Research() {
  const [sel, setSel] = useState(CASES[0].id);
  const c = CASES.find((x) => x.id === sel)!;
  return (
    <Shell>
      <h1 className="font-display text-3xl font-semibold">Our Research — Real Examples</h1>
      <p className="text-muted-foreground mt-2">Select a case, then load it into the analyzer.</p>
      <div className="grid sm:grid-cols-3 gap-3 mt-6">
        {CASES.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)}
            className={`rounded-2xl border p-4 text-left bg-card transition ${sel === x.id ? "ring-2 ring-primary" : "hover:border-primary"}`}>
            <div className="text-xs font-semibold text-primary">CASE {x.number} · {x.model}</div>
            <div className="font-semibold mt-1">{x.title}</div>
            <p className="text-xs text-muted-foreground mt-1">{x.summary}</p>
          </button>
        ))}
      </div>
      <article className="mt-6 rounded-2xl border bg-card p-5 shadow-soft space-y-4">
        <h2 className="font-display text-2xl font-semibold">Case {c.number}: {c.title}</h2>
        {c.illustrative && (
          <div className="flex gap-2 rounded-xl bg-warn/15 p-3 text-sm">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />Illustrative safety statement — NOT a verbatim experimental response.
          </div>
        )}
        <div><div className="text-xs font-semibold uppercase text-muted-foreground">Question</div><p>{c.question}</p></div>
        <div><div className="text-xs font-semibold uppercase text-muted-foreground">AI answer ({c.model})</div>
          <blockquote className="border-l-4 border-primary bg-muted p-3 rounded-r-lg text-sm">{c.answer}</blockquote></div>
        <div><div className="text-xs font-semibold uppercase text-muted-foreground">What actually happened</div>
          <ul className="list-disc pl-5 text-sm space-y-1 mt-1">{c.explanation.map((e) => <li key={e}>{e}</li>)}</ul></div>
        <p className="text-sm">Related rules: {c.rules.map((r) => `Rule ${r}`).join(", ")}</p>
        <Link to="/analyze" search={{ case: c.id }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:opacity-90">
          Load in Analyzer <ArrowRight className="h-4 w-4" />
        </Link>
      </article>
    </Shell>
  );
}
