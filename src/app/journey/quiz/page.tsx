'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Check,
  Leaf,
  Flower2,
  Sparkles,
  Heart,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  QUIZ_QUESTIONS,
  JOURNEY_PILLARS,
  calculateQuizResults,
} from '@/lib/wellness-journey';
import { medusaClient, formatPrice } from '@/lib/medusa';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf,
  Flower2,
  Sparkles,
  Heart,
};

interface Product {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  variants?: Array<{ prices?: Array<{ currency_code: string; amount: number }> }>;
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [productsByPillar, setProductsByPillar] = useState<Record<string, Product[]>>({});
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const question = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;
  const isLastQuestion = currentStep === QUIZ_QUESTIONS.length - 1;
  const canProceed = Boolean(answers[question?.id]);

  const results = showResults ? calculateQuizResults(answers) : [];

  // Fetch recommended products when results are shown
  useEffect(() => {
    if (!showResults) return;

    async function fetchProducts() {
      setIsLoadingProducts(true);
      try {
        const { products } = await medusaClient.products.list({
          limit: 200,
          expand: 'variants,variants.prices,collection,categories',
        });

        const grouped: Record<string, Product[]> = {};
        for (const pillar of JOURNEY_PILLARS) {
          grouped[pillar.handle] = [];
        }

        for (const product of products || []) {
          const p = product as any;
          const catHandles = (p.categories || []).map((c: any) => c.handle?.toLowerCase());
          const collHandle = p.collection?.handle?.toLowerCase();
          const collTitle = p.collection?.title?.toLowerCase();

          for (const pillar of JOURNEY_PILLARS) {
            const ph = pillar.handle.toLowerCase();
            const pn = pillar.name.toLowerCase();
            if (catHandles.includes(ph) || collHandle === ph || collTitle === pn) {
              if (grouped[pillar.handle].length < 3) {
                grouped[pillar.handle].push(p);
              }
              break;
            }
          }
        }

        setProductsByPillar(grouped);
      } catch (err) {
        console.error('Failed to fetch quiz products:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    }

    fetchProducts();

    // Save to localStorage for returning users
    try {
      localStorage.setItem(
        'pranajiva-quiz-results',
        JSON.stringify({ answers, timestamp: Date.now() })
      );
    } catch {}
  }, [showResults, answers]);

  const handleSelect = (label: string) => {
    if (question.multiSelect) {
      const current = (answers[question.id] as string[]) || [];
      const next = current.includes(label)
        ? current.filter((l) => l !== label)
        : [...current, label];
      setAnswers({ ...answers, [question.id]: next.length ? next : [] });
    } else {
      setAnswers({ ...answers, [question.id]: label });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  };

  const isSelected = (label: string) => {
    const val = answers[question?.id];
    if (Array.isArray(val)) return val.includes(label);
    return val === label;
  };

  // --- Results View ---
  if (showResults) {
    const topPillar = results[0]?.pillar;

    return (
      <div className="min-h-screen bg-surface">
        {/* Header */}
        <div className="bg-surface-warm">
          <div className="container mx-auto px-4 py-14 text-center">
            <p className="label mb-4">Your Results</p>
            <h1 className="font-heading text-display mb-4">
              Your Personalised Path
            </h1>
            <p className="text-subtitle text-ink-light max-w-lg mx-auto">
              Based on your answers, here's your recommended wellness journey
              — starting with <strong className="text-ink">{topPillar?.name}</strong>.
            </p>
          </div>
        </div>

        {/* Ranked Pillars */}
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-3xl mx-auto space-y-6">
            {results.map(({ pillar, score }, i) => {
              const Icon = ICONS[pillar.icon] || Leaf;
              const products = productsByPillar[pillar.handle] || [];
              const maxScore = Math.max(...results.map((r) => r.score), 1);
              const barWidth = (score / maxScore) * 100;

              return (
                <div
                  key={pillar.handle}
                  className={`card-premium p-6 ${i === 0 ? 'ring-2 ring-accent/30' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full ${pillar.bgTint} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-6 h-6 ${pillar.accentColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading text-lg font-medium">{pillar.name}</h3>
                        {i === 0 && (
                          <span className="px-2.5 py-0.5 bg-accent/10 text-accent text-[10px] font-semibold tracking-wider uppercase rounded-full">
                            Best Match
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ink-light mb-3">{pillar.tagline}</p>

                      {/* Score bar */}
                      <div className="h-1.5 bg-ink/[0.06] rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            i === 0 ? 'bg-accent' : 'bg-ink/20'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>

                      {/* Products */}
                      {isLoadingProducts ? (
                        <div className="flex gap-3">
                          {[1, 2, 3].map((n) => (
                            <div key={n} className="w-20 h-20 rounded-lg bg-surface-warm animate-pulse" />
                          ))}
                        </div>
                      ) : products.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto pb-1">
                          {products.map((product) => (
                            <Link
                              key={product.id}
                              href={`/shop/${product.handle}`}
                              className="shrink-0 group"
                            >
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-warm relative">
                                {product.thumbnail ? (
                                  <Image
                                    src={product.thumbnail}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                    sizes="80px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-ink-faint/30">✦</div>
                                )}
                              </div>
                              <p className="text-[10px] text-ink-light mt-1 w-20 truncate">
                                {product.title}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-ink-faint">Products coming soon</p>
                      )}

                      <Link
                        href={`/categories/${pillar.handle}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline mt-3"
                      >
                        Explore {pillar.name} <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="max-w-3xl mx-auto mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/journey" className="btn-primary">
              View Full Journey <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/categories/${topPillar?.handle || 'nutrition'}`}
              className="btn-ghost border border-ink/10"
            >
              Start with {topPillar?.name || 'Nutrition'}
            </Link>
            <button
              onClick={handleRestart}
              className="btn-ghost border border-ink/10"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Quiz View ---
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-ink/[0.06]">
        <div className="h-1 bg-ink/[0.04]">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 text-sm text-ink-light hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-xs text-ink-faint">
            {currentStep + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <Link href="/journey" className="text-sm text-ink-light hover:text-ink transition-colors">
            Skip
          </Link>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <h2 className="font-heading text-2xl md:text-3xl mb-2">{question.question}</h2>
          {question.subtitle && (
            <p className="text-sm text-ink-light mb-8">{question.subtitle}</p>
          )}

          <div className="space-y-3 mb-10">
            {question.options.map((option) => {
              const selected = isSelected(option.label);
              return (
                <button
                  key={option.label}
                  onClick={() => handleSelect(option.label)}
                  className={`w-full text-left px-5 py-4 rounded-card border-2 transition-all ${
                    selected
                      ? 'border-accent bg-accent/[0.04]'
                      : 'border-ink/[0.08] hover:border-ink/20 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {option.icon && (
                      <span className="text-xl shrink-0">{option.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${selected ? 'text-accent' : 'text-ink'}`}>
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-xs text-ink-light mt-0.5">{option.description}</p>
                      )}
                    </div>
                    {selected && (
                      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="btn-primary w-full py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? 'See My Results' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
