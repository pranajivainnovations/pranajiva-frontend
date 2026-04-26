/**
 * Wellness Journey — constants, types & data
 *
 * The PranaJiva wellness journey flows through four pillars:
 *   Nutrition → Ayurveda → Glow Care → Intimate Wellness
 *
 * Each pillar maps to a root Medusa category (by handle).
 */

export interface JourneyPillar {
  /** 1-based step number */
  step: number;
  /** Display name */
  name: string;
  /** Medusa category handle (lowercase) */
  handle: string;
  /** Short tagline shown in the progress bar */
  tagline: string;
  /** Longer description for the journey page */
  description: string;
  /** Philosophy / "why this matters" blurb */
  philosophy: string;
  /** Lucide icon name (rendered by consumer) */
  icon: string;
  /** Tailwind accent color class */
  accentColor: string;
  /** Tailwind background tint */
  bgTint: string;
}

export const JOURNEY_PILLARS: JourneyPillar[] = [
  {
    step: 1,
    name: 'Nutrition',
    handle: 'nutrition',
    tagline: 'Build Your Foundation',
    description:
      'Every wellness journey begins with nourishment. Our superfood blends, herbal powders, and targeted supplements give your body the essential building blocks for vitality and strength.',
    philosophy:
      'In Ayurveda, "Anna" (food) is considered the first medicine. When digestion is strong and nourishment is complete, the body finds its natural balance. Start here to fuel everything that follows.',
    icon: 'Leaf',
    accentColor: 'text-emerald-600',
    bgTint: 'bg-emerald-50',
  },
  {
    step: 2,
    name: 'Ayurveda',
    handle: 'ayurveda',
    tagline: 'Restore Balance',
    description:
      'Time-honoured herbal formulations for stress relief, hormonal balance, immunity, and sustained energy. Rooted in 5,000 years of Vedic wisdom, refined for modern life.',
    philosophy:
      'Ayurveda teaches that health is not merely the absence of disease — it is a dynamic balance of mind, body, and spirit. These formulations support your innate healing intelligence.',
    icon: 'Flower2',
    accentColor: 'text-amber-600',
    bgTint: 'bg-amber-50',
  },
  {
    step: 3,
    name: 'Glow Care',
    handle: 'glow-care',
    tagline: 'Radiance From Within',
    description:
      'True radiance starts from the inside. Our plant-based face care, body care, ubtans, and nourishing oils help your outer glow reflect your inner wellness.',
    philosophy:
      'When nutrition is strong and doshas are balanced, the skin, hair, and body begin to radiate health naturally. Glow Care amplifies what the first two pillars have already begun.',
    icon: 'Sparkles',
    accentColor: 'text-rose-500',
    bgTint: 'bg-rose-50',
  },
  {
    step: 4,
    name: 'Intimate Wellness',
    handle: 'intimate-wellness',
    tagline: 'Complete Confidence',
    description:
      'Premium intimate care crafted with the same Ayurvedic precision — oils, serums, sensory essentials, and performance wellness. Delivered with absolute discretion.',
    philosophy:
      'Intimacy is a natural expression of holistic well-being. When body, mind, and spirit are in harmony, confidence follows. This final pillar honours that connection with care and privacy.',
    icon: 'Heart',
    accentColor: 'text-purple-600',
    bgTint: 'bg-purple-50',
  },
];

/** Get pillar by category handle (case-insensitive) */
export function getPillarByHandle(handle: string): JourneyPillar | undefined {
  return JOURNEY_PILLARS.find(
    (p) => p.handle.toLowerCase() === handle.toLowerCase()
  );
}

/** Get the NEXT pillar in the journey (wraps around) */
export function getNextPillar(currentHandle: string): JourneyPillar {
  const idx = JOURNEY_PILLARS.findIndex(
    (p) => p.handle.toLowerCase() === currentHandle.toLowerCase()
  );
  if (idx === -1) return JOURNEY_PILLARS[0];
  return JOURNEY_PILLARS[(idx + 1) % JOURNEY_PILLARS.length];
}

/** Get the PREVIOUS pillar in the journey (wraps around) */
export function getPrevPillar(currentHandle: string): JourneyPillar {
  const idx = JOURNEY_PILLARS.findIndex(
    (p) => p.handle.toLowerCase() === currentHandle.toLowerCase()
  );
  if (idx === -1) return JOURNEY_PILLARS[JOURNEY_PILLARS.length - 1];
  return JOURNEY_PILLARS[(idx - 1 + JOURNEY_PILLARS.length) % JOURNEY_PILLARS.length];
}

/** Map a product's category to a pillar (checks parent_category_id chain) */
export function getProductPillar(product: {
  categories?: Array<{ handle: string; parent_category_id?: string | null }>;
  collection?: { title?: string; handle?: string } | null;
  metadata?: Record<string, unknown> | null;
}): JourneyPillar | undefined {
  // Check direct category assignment
  if (product.categories) {
    for (const cat of product.categories) {
      const pillar = getPillarByHandle(cat.handle);
      if (pillar) return pillar;
    }
  }

  // Check collection name as fallback
  if (product.collection?.handle) {
    const pillar = getPillarByHandle(product.collection.handle);
    if (pillar) return pillar;
  }
  if (product.collection?.title) {
    const pillar = JOURNEY_PILLARS.find(
      (p) => p.name.toLowerCase() === product.collection!.title!.toLowerCase()
    );
    if (pillar) return pillar;
  }

  // Check metadata.wellness_category
  const wellnessCat = product.metadata?.wellness_category as string | undefined;
  if (wellnessCat) {
    const pillar = JOURNEY_PILLARS.find(
      (p) => p.name.toLowerCase() === wellnessCat.toLowerCase()
    );
    if (pillar) return pillar;
  }

  return undefined;
}

/** Wellness Quiz types */
export interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
  multiSelect?: boolean;
}

export interface QuizOption {
  label: string;
  description?: string;
  /** Which pillars this answer recommends (by step number) */
  pillars: number[];
  icon?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'primary-goal',
    question: 'What is your primary wellness goal?',
    subtitle: 'Choose the area you\'d like to focus on most.',
    options: [
      { label: 'More Energy & Vitality', description: 'Fight fatigue, boost stamina', pillars: [1, 2], icon: '⚡' },
      { label: 'Stress & Better Sleep', description: 'Calm the mind, restore rest', pillars: [2], icon: '🌙' },
      { label: 'Skin & Hair Radiance', description: 'Natural glow from within', pillars: [3, 1], icon: '✨' },
      { label: 'Intimate Confidence', description: 'Performance & sensation', pillars: [4], icon: '💜' },
      { label: 'Overall Balance', description: 'A holistic approach', pillars: [1, 2, 3, 4], icon: '🧘' },
    ],
  },
  {
    id: 'experience',
    question: 'How familiar are you with Ayurvedic wellness?',
    options: [
      { label: 'Completely New', description: 'I\'m just getting started', pillars: [1], icon: '🌱' },
      { label: 'Somewhat Familiar', description: 'I\'ve tried a few things', pillars: [1, 2], icon: '🌿' },
      { label: 'Experienced', description: 'I follow Ayurvedic practices regularly', pillars: [2, 3, 4], icon: '🌳' },
    ],
  },
  {
    id: 'concerns',
    question: 'Which of these do you experience?',
    subtitle: 'Select all that apply.',
    multiSelect: true,
    options: [
      { label: 'Low immunity / frequent illness', pillars: [1, 2], icon: '🛡️' },
      { label: 'Digestive issues', pillars: [1], icon: '🍃' },
      { label: 'Hormonal imbalance', pillars: [2], icon: '⚖️' },
      { label: 'Dull skin or hair loss', pillars: [3], icon: '💆' },
      { label: 'Low confidence or performance', pillars: [4], icon: '💪' },
      { label: 'Chronic stress or anxiety', pillars: [2], icon: '🧠' },
    ],
  },
  {
    id: 'lifestyle',
    question: 'How would you describe your daily routine?',
    options: [
      { label: 'Busy Professional', description: 'Long hours, little time for self-care', pillars: [1, 2], icon: '💼' },
      { label: 'Active & Fitness-Focused', description: 'I work out and eat well', pillars: [1, 3], icon: '🏃' },
      { label: 'Homebody & Mindful', description: 'I value rest and rituals', pillars: [2, 3], icon: '🏡' },
      { label: 'Social & Adventurous', description: 'Always on the go', pillars: [1, 4], icon: '🌍' },
    ],
  },
  {
    id: 'privacy',
    question: 'How important is discreet packaging to you?',
    subtitle: 'All PranaJiva orders ship in plain packaging as "PJ Wellness".',
    options: [
      { label: 'Very Important', description: 'I need full privacy', pillars: [4], icon: '🔒' },
      { label: 'Somewhat Important', description: 'Nice to have', pillars: [3, 4], icon: '📦' },
      { label: 'Not a Concern', description: 'I don\'t mind', pillars: [1, 2], icon: '📬' },
    ],
  },
];

/** Calculate quiz results — returns pillar scores sorted highest first */
export function calculateQuizResults(
  answers: Record<string, string | string[]>
): Array<{ pillar: JourneyPillar; score: number }> {
  const scores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (const question of QUIZ_QUESTIONS) {
    const answer = answers[question.id];
    if (!answer) continue;

    const selectedLabels = Array.isArray(answer) ? answer : [answer];
    for (const label of selectedLabels) {
      const option = question.options.find((o) => o.label === label);
      if (option) {
        option.pillars.forEach((p) => {
          scores[p] += 1;
        });
      }
    }
  }

  return JOURNEY_PILLARS.map((pillar) => ({
    pillar,
    score: scores[pillar.step] || 0,
  })).sort((a, b) => b.score - a.score);
}
