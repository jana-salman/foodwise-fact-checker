import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Shell } from "@/components/Shell";
import { HeroVisual } from "@/components/HeroVisual";
import { LESSONS } from "@/lib/lessons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FoodWise — Think Before You Trust AI" },
      {
        name: "description",
        content:
          "FoodWise helps you check AI food and nutrition advice. Spot red flags and learn how to verify claims yourself.",
      },
      { property: "og:title", content: "FoodWise — Think Before You Trust AI" },
      {
        property: "og:description",
        content: "Spot red flags in AI food advice and learn how to verify it.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Shell>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-10 pt-10 md:pt-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            AI Sounds Confident. <span className="text-primary">But Is It Correct?</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            From nutrition labels to dietary advice, AI can make mistakes that are easy to miss.
            FoodWise helps you spot potential red flags, understand what&apos;s missing, and learn
            how to verify information yourself.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-lift transition hover:bg-forest"
            >
              Check an AI Answer <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              to="/learn"
              className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-card px-7 py-4 font-semibold text-primary transition hover:border-primary"
            >
              Learn How to Verify
            </Link>
          </div>
        </div>
        <div className="hidden px-3 lg:block">
          <HeroVisual />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">The 5 FoodWise Rules</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {LESSONS.map((l) => (
            <Link
              key={l.n}
              to="/learn"
              hash={`rule-${l.n}`}
              className="group flex flex-col rounded-3xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-primary last:col-span-2 lg:last:col-span-1"
            >
              <span className="flex items-center justify-between">
                <span className="font-display text-2xl font-semibold text-warm">
                  {String(l.n).padStart(2, "0")}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-sage text-primary">
                  <l.icon className="h-5 w-5" aria-hidden />
                </span>
              </span>
              <span className="mt-3 font-semibold leading-snug">{l.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}
