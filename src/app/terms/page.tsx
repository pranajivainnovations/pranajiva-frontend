import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | PranaJiva',
  description: 'Terms and conditions for using PranaJiva wellness platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-unbleached to-cream pb-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Terms of Service
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            Last Updated: January 22, 2026
          </p>
        </div>

        {/* Content */}
        <div className="card-premium p-8 space-y-8" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
          
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Welcome to PranaJiva. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully before making a purchase.
            </p>
          </section>

          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700">
              By creating an account, placing an order, or using any part of pranajiva.in, you agree to these Terms of Service, our Privacy Policy, and all applicable laws and regulations. If you do not agree, please discontinue use immediately.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              2. Eligibility & Age Restriction
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-gray-700 font-semibold">
                ⚠️ You must be at least 18 years old to use our services.
              </p>
            </div>
            <p className="text-gray-700">
              By using PranaJiva, you represent and warrant that you are of legal age in your jurisdiction to form a binding contract. We reserve the right to verify age through documentation if necessary.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              3. Account Registration
            </h2>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must provide accurate, current, and complete information</li>
              <li>You are liable for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>One account per person; multiple accounts may be suspended</li>
            </ul>
          </section>

          {/* Product Information */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              4. Product Information & Availability
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>• We strive to display accurate product information, but cannot guarantee complete accuracy.</p>
              <p>• Product images are for illustrative purposes and may vary slightly from actual items.</p>
              <p>• All products are subject to availability. We reserve the right to limit quantities.</p>
              <p>• Prices are subject to change without notice, but orders already placed will honor the price at checkout.</p>
            </div>
          </section>

          {/* Orders & Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              5. Orders & Payment
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Order Placement</h3>
                <ul className="space-y-1 text-gray-700 list-disc list-inside ml-4">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                  <li>Order confirmation does not guarantee acceptance</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Payment Terms</h3>
                <ul className="space-y-1 text-gray-700 list-disc list-inside ml-4">
                  <li>Payment must be received before order processing</li>
                  <li>We accept credit/debit cards, UPI, net banking, and COD</li>
                  <li>All payments are processed securely via Razorpay (PCI-DSS compliant)</li>
                  <li>Billing descriptor will show "PJ WELLNESS SERVICES"</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Pricing</h3>
                <p className="text-gray-700">
                  All prices are in Indian Rupees (INR) and include applicable taxes (GST). Shipping charges are calculated at checkout based on delivery location.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping & Delivery */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              6. Shipping & Delivery
            </h2>
            <div className="bg-sage-primary/10 border border-sage-primary/30 rounded-lg p-4">
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Standard delivery: 5-7 business days</li>
                <li>Express delivery: 2-3 business days (where available)</li>
                <li>All packages shipped discreetly with plain packaging</li>
                <li>Sender name: "PJ Wellness" (no branding or product details)</li>
                <li>Delivery times are estimates and not guaranteed</li>
                <li>We are not liable for delays caused by courier services or force majeure events</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              See our <a href="/shipping-policy" className="text-sage-primary hover:underline">Shipping Policy</a> for complete details.
            </p>
          </section>

          {/* Returns & Refunds */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              7. Returns & Refunds
            </h2>
            <p className="text-gray-700 mb-3">
              Returns are accepted within specified timeframes for eligible products. Intimate wellness products are non-returnable once opened due to hygiene regulations.
            </p>
            <p className="text-sm text-gray-600">
              Full details in our <a href="/return-policy" className="text-sage-primary hover:underline">Return & Refund Policy</a>.
            </p>
          </section>

          {/* Prohibited Use */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              8. Prohibited Activities
            </h2>
            <p className="text-gray-700 mb-3">You agree NOT to:</p>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Resell products purchased from PranaJiva without authorization</li>
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to hack, reverse-engineer, or compromise our platform</li>
              <li>Scrape or collect data using automated tools</li>
              <li>Impersonate another person or entity</li>
              <li>Upload malicious code or viruses</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              Violation may result in account suspension and legal action.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              9. Intellectual Property
            </h2>
            <p className="text-gray-700 mb-3">
              All content on pranajiva.in—including text, graphics, logos, images, and software—is the property of PranaJiva or its licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700">
              You may not reproduce, distribute, modify, or create derivative works without our express written permission.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              10. User-Generated Content
            </h2>
            <p className="text-gray-700 mb-3">
              By submitting reviews, testimonials, or other content, you grant PranaJiva a perpetual, royalty-free license to use, display, and distribute your content for marketing purposes.
            </p>
            <p className="text-gray-700">
              You represent that your content does not violate any third-party rights and is accurate.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              11. Disclaimers & Limitation of Liability
            </h2>
            <div className="bg-champagne/10 border border-champagne/30 rounded-lg p-4 space-y-3">
              <p className="text-gray-700 font-semibold">Disclaimer of Warranties:</p>
              <p className="text-gray-700 text-sm">
                Our products and services are provided "AS IS" without warranties of any kind, express or implied. We do not guarantee that the website will be error-free or uninterrupted.
              </p>
              <p className="text-gray-700 font-semibold mt-4">Medical Disclaimer:</p>
              <p className="text-gray-700 text-sm">
                Products are not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare professional before use if you have medical conditions.
              </p>
              <p className="text-gray-700 font-semibold mt-4">Limitation of Liability:</p>
              <p className="text-gray-700 text-sm">
                PranaJiva shall not be liable for any indirect, incidental, or consequential damages arising from use of our products or services. Our total liability shall not exceed the amount paid for the product in question.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              12. Indemnification
            </h2>
            <p className="text-gray-700">
              You agree to indemnify and hold PranaJiva harmless from any claims, losses, or damages arising from your use of the website, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              13. Privacy & Data Protection
            </h2>
            <p className="text-gray-700">
              Your use of PranaJiva is governed by our <a href="/privacy-policy" className="text-sage-primary hover:underline">Privacy Policy</a>, which explains how we collect, use, and protect your data. We are committed to maintaining the highest standards of discretion and confidentiality.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              14. Governing Law & Jurisdiction
            </h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of India. Any disputes arising from these Terms or use of our services shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              15. Termination
            </h2>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion, with or without notice. Upon termination, you must cease all use of the website.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              16. Modifications to Terms
            </h2>
            <p className="text-gray-700">
              We may update these Terms from time to time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use after changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              17. Severability
            </h2>
            <p className="text-gray-700">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms of Service:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>📧 Email: <a href="mailto:legal@pranajiva.in" className="text-sage-primary hover:underline">legal@pranajiva.in</a></p>
              <p>📞 Phone: <a href="tel:+911234567890" className="text-sage-primary hover:underline">+91 123 456 7890</a></p>
              <p>🏢 Company: PranaJiva Wellness Pvt. Ltd.</p>
              <p>📍 Address: Mumbai, Maharashtra, India</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
