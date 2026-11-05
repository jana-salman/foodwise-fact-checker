// Deterministic, rule-based screening of AI food answers. No AI models involved.

export type Level = "green" | "amber" | "red";
export type Section = "provided" | "missing" | "concerns" | "verify";
export interface Finding {
  section: Section;
  level: Level;
  title: string;
  detail: string;
  rules: number[];
}
export type CaseId = "castania" | "indomie" | "celiac";

export interface ResearchCase {
  id: CaseId;
  number: number;
  title: string;
  model: string;
  question: string;
  answer: string;
  illustrative?: boolean;
  summary: string;
  explanation: string[];
  rules: number[];
}

export const CASES: ResearchCase[] = [
  {
    id: "castania",
    number: 3,
    title: "Castania nutrition label",
    model: "ChatGPT",
    question: "Explain this nutrition label. Is it high in sugar, salt or fat?",
    answer:
      "Based on the label, one 30 g serving contains 5.5 g saturated fat and 1 g sugar. The saturated fat is fairly high for a small serving, while sugar is low. Overall it is a moderately high-fat snack, so enjoy it in moderation.",
    summary: "AI misread the photographed label: it reported 5.5 g saturated fat and 1 g sugar.",
    explanation: [
      "The photographed label showed 2 g saturated fat, 5.5 g monounsaturated fat, and 0 g sugar per 30 g serving.",
      "The AI likely took the 5.5 g from the monounsaturated fat row and assigned it to saturated fat — a row-reading mistake from the image.",
      "It also reported 1 g sugar where the label showed 0 g. Confident wording hid both reading errors.",
    ],
    rules: [1, 2],
  },
  {
    id: "indomie",
    number: 7,
    title: "Indomie vs Master Chips sodium",
    model: "Gemini",
    question: "Which food has more sodium and by how much per 100 g?",
    answer:
      "Indomie has more sodium. Indomie contains 2,483 mg sodium per 100 g, while Master Chips contain 1,215 mg sodium per 100 g. The difference is 1,268 mg per 100 g, so Indomie has significantly more sodium.",
    summary: "The subtraction is correct, but the starting Indomie figure is wrong.",
    explanation: [
      "Original Indomie packaging reports 1,430 mg sodium per 60 g serving.",
      "Verified Indomie value = (1430 ÷ 60) × 100 = 2,383.3 mg per 100 g (not 2,483 mg).",
      "Actual difference = 2,383.3 − 1,215 = 1,168.3 mg per 100 g (not 1,268 mg).",
      "2,483 − 1,215 really is 1,268, so the math looks correct — but correct arithmetic on a wrong input still gives a wrong answer.",
    ],
    rules: [1, 2, 5],
  },
  {
    id: "celiac",
    number: 10,
    title: "Celiac disease safety",
    model: "Illustrative example",
    illustrative: true,
    question: "I have celiac disease. Is this snack safe for me?",
    answer:
      "Yes, this snack is definitely safe for you. The ingredients don't list wheat, so it is 100% gluten-free and you can eat it without worry.",
    summary: "An absolute safety claim made despite a 'may contain cereals' warning and no gluten-free label.",
    explanation: [
      "This is an illustrative safety statement written for teaching, NOT a verbatim experimental AI response.",
      "The package carried a precautionary 'may contain cereals' warning. That signals possible cross-contact; it does not report a measured gluten concentration.",
      "Missing wheat in the ingredients list cannot alone guarantee suitability for someone with celiac disease.",
      "Check for an explicit certified gluten-free label, contact the manufacturer, and consult a dietitian or doctor.",
    ],
    rules: [4, 5],
  },
];

export const getCase = (id?: string) => CASES.find((c) => c.id === id);

const has = (t: string, re: RegExp) => re.test(t);
const parseNum = (s: string) => parseFloat(s.replace(/,/g, ""));

export function extractNutritionNumbers(text: string): string[] {
  const re = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\s?(?:mg|g|grams?|milligrams?|kcal|calories|kj|%)(?![a-z])/gi;
  return Array.from(new Set(text.match(re) ?? []));
}

/** Values explicitly stated as "<n> mg ... per 100 g" (same basis). */
export function extractPer100Mg(text: string): number[] {
  const re = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s?mg[^.\d]{0,30}?per\s?100\s?g/gi;
  return Array.from(text.matchAll(re)).map((m) => parseNum(m[1] ?? "0"));
}

export function checkDifference(text: string): Finding | null {
  const vals = extractPer100Mg(text);
  const diff = text.match(/(?:difference|differ|more by|higher by)[^.\d]{0,30}?(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s?mg/i);
  if (vals.length !== 2 || !diff) return null;
  const a = vals[0] ?? 0, b = vals[1] ?? 0;
  const stated = parseNum(diff[1] ?? "0");
  const actual = Math.abs(a - b);
  const ok = Math.abs(actual - stated) < 0.6;
  return {
    section: ok ? "provided" : "concerns",
    level: ok ? "amber" : "red",
    title: ok ? "Arithmetic is internally consistent" : "Arithmetic discrepancy detected",
    detail: ok
      ? `${a.toLocaleString()} − ${b.toLocaleString()} = ${actual.toLocaleString()} mg matches the stated difference. Correct math does not prove the starting values are correct — check them on the label.`
      : `The stated difference is ${stated.toLocaleString()} mg, but ${a.toLocaleString()} − ${b.toLocaleString()} = ${actual.toLocaleString()} mg.`,
    rules: [2],
  };
}

function caseChecks(c: ResearchCase, r: string): Finding[] {
  const out: Finding[] = [];
  if (c.id === "castania") {
    if (/5\.5\s?g\s+saturated/i.test(r))
      out.push({ section: "concerns", level: "red", title: "Reference mismatch: saturated fat", detail: "Answer says 5.5 g saturated fat; the photographed label shows 2 g saturated fat. 5.5 g is the monounsaturated fat value.", rules: [1] });
    if (/\b1\s?g\s+(?:of\s+)?sugar/i.test(r))
      out.push({ section: "concerns", level: "red", title: "Reference mismatch: sugar", detail: "Answer says 1 g sugar; the label shows 0 g sugar per 30 g serving.", rules: [1] });
  }
  if (c.id === "indomie") {
    if (/2,?483/.test(r))
      out.push({ section: "concerns", level: "red", title: "Reference mismatch: Indomie sodium", detail: "Answer uses 2,483 mg/100 g. Packaging: 1,430 mg per 60 g → (1430 ÷ 60) × 100 = 2,383.3 mg per 100 g.", rules: [1, 2] });
    if (/1,?268/.test(r))
      out.push({ section: "concerns", level: "red", title: "Reference mismatch: sodium difference", detail: "Verified difference = 2,383.3 − 1,215 = 1,168.3 mg per 100 g, not 1,268 mg.", rules: [2] });
  }
  if (c.id === "celiac" && /definitely safe|100% gluten|completely safe|without worry/i.test(r))
    out.push({ section: "concerns", level: "red", title: "Reference mismatch: unsupported celiac safety claim", detail: "The product carries a 'may contain cereals' warning and no gluten-free label. Safety cannot be established from this evidence.", rules: [4] });
  if (!out.length)
    out.push({ section: "provided", level: "green", title: `No known Case ${c.number} errors found`, detail: "The specific errors recorded for this case were not detected. This does not certify the answer.", rules: [5] });
  return out;
}

export interface AnalysisResult {
  findings: Finding[];
  rules: number[];
  takeaways: string[];
  caseUsed?: ResearchCase | undefined;
}

export function analyzeResponse(question: string, response: string, caseId?: CaseId): AnalysisResult {
  const q = question.toLowerCase();
  const r = response.toLowerCase();
  const f: Finding[] = [];

  // Numbers & units
  const nums = extractNutritionNumbers(response);
  if (nums.length)
    f.push({ section: "provided", level: "amber", title: `Nutrition numbers found (${nums.length})`, detail: `Detected: ${nums.slice(0, 8).join(", ")}${nums.length > 8 ? "…" : ""}. Compare each one with the actual package label.`, rules: [1] });
  else if (has(q, /sugar|salt|sodium|fat|calorie|protein|carb|nutrition|label/))
    f.push({ section: "missing", level: "amber", title: "No specific nutrition values", detail: "You asked about nutrients, but the answer gives no numbers with units. Check the label yourself.", rules: [1] });

  // Serving / basis
  const hasServing = has(r, /per\s?(serving|portion|pack|piece|bar)|serving size|\bserving\b/);
  const has100 = has(r, /per\s?100\s?(g|ml|grams?)/);
  if (hasServing || has100)
    f.push({ section: "provided", level: "green", title: "Serving or basis stated", detail: `Mentions ${[hasServing && "serving size", has100 && "per-100 g/ml"].filter(Boolean).join(" and ")}. Confirm it matches the label.`, rules: [2] });
  else if (nums.length)
    f.push({ section: "missing", level: "amber", title: "No serving size or per-100 g basis", detail: "Numbers appear without saying per serving or per 100 g, so they can't be compared reliably.", rules: [2] });

  // Comparison basis
  const isCompare = has(q, /\bvs\.?\b|versus|compare|which (?:one|food|is|has)|more|less|healthier|better/);
  if (isCompare) {
    if (!has100 && !has(r, /same (serving|basis|amount)/))
      f.push({ section: "missing", level: "amber", title: "Comparison basis unclear", detail: "Your question compares foods, but the answer doesn't compare on the same basis (e.g. per 100 g). Different serving sizes can mislead.", rules: [2] });
    else f.push({ section: "provided", level: "green", title: "Comparison uses a common basis", detail: "The comparison references a common basis such as per 100 g.", rules: [2] });
  }
  const arith = checkDifference(response);
  if (arith) f.push(arith);

  // Sources
  const links = response.match(/https?:\/\/\S+|www\.\S+/gi) ?? [];
  const cites = has(r, /according to|source[s]?:|study|studies|research shows|\bwho\b|usda|fda|efsa|\[\d+\]|journal/);
  if (links.length || cites)
    f.push({ section: "provided", level: "amber", title: "Source mentions found", detail: `${links.length ? `${links.length} link(s). ` : ""}Mentioning a source does not verify it. FoodWise has not opened or checked these — open them and confirm they say what the AI claims.`, rules: [5] });
  else
    f.push({ section: "missing", level: "amber", title: "No sources cited", detail: "The answer gives no traceable sources. Verify with the manufacturer's label or credible guidance.", rules: [5] });

  // Overconfidence
  const overconf = response.match(/100% (?:safe|healthy|gluten[- ]free)|guaranteed?|definitely safe|completely safe|absolutely safe|perfectly safe|no risk|risk[- ]free|always safe|without (?:any )?worry/gi);
  if (overconf)
    f.push({ section: "concerns", level: "red", title: "Overconfident language", detail: `Found: "${Array.from(new Set(overconf.map((s) => s.toLowerCase()))).join('", "')}". AI cannot guarantee food safety.`, rules: [3, 4] });
  else f.push({ section: "provided", level: "green", title: "No absolute safety wording detected", detail: "No phrases like '100% safe' or 'guaranteed' were found.", rules: [3] });

  // Dietary / allergy
  const dietRe = /allerg\w*|lactose|gluten|celiac|coeliac|may contain|nut[s]?\b|peanut|dairy|wheat|vegan|halal|intoleran\w*/g;
  const dietTerms = Array.from(new Set([...(q.match(dietRe) ?? []), ...(r.match(dietRe) ?? [])]));
  if (dietTerms.length) {
    const qualified = has(r, /check (the )?label|manufacturer|cross[- ]contam|cross[- ]contact|certified|doctor|dietitian|allergist|consult|may contain/);
    f.push(qualified
      ? { section: "provided", level: "green", title: "Safety qualifications present", detail: `Dietary terms (${dietTerms.join(", ")}) appear with advice to check labels, cross-contact, or professionals.`, rules: [4] }
      : { section: "missing", level: has(r, /safe/) ? "red" : "amber", title: "Missing allergy/dietary safety caveats", detail: `Dietary terms (${dietTerms.join(", ")}) appear without mentioning cross-contact, certified labeling, or consulting a professional.`, rules: [4] });
    if (has(r, /may contain/) && has(r, /\bsafe\b/) && !has(r, /not (be )?safe|may not|unsafe|avoid/))
      f.push({ section: "concerns", level: "amber", title: "'May contain' warning next to safety claim", detail: "A precautionary warning means possible cross-contact. It needs careful evaluation, not reassurance.", rules: [4] });
  }

  // Health claims
  const claims = response.match(/completely healthy|super ?food|boosts? (?:your )?immun\w*|detox\w*|natural(?:ly)? (?:means|so|is) healthy|no added sugar means sugar[- ]free|sugar[- ]free|guilt[- ]free|burns? fat|high[- ]protein so|all[- ]natural|clean eating|healthy choice/gi);
  if (claims)
    f.push({ section: "concerns", level: has(r, /no added sugar means sugar[- ]free|boosts? (?:your )?immun|completely healthy|detox/) ? "red" : "amber", title: "Broad health claims", detail: `Found: "${Array.from(new Set(claims.map((s) => s.toLowerCase()))).join('", "')}". Such claims need evidence and context.`, rules: [3] });

  // Uncertainty
  const hedged = has(r, /may|might|could|depends|not sure|cannot (?:confirm|verify)|can't (?:confirm|verify)|check the|verify|i recommend|consult|uncertain|approximately|varies/);
  const needsHedge = dietTerms.length > 0 || nums.length > 0 || has(q, /safe|healthy/);
  if (hedged) f.push({ section: "provided", level: "green", title: "Acknowledges uncertainty", detail: "The answer includes hedging or advice to verify.", rules: [5] });
  else if (needsHedge) f.push({ section: "missing", level: "amber", title: "No acknowledgement of uncertainty", detail: "The answer presents everything as certain and never suggests checking the label or a professional.", rules: [5] });

  const c = getCase(caseId);
  if (c) f.push(...caseChecks(c, response));

  // Verify steps
  const usedRules = Array.from(new Set(f.flatMap((x) => x.rules))).sort();
  const steps: Record<number, string> = {
    1: "Find the exact product and read every number on its nutrition label yourself.",
    2: "Confirm the serving size and convert to per 100 g: (value ÷ serving g) × 100.",
    3: "Ask what evidence supports each health claim; marketing words aren't evidence.",
    4: "For allergies or celiac disease, look for certified labeling and contact the manufacturer or a dietitian.",
    5: "Cross-check with the manufacturer, credible scientific guidance, or a qualified professional.",
  };
  usedRules.forEach((n) => f.push({ section: "verify", level: "amber", title: `Rule ${n} check`, detail: steps[n] ?? "", rules: [n] }));

  const takeaways = [
    "Confident wording is not the same as correct information.",
    nums.length ? "Every AI number must be traced back to a real label." : "Specific claims need specific, checkable evidence.",
    dietTerms.length ? "Allergy and celiac safety can't be decided from incomplete packaging." : "Always know the basis (serving vs per 100 g) before comparing.",
  ];
  return { findings: f, rules: usedRules, takeaways, caseUsed: c };
}
