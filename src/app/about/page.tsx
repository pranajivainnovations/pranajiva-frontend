import type { Metadata } from 'next'
import { Heart, Shield, Package, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | PranaJiva',
  description: 'Learn about PranaJiva - Your trusted partner in wellness with a commitment to quality and discretion.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-unbleached to-cream pb-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-sage-primary mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            About PranaJiva
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            Where ancient wellness wisdom meets modern discretion. We believe that personal care should be both premium and private.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="card-premium p-8 mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="text-sage-primary" size={32} />
            <h2 className="text-3xl font-semibold text-sage-primary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Our Mission
            </h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            To empower individuals on their wellness journey by providing premium, thoughtfully curated intimate wellness products delivered with absolute discretion. We're redefining how people approach personal care—with openness, education, and respect for privacy.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-sage-primary mb-6 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Our Story
          </h2>
          <div className="card-premium p-8 space-y-4" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            <p className="text-gray-700 leading-relaxed">
              PranaJiva was born from a simple realization: wellness is deeply personal, and privacy matters. In 2025, our founders noticed a gap in the Indian market—while global wellness trends were booming, there was a lack of trustworthy, discreet platforms for intimate wellness products.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We set out to change that. "Prana" (life force) + "Jiva" (living being) reflects our belief that wellness is about nurturing your entire self—body, mind, and spirit. Every product we offer is carefully selected for quality, safety, and efficacy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, we're proud to serve thousands of customers across India, helping them embrace wellness without compromise. Our commitment to discretion, education, and premium quality remains unwavering.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-sage-primary mb-8 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Privacy First */}
            <div className="card-premium p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-sage-primary/10 p-3 rounded-full">
                  <Shield className="text-sage-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Privacy First
                  </h3>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    Every order is shipped in plain packaging with discreet billing. Your wellness journey is your business alone.
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Quality */}
            <div className="card-premium p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-champagne/30 p-3 rounded-full">
                  <Package className="text-sage-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Premium Quality
                  </h3>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    We source only certified, body-safe products from trusted brands. Quality is non-negotiable.
                  </p>
                </div>
              </div>
            </div>

            {/* Education & Empowerment */}
            <div className="card-premium p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-sage-primary/10 p-3 rounded-full">
                  <Users className="text-sage-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Education & Empowerment
                  </h3>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    Our Knowledge Center offers science-backed articles to help you make informed choices about wellness.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer-Centric */}
            <div className="card-premium p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-champagne/30 p-3 rounded-full">
                  <Heart className="text-sage-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Customer-Centric
                  </h3>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    Your satisfaction and comfort are our top priorities. We're here to support you every step of the way.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-sage-primary mb-8 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Why Choose PranaJiva?
          </h2>
          <div className="card-premium p-8" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <span className="text-sage-primary text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-800">100% Discreet Delivery</p>
                  <p className="text-sm text-gray-600">Plain packaging, no branding</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-sage-primary text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-800">Certified Products</p>
                  <p className="text-sm text-gray-600">Body-safe, quality-tested items</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-sage-primary text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-800">Secure Payments</p>
                  <p className="text-sm text-gray-600">PCI-DSS compliant checkout</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-sage-primary text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-800">Expert Support</p>
                  <p className="text-sm text-gray-600">Friendly, non-judgmental assistance</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-sage-primary text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-800">Pan-India Shipping</p>
                  <p className="text-sm text-gray-600">Fast delivery to all locations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-sage-primary text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-800">Easy Returns</p>
                  <p className="text-sm text-gray-600">Hassle-free return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Collections */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-sage-primary mb-8 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Our Collections
          </h2>
          <div className="grid md:grid-cols-4 gap-6" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            
            <div className="card-premium p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="font-semibold text-gray-800 mb-2">Core Essentials</h3>
              <p className="text-sm text-gray-600">Foundation supplements for daily vitality</p>
            </div>

            <div className="card-premium p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-semibold text-gray-800 mb-2">Vedic Rituals</h3>
              <p className="text-sm text-gray-600">Ayurvedic formulations rooted in tradition</p>
            </div>

            <div className="card-premium p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">💫</div>
              <h3 className="font-semibold text-gray-800 mb-2">Glow Care</h3>
              <p className="text-sm text-gray-600">Beauty and radiance from within</p>
            </div>

            <div className="card-premium p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🌸</div>
              <h3 className="font-semibold text-gray-800 mb-2">Intimate Wellness</h3>
              <p className="text-sm text-gray-600">Premium intimate wellness essentials</p>
            </div>

          </div>
        </div>

        {/* Commitment */}
        <div className="card-premium p-8 bg-gradient-to-r from-sage-primary/5 to-champagne/10 mb-12">
          <h2 className="text-3xl font-semibold text-sage-primary mb-4 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Our Commitment to You
          </h2>
          <div className="space-y-4 text-gray-700" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            <p className="leading-relaxed">
              At PranaJiva, we understand that wellness is a journey, not a destination. We're committed to being your trusted partner—offering not just products, but knowledge, support, and a judgment-free space.
            </p>
            <p className="leading-relaxed">
              We believe everyone deserves access to quality wellness products without stigma or judgment. Whether you're exploring for the first time or expanding your wellness routine, we're here to guide you with empathy and expertise.
            </p>
            <p className="leading-relaxed font-semibold text-center text-sage-primary">
              Your wellness, your way—always private, always premium.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Ready to Begin Your Wellness Journey?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/shop" className="btn-velvet inline-block px-8 py-3 rounded-full text-center">
              Explore Products
            </a>
            <a 
              href="/knowledge" 
              className="inline-block px-8 py-3 rounded-full text-center border-2 border-sage-primary text-sage-primary hover:bg-sage-primary hover:text-cream transition-colors"
              style={{ fontFamily: 'Josefin Sans, sans-serif' }}
            >
              Visit Knowledge Center
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
