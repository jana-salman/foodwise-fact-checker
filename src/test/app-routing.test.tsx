import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { analyzeResponse } from "@/lib/foodwise-rules";
import { LESSONS } from "@/lib/lessons";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  const router = () => createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it.each(["/", "/analyze", "/learn", "/about"])(
    "matches a page for %s instead of falling back to not found",
    (path) => {
      const matches = router().matchRoutes(path);

      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    },
  );
});

describe("Five rules", () => {
  it("has five rules numbered 1 to 5, each with the four detail parts", () => {
    expect(LESSONS.map((l) => l.n)).toEqual([1, 2, 3, 4, 5]);
    for (const l of LESSONS) {
      expect(l.why).toBeTruthy();
      expect(l.signs.length).toBeGreaterThan(0);
      expect(l.example).toBeTruthy();
      expect(l.verify.length).toBeGreaterThan(0);
    }
  });
});

describe("Analyzer engine (unchanged behaviour)", () => {
  it("flags overconfident allergy wording and links it to rule 4", () => {
    const res = analyzeResponse(
      "Is this snack safe for my nut allergy?",
      "This snack is definitely safe for a nut allergy. You can eat it without worry.",
    );
    const flagged = res.findings.find((f) => f.title === "Overconfident language");
    expect(flagged?.level).toBe("red");
    expect(res.rules).toContain(4);
  });

  it("detects nutrition numbers and a missing serving size", () => {
    const res = analyzeResponse(
      "How much sugar is in it?",
      "It has 12 g of sugar and 200 mg of sodium.",
    );
    expect(res.findings.some((f) => f.title.startsWith("Nutrition numbers found"))).toBe(true);
    expect(res.findings.some((f) => f.title === "No serving size or per-100 g basis")).toBe(true);
  });
});
