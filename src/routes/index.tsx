import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Eye, Lightbulb, CheckSquare, ArrowRight } from "lucide-react";
import { Shell } from "@/components/Shell";
import { LESSONS } from "@/lib/lessons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FoodWise — Think Before You Trust AI" },
      { name: "description", content: "Learn five rules for critically checking ChatGPT and Gemini food and nutrition answers." },
      { property: "og:title", content: "FoodWise — Think Before You Trust AI" },
      { property: "og:description", content: "Five rules for checking AI food and nutrition advice." },
    ],
  }),
  component: Index,
});

function Index() {
  const [open, setOpen] = useState<number | null>(1);
  return (
    <Shell>
      <section className="text-center py-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">AI literacy · AGSC 205</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-3">Before You Trust AI With Your Food</h1>
        <p className="mt-3 text-lg text-muted-foreground">AI sounds confident. But is it always correct?</p>
        <p className="mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
          Chatbots like ChatGPT and Gemini can misread labels, mix up units and make safety claims they can't back up.
          These five rules help you check their food answers yourself — no extra AI needed.
        </p>
      </section>
      <div className="space-y-3 mt-4">
        {LESSONS.map((l) => {
          const isOpen = open === l.n;
          return (
            <div key={l.n} className="rounded-2xl border bg-card shadow-soft">
              <button onClick={() => setOpen(isOpen ? null : l.n)} aria-expanded={isOpen}
                className="w-full flex items-center gap-3 p-4 text-left">
                <span className="grid place-items-center h-9 w-9 shrink-0 rounded-full bg-secondary text-secondary-foreground font-semibold">{l.n}</span>
                <span className="flex-1 font-semibold">Rule {l.n}: {l.title}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 grid gap-3 sm:grid-cols-3 text-sm">
                  <Box icon={<Eye className="h-4 w-4" />} label="What to watch for" text={l.watch} />
                  <Box icon={<Lightbulb className="h-4 w-4" />} label="Real-world example" text={l.example} />
                  <Box icon={<CheckSquare className="h-4 w-4" />} label="What to check" text={l.check} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-center mt-10">
        <Link to="/analyze" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft hover:opacity-90">
          Now Analyze an AI Answer <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Shell>
  );
}

function Box({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <div className="flex items-center gap-1.5 font-semibold text-primary mb-1">{icon}{label}</div>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
