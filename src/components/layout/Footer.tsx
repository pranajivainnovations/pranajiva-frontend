'use client'

import Link from 'next/link'
import { Heart, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-sage-primary text-cream border-t border-champagne/20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-cream text-2xl font-serif font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              PranaJiva
            </h3>
            <p className="text-cream/80 text-sm mb-4" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
              Premium wellness products crafted with care, delivered with discretion.
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-champagne transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-champagne transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-champagne transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream text-2xl font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
              <li>
                <Link href="/shop" className="text-cream/80 hover:text-champagne transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="text-cream/80 hover:text-champagne transition-colors">
                  Knowledge Center
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cream/80 hover:text-champagne transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-cream/80 hover:text-champagne transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-cream/80 hover:text-champagne transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-cream text-2xl font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
              <li>
                <Link href="/return-policy" className="text-cream/80 hover:text-champagne transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-cream/80 hover:text-champagne transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-cream/80 hover:text-champagne transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-cream/80 hover:text-champagne transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/age-verification" className="text-cream/80 hover:text-champagne transition-colors">
                  Age Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-cream text-2xl font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
              <li className="flex items-start space-x-2 text-cream/80">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <a href="mailto:support@pranajiva.in" className="hover:text-champagne transition-colors">
                  support@pranajiva.in
                </a>
              </li>
              <li className="flex items-start space-x-2 text-cream/80">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-champagne transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-start space-x-2 text-cream/80">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>

            {/* Privacy Badge */}
            <div className="mt-4 p-3 bg-cream/10 rounded-lg border border-champagne/20">
              <p className="text-xs text-cream/70" style={{ fontFamily: 'Space Mono, monospace' }}>
                🔒 Your privacy is our priority. All orders shipped discreetly.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-champagne/20 pt-6">
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-cream/70" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
              © {currentYear} PranaJiva. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-1 text-sm text-cream/70">
              <span style={{ fontFamily: 'Josefin Sans, sans-serif' }}>Made with</span>
              <Heart size={14} className="text-champagne fill-champagne" />
              <span style={{ fontFamily: 'Josefin Sans, sans-serif' }}>for your wellness</span>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-cream/60" style={{ fontFamily: 'Space Mono, monospace' }}>
                We Accept:
              </span>
              <div className="flex space-x-2">
                <div className="px-2 py-1 bg-cream/20 rounded text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                  Razorpay
                </div>
                <div className="px-2 py-1 bg-cream/20 rounded text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                  COD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
