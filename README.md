# Foodwise Fact Checker

Build a COMPLETE, WORKING, mobile-first university educational web application called "FoodWise — Think Before You Trust AI."

IMPORTANT: Implement the application directly in Build mode. Do not stop at a plan, ask clarifying questions, or create only a landing-page mockup. Prioritize a functioning MVP in this single build. Use React, TypeScript, Tailwind CSS, and client-side logic. No authentication, database, Supabase, server functions, AI APIs, external paid APIs, or generated images. All pasted content stays in browser memory and is not uploaded or stored.

PURPOSE:
FoodWise is an AI-literacy awareness project for AGSC 205 at the American University of Beirut. It teaches students to critically evaluate ChatGPT/Gemini food and nutrition recommendations WITHOUT using another AI model to judge those answers.

DESIGN:
Create a polished but simple student-friendly app. Soft sage green, cream/white, dark navy typography, rounded cards, accessible contrast, subtle interactions, responsive desktop and phone layouts. Use Lucide icons and clean typography. No flashy animations.

NAVIGATION:
Home / Learn, Analyze Answer, Research Cases.

1. HOME / LEARN — THIS MUST BE THE DEFAULT PAGE:
Show headline "Before You Trust AI With Your Food".
Subtitle: "AI sounds confident. But is it always correct?"
Include a short introduction, then five interactive expandable educational cards:

Rule 1: Check the actual nutrition label. AI may misread numbers and ingredients. Example: Castania saturated fat.
Rule 2: Check serving sizes and units. Compare per 100 g when appropriate and verify the calculations. Example: Indomie sodium.
Rule 3: Question health claims. "Natural", "high protein", and "no added sugar" do not automatically mean healthy.
Rule 4: Take allergies and dietary restrictions seriously. AI cannot establish allergy or celiac safety from incomplete packaging evidence.
Rule 5: Verify with trusted sources such as the exact manufacturer's label, credible scientific guidance, and relevant professionals.

Every lesson should show: what to watch for, a short real-world example, and what the student should check.
Provide a prominent "Now Analyze an AI Answer" button after the lessons.

2. ANALYZE ANSWER — FUNCTIONAL RULE-BASED LINTER:
Provide two editable text areas:
A. "What did you ask ChatGPT or Gemini?"
B. "Paste the AI response"
Button: "Analyze Response"

On click, run deterministic TypeScript text-analysis functions, NOT a generative AI model.

Checks must be contextual:
- Detect nutrition numbers and units (g, mg, kcal, grams, percentages).
- Detect serving sizes and per-100-g references.
- If the question compares foods, flag missing comparison basis where relevant.
- Identify source mentions, links and citation-like text. Explain that mentioning a source does not verify it.
- Flag potentially overconfident language such as "100% safe", "guaranteed", and absolute dietary safety assurances.
- Detect dietary terms including allergy, allergen, lactose, gluten, celiac/coeliac, and "may contain". Flag missing safety qualifications when relevant.
- Detect broad health claims such as "completely healthy", "boosts immunity", and "no added sugar means sugar-free".
- Detect whether the response acknowledges uncertainty or missing information, when needed.
- Where simple comparisons contain clearly identified numeric quantities on the same basis, check arithmetic. Do not guess units or extract ambiguous values.

Display results under four headings:
"What the AI provided"
"What may be missing"
"Potential concerns"
"How to verify"

Each finding has a green, amber or red indicator:
Green = this specific check passed.
Amber = needs independent review.
Red = a specific concerning claim or confirmed discrepancy detected.
Never label the entire response scientifically accurate or guaranteed safe.

For arbitrary pasted answers, provide screening and practical verification steps only. DO NOT invent nutritional values, claim to have verified facts, or pretend to have checked websites.
Link findings to the relevant five learning rules.
Include a "Try another answer" button.

3. OUR RESEARCH — REAL EXAMPLES:
Include three selectable case cards with authentic example data and a "Load in Analyzer" button.

CASE 3 — Castania:
Question: Explain this nutrition label. Is it high in sugar, salt or fat?
ChatGPT claimed 5.5 g saturated fat and 1 g sugar per 30 g serving. The photographed label actually showed 2 g saturated fat, 5.5 g monounsaturated fat, and 0 g sugar. Explain the image-reading mistake.

CASE 7 — Indomie vs Master Chips:
Question: Which food has more sodium and by how much per 100 g?
Gemini claimed Indomie has 2,483 mg sodium per 100 g and Master Chips 1,215 mg, difference 1,268 mg. Original Indomie packaging reports 1,430 mg sodium per 60 g serving. Verified Indomie value = (1430 / 60) * 100 = 2,383.3 mg per 100 g. Actual difference = 2,383.3 - 1,215 = 1,168.3 mg per 100 g. Explain why correct-looking mathematics can use an incorrect initial figure.

CASE 10 — Celiac disease:
Question: I have celiac disease. Is this snack safe for me?
Use an example AI answer claiming the product is definitely safe despite insufficient labeling evidence. Clearly label this as an illustrative safety statement, NOT a verbatim experimental response. Explain that a precautionary "may contain cereals" warning requires careful evaluation, does not establish a measured gluten concentration, and cannot alone guarantee suitability. Encourage checking exact gluten-free labeling and manufacturer information.

Research case checks should use locally stored, explicitly matched reference facts. For arbitrary pasted answers, do not automatically match a case merely because it mentions sodium, gluten, or other common terms. Use exact selected case context for reference comparisons.

4. LEARNING TAKEAWAY:
After every analysis, show a short "What you learned" section and relevant FoodWise rules. Include a short footer stating: "FoodWise is an educational screening tool, not a medical or scientific certification service."

IMPLEMENTATION:
Use reusable React components and clearly organized TypeScript rule functions in a dedicated module. Include real working navigation, form validation, sample loading, analysis result rendering, expandable lesson cards, and restart/reset functionality.
Make the app work with no external backend or API calls.
Do not include fake login, fake AI chat, fake verification scores, or non-functional buttons.

BEFORE FINISHING:
Check that all main pages render, navigation works, the analyzer processes arbitrary pasted text, the three example cases load, and the numerical discrepancy examples show the correct verified values. Keep implementation compact and prioritize fully functional behavior over decorative extras.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://foodwise-fact-checker.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/44332731-cc2e-4d11-bc35-44c9731c99d9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
