'use client';

import { motion } from 'framer-motion';
import { BookOpen, Pill, Heart, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';

const categories = [
  {
    icon: Brain,
    name: 'Science',
    description: 'Evidence-based wellness research',
    color: 'bg-prana-sage/10',
  },
  {
    icon: Heart,
    name: 'Ritual',
    description: 'Daily wellness practices',
    color: 'bg-prana-mint/20',
  },
  {
    icon: Pill,
    name: 'Lifestyle',
    description: 'Holistic health guides',
    color: 'bg-prana-champagne/30',
  },
];

interface Article {
  _id: string;
  title: string;
  category: string;
  excerpt?: string;
  publishedAt: string;
  slug: {
    current: string;
  };
}

export default function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/knowledge-center');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-8"
    >
      <header className="text-center mb-12">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-prana-sage" />
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          Knowledge Center
        </h1>
        <p className="text-lg text-charcoal-soft/70 max-w-2xl mx-auto">
          Evidence-based articles and guides for your wellness journey
        </p>
      </header>

      {/* Categories */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-premium p-6 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-prana-sage" />
              </div>
              <h3 className="text-xl font-heading mb-2">{category.name}</h3>
              <p className="text-sm text-charcoal-soft/60">
                {category.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-heading mb-6">
          {loading ? 'Loading Articles...' : articles.length > 0 ? 'Recent Articles' : 'No Articles Yet'}
        </h2>

        {error && (
          <div className="card-premium p-6 bg-error/10 border border-error/20">
            <p className="text-error">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loading-pulse w-16 h-16 rounded-full bg-prana-sage/20"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-charcoal-soft/30" />
            <h3 className="text-xl font-heading mb-2">No articles yet</h3>
            <p className="text-charcoal-soft/60 mb-6">
              Create your first article in Sanity Studio
            </p>
            <a
              href="http://localhost:3333"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-velvet inline-block"
            >
              Open Sanity Studio
            </a>
          </div>
        ) : (
          articles.map((article, index) => (
            <motion.article
              key={article._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-premium p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="tech-label text-prana-sage capitalize">{article.category}</span>
                <span className="text-xs text-charcoal-soft/50">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <h3 className="text-2xl font-heading mb-3">{article.title}</h3>
              {article.excerpt && (
                <p className="text-charcoal-soft/70">{article.excerpt}</p>
              )}
            </motion.article>
          ))
        )}
      </div>

      {/* CMS Integration Status */}
      <div className="mt-12 p-6 bg-prana-mint/10 rounded-2xl border border-prana-mint/20">
        <p className="text-sm text-prana-sage">
          <strong>✅ Sanity CMS Connected!</strong> Articles will be dynamically loaded from your Knowledge Center.
          Visit <a href="http://localhost:3333" target="_blank" rel="noopener noreferrer" className="underline">Sanity Studio</a> to create content.
        </p>
      </div>
    </motion.div>
  );
}
