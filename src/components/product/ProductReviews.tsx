'use client';

import { useState } from 'react';
import { Star, ThumbsUp, User, ChevronDown } from 'lucide-react';
import { useReviewStore, type Review } from '@/stores/review-store';
import { useToastStore } from '@/stores/toast-store';

/* ── Star Rating Display ──────────────────────────────── */

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : star <= rating + 0.5
              ? 'fill-amber-400/50 text-amber-400'
              : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

/* ── Interactive Star Picker ──────────────────────────── */

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-0.5"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300 hover:text-amber-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ── Rating Summary Bar ───────────────────────────────── */

function RatingSummary({ reviews }: { reviews: Review[] }) {
  const total = reviews.length;
  const avg =
    total > 0
      ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / total) * 10) / 10
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: total > 0 ? (reviews.filter((r) => r.rating === star).length / total) * 100 : 0,
  }));

  return (
    <div className="flex flex-col sm:flex-row gap-8 items-start">
      {/* Average */}
      <div className="text-center sm:text-left">
        <p className="text-5xl font-heading font-bold text-ink">{avg > 0 ? avg : '—'}</p>
        <StarRating rating={avg} size="md" />
        <p className="text-sm text-ink-light mt-1">{total} {total === 1 ? 'review' : 'reviews'}</p>
      </div>

      {/* Distribution */}
      <div className="flex-1 space-y-1.5 w-full sm:max-w-xs">
        {distribution.map(({ star, count, pct }) => (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-3 text-ink-light">{star}</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-6 text-right text-ink-faint text-xs">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Single Review Card ───────────────────────────────── */

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt);
  const formattedDate = date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="py-6 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
            <User className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-ink">{review.name}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  <ThumbsUp className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-ink-faint">{formattedDate}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      {review.title && (
        <p className="text-sm font-medium text-ink mb-1">{review.title}</p>
      )}
      <p className="text-sm text-ink-light leading-relaxed">{review.body}</p>
    </div>
  );
}

/* ── Review Form ──────────────────────────────────────── */

function ReviewForm({ productId, onSubmit }: { productId: string; onSubmit: () => void }) {
  const { addReview } = useReviewStore();
  const { addToast } = useToastStore();
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rating === 0 || !body.trim()) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    addReview({
      productId,
      name: name.trim(),
      rating,
      title: title.trim(),
      body: body.trim(),
      verified: false,
    });
    addToast('Thank you for your review!', 'success');
    setName('');
    setRating(0);
    setTitle('');
    setBody('');
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-ink mb-2 block">Your Rating *</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent/50 transition-colors"
            maxLength={50}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Review Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summary of your experience"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent/50 transition-colors"
            maxLength={100}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink mb-1.5 block">Your Review *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent/50 transition-colors resize-none"
          maxLength={500}
        />
        <p className="text-xs text-ink-faint mt-1">{body.length}/500</p>
      </div>

      <button type="submit" className="btn-primary">
        Submit Review
      </button>
    </form>
  );
}

/* ── Main ProductReviews Component ────────────────────── */

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { getProductReviews } = useReviewStore();
  const reviews = getProductReviews(productId);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="py-12 md:py-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-xl font-semibold">Customer Reviews</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-ghost text-sm"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {/* Review form */}
        {showForm && (
          <div className="mb-10 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-heading text-lg font-medium mb-4">Write Your Review</h3>
            <ReviewForm productId={productId} onSubmit={() => setShowForm(false)} />
          </div>
        )}

        {reviews.length > 0 ? (
          <>
            <RatingSummary reviews={reviews} />

            <div className="mt-8">
              {displayedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {reviews.length > 3 && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent font-medium hover:text-accent-dark transition-colors"
              >
                View all {reviews.length} reviews <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-10 bg-gray-50/50 rounded-xl">
            <Star className="w-8 h-8 mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-ink-light mb-1">No reviews yet</p>
            <p className="text-xs text-ink-faint">Be the first to review this product</p>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="btn-ghost text-sm mt-4">
                Write a Review
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Compact Star Display (for product cards) ─────────── */

export function ProductRatingBadge({ productId }: { productId: string }) {
  const { getAverageRating } = useReviewStore();
  const { average, count } = getAverageRating(productId);
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-xs font-medium text-ink">{average}</span>
      <span className="text-xs text-ink-faint">({count})</span>
    </div>
  );
}
