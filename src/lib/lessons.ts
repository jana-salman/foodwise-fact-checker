import {
  Megaphone,
  Ruler,
  ScanSearch,
  ShieldAlert,
  BookOpenCheck,
  type LucideIcon,
} from "lucide-react";

// The five FoodWise rules. The analyzer links its findings to these by number (1 to 5).
export interface Rule {
  n: number;
  title: string;
  short: string;
  icon: LucideIcon;
  why: string;
  signs: string[];
  example: string;
  verify: string[];
}

export const LESSONS: Rule[] = [
  {
    n: 1,
    title: "Read the Real Label",
    short: "AI can misinterpret nutrition values, ingredients, and packaging images.",
    icon: ScanSearch,
    why: "AI often reads photos of labels. It can pick the wrong row or the wrong number, and still sound very sure.",
    signs: [
      "Numbers that do not match the package",
      "Ingredients that seem missing or changed",
      "No mention of which product or label was used",
    ],
    example:
      "You send a photo of a snack label. The AI says 5 g of saturated fat, but the label says 2 g. The 5 g was on the line right below.",
    verify: [
      "Put the real package next to the answer.",
      "Compare each number, line by line.",
      "If the photo was blurry, type the numbers in yourself.",
    ],
  },
  {
    n: 2,
    title: "Mind the Measurements",
    short: "Check units, serving sizes, and whether comparisons use the same basis.",
    icon: Ruler,
    why: "A number only makes sense with its unit and its serving size. 200 mg per serving is not the same as 200 mg per 100 g.",
    signs: [
      "mg and g mixed up",
      "Two foods compared with different serving sizes",
      "Numbers with no serving size at all",
    ],
    example:
      "Noodles show 1,200 mg of sodium per serving. Chips show 400 mg per 100 g. The AI says the noodles are three times saltier, but the two numbers use different bases.",
    verify: [
      "Find the serving size on the label.",
      "Convert both foods to the same base: (value ÷ serving size in g) × 100.",
      "Do the maths again yourself, even if the AI showed its steps.",
    ],
  },
  {
    n: 3,
    title: "Look Beyond Marketing",
    short:
      'Claims such as "natural," "high protein," or "no added sugar" do not automatically establish that a product is healthy.',
    icon: Megaphone,
    why: "Words on the front of a pack are there to sell. AI can repeat them as if they were facts.",
    signs: [
      '"Natural," "light," "superfood," or "high protein"',
      "Health claims with no numbers behind them",
      '"Healthy" with no reason given',
    ],
    example:
      'A juice says "no added sugar." It can still have a lot of sugar that comes from the fruit itself.',
    verify: [
      "Turn the pack over and read the nutrition table.",
      "Check the ingredients list. The first items are the biggest.",
      "Ask: what is the proof for this claim?",
    ],
  },
  {
    n: 4,
    title: "Treat Allergies Seriously",
    short:
      "Never rely solely on an AI answer to determine whether food is safe for an allergy, intolerance, or medical dietary restriction.",
    icon: ShieldAlert,
    why: "A wrong answer about allergies can cause real harm. AI cannot see how a food was made, packed, or handled.",
    signs: [
      'Words like "definitely safe" or "100% gluten-free"',
      'No mention of "may contain" warnings',
      "No advice to check the label or ask a professional",
    ],
    example:
      'A snack has no wheat in its ingredients, but the pack says "may contain cereals." The AI says it is safe for celiac disease. That conclusion is not safe to trust.',
    verify: [
      "Look for a certified allergen-free or gluten-free label.",
      'Read every "may contain" warning.',
      "Contact the maker. For a medical diet, ask your doctor or dietitian.",
    ],
  },
  {
    n: 5,
    title: "Follow the Evidence",
    short:
      "Verify claims using accurate product labels, trustworthy sources, and qualified professionals when appropriate.",
    icon: BookOpenCheck,
    why: "AI can name sources that do not exist, or sources that say something different from what it claims.",
    signs: [
      "A study or expert is mentioned with no title or link",
      "Links that do not open",
      "Strong claims with no source at all",
    ],
    example:
      'The AI says "a recent study shows" but gives no title. You search for it and find nothing.',
    verify: [
      "Open the source and read what it really says.",
      "Prefer the product label, health agencies, and qualified professionals.",
      "If you cannot find the source, do not rely on the claim.",
    ],
  },
];
