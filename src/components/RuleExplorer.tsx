import { CircleCheck, Eye, Lightbulb, ListChecks, Sparkles } from "lucide-react";
import type { Rule } from "@/lib/lessons";

/** The four parts shown for every rule. */
export function RuleDetail({ rule }: { rule: Rule }) {
  const parts = [
    { icon: Sparkles, label: "Why it matters", body: <p>{rule.why}</p> },
    {
      icon: Eye,
      label: "Warning signs",
      body: (
        <ul className="space-y-1.5">
          {rule.signs.map((s) => (
            <li key={s} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warm" />
              {s}
            </li>
          ))}
        </ul>
      ),
    },
    { icon: Lightbulb, label: "Example", body: <p>{rule.example}</p> },
    {
      icon: ListChecks,
      label: "How to check",
      body: (
        <ul className="space-y-1.5">
          {rule.verify.map((s) => (
            <li key={s} className="flex gap-2">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
              {s}
            </li>
          ))}
        </ul>
      ),
    },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {parts.map((p) => (
        <div key={p.label} className="rounded-2xl bg-background/80 p-4">
          <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-primary">
            <p.icon className="h-4 w-4" aria-hidden /> {p.label}
          </div>
          <div className="text-[15px] leading-relaxed">{p.body}</div>
        </div>
      ))}
    </div>
  );
}
