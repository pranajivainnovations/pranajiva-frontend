'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react'
import { useToastStore } from '@/stores/toast-store'

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Collections', href: '/collections' },
    { label: 'Wellness Journey', href: '/journey' },
    { label: 'Knowledge Center', href: '/knowledge' },
    { label: 'About Us', href: '/about' },
  ],
  support: [
    { label: 'Return & Refund', href: '/return-policy' },
    { label: 'Shipping', href: '/shipping-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useToastStore()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || isSubmitting) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      addToast('Please enter a valid email address', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      // Store in localStorage as a simple subscribe list (no backend needed)
      const stored = JSON.parse(localStorage.getItem('pj-newsletter') || '[]')
      if (!stored.includes(email.toLowerCase())) {
        stored.push(email.toLowerCase())
        localStorage.setItem('pj-newsletter', JSON.stringify(stored))
      }
      addToast('Welcome to our wellness community!', 'success')
      setEmail('')
    } catch {
      addToast('Something went wrong. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-brand-dark text-white/70">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-14">
          <div className="lg:col-span-1">
            <h3 className="font-heading text-2xl text-white mb-4">PranaJiva</h3>
            <p className="text-sm leading-relaxed mb-6 font-light">
              Premium wellness products crafted with care, delivered with discretion.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="label text-[10px] text-white/40 mb-5">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm font-light hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label text-[10px] text-white/40 mb-5">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm font-light hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label text-[10px] text-white/40 mb-5">Contact</h4>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="mt-1 flex-shrink-0 text-white/40" />
                <a href="mailto:support@pranajiva.in" className="hover:text-white transition-colors">
                  support@pranajiva.in
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="mt-1 flex-shrink-0 text-white/40" />
                <a href="tel:+919821101868" className="hover:text-white transition-colors">
                  +91 982 110 1868
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-1 flex-shrink-0 text-white/40" />
                <span>Ghaziabad, Uttar Pradesh, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/[0.06] pt-10 pb-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-heading text-lg text-white mb-2">Join Our Wellness Circle</h4>
            <p className="text-sm text-white/50 mb-5">
              Tips, rituals, and early access to new products.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-sm text-white placeholder:text-white/30 outline-none focus:border-accent/50 transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30 font-light">
            &copy; {currentYear} PranaJiva. All rights reserved.
          </p>
          <p className="text-xs text-white/30 font-light">
            All orders shipped discreetly &middot; Razorpay &middot; COD
          </p>
        </div>
      </div>
    </footer>
  )
}
