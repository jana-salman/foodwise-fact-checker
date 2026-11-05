import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Shell } from "@/components/Shell";
import { RuleDetail } from "@/components/RuleExplorer";
import { LESSONS } from "@/lib/lessons";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — The Five FoodWise Rules" },
      {
        name: "description",
        content: "Five simple rules for checking AI food and nutrition advice.",
      },
      { property: "og:title", content: "Learn — The Five FoodWise Rules" },
      {
        property: "og:description",
        content: "Five simple rules for checking AI food and nutrition advice.",
      },
    ],
  }),
  component: Learn,
});

function Learn() {
  const [active, setActive] = useState(1);

  // Links like /learn#rule-3 open that rule.
  useEffect(() => {
    const m = window.location.hash.match(/rule-(\d)/);
    const n = m ? Number(m[1]) : 0;
    if (n >= 1 && n <= 5) setActive(n);
  }, []);

  const rule = LESSONS.find((l) => l.n === active) ?? LESSONS[0]!;

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-10 md:pt-14">
        <h1 className="text-3xl font-semibold sm:text-4xl">The 5 FoodWise Rules</h1>
        <p className="mt-3 text-muted-foreground">
          Pick a rule to see what to look for and how to check it.
        </p>

        <div role="tablist" aria-label="Rules" className="mt-6 grid grid-cols-5 gap-2">
          {LESSONS.map((l) => {
            const on = l.n === active;
            return (
              <button
                key={l.n}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="rule-panel"
                onClick={() => setActive(l.n)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border px-1 py-3 text-xs font-semibold transition sm:text-sm ${
                  on
                    ? "border-primary bg-primary text-primary-foreground shadow-soft"
                    : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                <l.icon className="h-5 w-5" aria-hidden />
                <span>{l.n}</span>
              </button>
            );
          })}
        </div>

        <div
          id="rule-panel"
          role="tabpanel"
          key={rule.n}
          className="fw-page mt-5 rounded-3xl border border-border bg-sage/60 p-5 sm:p-6"
        >
          <h2 className="text-2xl font-semibold">
            {rule.n}. {rule.title}
          </h2>
          <p className="mb-4 mt-1 text-muted-foreground">{rule.short}</p>
          <RuleDetail rule={rule} />
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActive(rule.n === 5 ? 1 : rule.n + 1)}
            className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-secondary"
          >
            Next rule
          </button>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-forest"
          >
            Check an AI Answer <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </Shell>
  );
}
