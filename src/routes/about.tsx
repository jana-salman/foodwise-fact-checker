import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardPaste, ListChecks, ScanSearch } from "lucide-react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FoodWise" },
      {
        name: "description",
        content: "FoodWise helps people think critically about AI food and nutrition advice.",
      },
      { property: "og:title", content: "About FoodWise" },
      { property: "og:description", content: "Why FoodWise exists and how it works." },
    ],
  }),
  component: About,
});

const steps = [
  {
    icon: ClipboardPaste,
    title: "Copy & Paste",
    text: "Paste a food question and the AI's answer.",
  },
  {
    icon: ScanSearch,
    title: "Analyze",
    text: "Simple fixed rules find missing details and concerns.",
  },
  { icon: ListChecks, title: "Verify & Learn", text: "Get steps to check the facts yourself." },
];

function About() {
  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-10 md:pt-14">
        <h1 className="text-3xl font-semibold sm:text-4xl">About FoodWise</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          FoodWise helps people critically evaluate AI-generated food and nutrition advice by
          identifying potential concerns, missing information, and practical ways to verify claims.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          It helps you think. It does not tell you what to believe. The checks run in your browser
          with fixed rules, and no AI judges the answer.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-3xl border border-border bg-card p-5 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage text-primary">
                <s.icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-3 text-lg font-semibold">
                {i + 1}. {s.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 rounded-2xl bg-warm-soft p-4 text-sm leading-relaxed">
          FoodWise is an educational tool, not medical advice. For allergies or a medical diet,
          always check the product label and ask a doctor or dietitian.
        </p>

        <Link
          to="/analyze"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-forest"
        >
          Check an AI Answer <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
    </Shell>
  );
}
