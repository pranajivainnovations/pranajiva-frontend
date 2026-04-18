'use client'

import Link from 'next/link'
import { Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Collections', href: '/collections' },
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
