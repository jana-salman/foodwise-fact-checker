import { CircleCheck, Search, TriangleAlert } from "lucide-react";

/** A made-up AI answer being examined, with a checklist that grows out of it. Pure CSS and markup. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden>
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-sage/70 fw-grain" />

      {/* The AI answer */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-lift">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-warm" /> AI answer
        </div>
        <p className="mt-3 text-[15px] leading-relaxed">
          This granola bar is{" "}
          <mark className="rounded bg-warm-soft px-1 py-0.5 text-foreground ring-1 ring-warm/40">
            100% healthy
          </mark>{" "}
          and{" "}
          <mark className="rounded bg-warm-soft px-1 py-0.5 text-foreground ring-1 ring-warm/40">
            definitely safe
          </mark>{" "}
          for a nut allergy. It has only{" "}
          <mark className="rounded bg-warm-soft px-1 py-0.5 text-foreground ring-1 ring-warm/40">
            8 g sugar
          </mark>
          .
        </p>
      </div>

      {/* Magnifying glass */}
      <div className="fw-float absolute -right-2 -top-10 grid h-20 w-20 place-items-center rounded-full border-4 border-primary bg-background/80 shadow-lift backdrop-blur-sm sm:-right-6 sm:-top-12 sm:h-24 sm:w-24">
        <Search className="h-8 w-8 text-primary sm:h-9 sm:w-9" strokeWidth={2.2} />
      </div>

      {/* Checklist */}
      <div className="relative -mt-2 ml-6 rounded-3xl border border-border bg-card p-5 shadow-lift sm:ml-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          FoodWise check
        </div>
        <ul className="mt-3 space-y-2.5 text-sm">
          <li className="flex items-start gap-2.5">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-bad" />
            <span>Safety claim with no allergy warning</span>
          </li>
          <li className="flex items-start gap-2.5">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
            <span>Serving size is missing</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
            <span>Next step: compare with the real label</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
