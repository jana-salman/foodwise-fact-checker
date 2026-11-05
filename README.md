# FoodWise — Think Before You Trust AI

FoodWise helps people check AI-generated food and nutrition advice. It points out red flags, missing details, and ways to verify claims.

## Pages
- **Home** — what FoodWise is, the five rules, how it works
- **Analyze** — paste a question and an AI answer to get a rule-based check
- **Learn** — the five FoodWise rules in full
- **About** — why FoodWise exists, and what it does and does not do

## How the analysis works
The analyzer is a fixed, rule-based TypeScript engine in `src/lib/foodwise-rules.ts`. It runs in the browser. No AI model is used. The five rules live in `src/lib/lessons.ts`.

## Run it
```
bun install
bun run dev      # development
bun run build    # production build
bun run test     # tests
```
