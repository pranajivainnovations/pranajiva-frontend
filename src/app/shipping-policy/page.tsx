import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy | PranaJiva',
  description: 'Learn about our discreet shipping and delivery process for wellness products.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-unbleached to-cream pb-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Shipping & Delivery Policy
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            Last Updated: January 22, 2026
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-sage-primary/10 rounded-full">
            <span className="text-sm text-sage-primary" style={{ fontFamily: 'Space Mono, monospace' }}>
              📦 Discreet packaging guaranteed
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="card-premium p-8 space-y-8" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
          
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              At PranaJiva, we prioritize your privacy and ensure all orders are shipped discreetly. Our packaging is plain and unmarked, with no indication of the contents or our brand name.
            </p>
          </section>

          {/* Shipping Areas */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Shipping Coverage
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-sage-primary/10 border border-sage-primary/30 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">🇮🇳 Domestic (India)</h3>
                <p className="text-sm text-gray-700">We ship to all states and union territories across India, including remote locations.</p>
              </div>
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">🌍 International</h3>
                <p className="text-sm text-gray-700">Currently not available. Check back for updates on international shipping.</p>
              </div>
            </div>
          </section>

          {/* Delivery Options */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Delivery Options
            </h2>
            
            <div className="space-y-4">
              {/* Standard Delivery */}
              <div className="p-4 border border-champagne/30 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">Standard Delivery</h3>
                  <span className="badge-discreet">Most Popular</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Our standard shipping option for all orders across India.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center space-x-2">
                    <span className="text-sage-primary">✓</span>
                    <span><strong>Delivery Time:</strong> 5-7 business days</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-sage-primary">✓</span>
                    <span><strong>Cost:</strong> ₹50 (Free on orders above ₹999)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-sage-primary">✓</span>
                    <span><strong>Tracking:</strong> Full tracking available</span>
                  </li>
                </ul>
              </div>

              {/* Express Delivery */}
              <div className="p-4 border border-champagne/30 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">Express Delivery</h3>
                  <span className="badge-discreet">Fast Track</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Faster shipping for urgent orders in select metro cities.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center space-x-2">
                    <span className="text-sage-primary">✓</span>
                    <span><strong>Delivery Time:</strong> 2-3 business days</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-sage-primary">✓</span>
                    <span><strong>Cost:</strong> ₹150</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-sage-primary">✓</span>
                    <span><strong>Available in:</strong> Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune</span>
                  </li>
                </ul>
              </div>

              {/* Same Day (Future) */}
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-500">Same Day Delivery</h3>
                  <span className="px-2 py-1 bg-gray-300 text-gray-600 rounded text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Ultra-fast delivery for select pin codes in Mumbai and Delhi (launching Q2 2026).
                </p>
              </div>
            </div>
          </section>

          {/* Discreet Packaging */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Discreet Packaging Standards
            </h2>
            <div className="bg-sage-primary/10 border border-sage-primary/30 rounded-lg p-4">
              <p className="text-gray-700 mb-3 font-semibold">Your privacy is our priority. Every package includes:</p>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li><strong>Plain Brown Box:</strong> No branding, logos, or product details visible</li>
                <li><strong>Sender Name:</strong> "PJ Wellness" (not "PranaJiva" or specific product names)</li>
                <li><strong>Generic Shipping Label:</strong> No mention of wellness or intimate products</li>
                <li><strong>Tamper-Proof Sealing:</strong> Secure packaging to ensure privacy</li>
                <li><strong>Inner Wrapping:</strong> Additional opaque layer for complete discretion</li>
              </ul>
            </div>
          </section>

          {/* Order Processing */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Order Processing Time
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>• <strong>Standard Orders:</strong> Processed within 24-48 hours</p>
              <p>• <strong>Pre-orders:</strong> Shipped as per specified date</p>
              <p>• <strong>Custom Orders:</strong> 5-7 business days processing time</p>
              <p className="text-sm text-gray-600 mt-4">
                Orders placed on weekends or holidays will be processed on the next business day.
              </p>
            </div>
          </section>

          {/* Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Order Tracking
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Once your order is shipped, you'll receive:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-unbleached rounded-lg">
                  <p className="font-semibold text-gray-800">📧 Email Notification</p>
                  <p className="text-sm text-gray-600">Shipping confirmation with tracking number</p>
                </div>
                <div className="p-3 bg-unbleached rounded-lg">
                  <p className="font-semibold text-gray-800">📱 SMS Updates</p>
                  <p className="text-sm text-gray-600">Real-time delivery status on your phone</p>
                </div>
                <div className="p-3 bg-unbleached rounded-lg">
                  <p className="font-semibold text-gray-800">🔗 Live Tracking</p>
                  <p className="text-sm text-gray-600">Track your order on our website or courier partner</p>
                </div>
                <div className="p-3 bg-unbleached rounded-lg">
                  <p className="font-semibold text-gray-800">📍 Delivery ETA</p>
                  <p className="text-sm text-gray-600">Estimated delivery date and time slot</p>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Partners */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Our Logistics Partners
            </h2>
            <p className="text-gray-700 mb-3">
              We work with trusted courier services to ensure safe and timely delivery:
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-champagne/20 rounded-lg text-sm" style={{ fontFamily: 'Space Mono, monospace' }}>
                Shiprocket
              </div>
              <div className="px-4 py-2 bg-champagne/20 rounded-lg text-sm" style={{ fontFamily: 'Space Mono, monospace' }}>
                Blue Dart
              </div>
              <div className="px-4 py-2 bg-champagne/20 rounded-lg text-sm" style={{ fontFamily: 'Space Mono, monospace' }}>
                Delhivery
              </div>
              <div className="px-4 py-2 bg-champagne/20 rounded-lg text-sm" style={{ fontFamily: 'Space Mono, monospace' }}>
                DTDC
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              All partners are briefed on our discretion standards and handle packages with care.
            </p>
          </section>

          {/* Delivery Issues */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Delivery Exceptions
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Failed Delivery Attempts</h3>
                <p className="text-sm text-gray-700 mb-2">
                  If delivery fails due to unavailability or incorrect address:
                </p>
                <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside ml-4">
                  <li>Courier will make up to 3 attempts</li>
                  <li>You'll receive notifications before each attempt</li>
                  <li>Package held at local facility for 7 days</li>
                  <li>After 7 days, order returned to origin (reshipping charges apply)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Address Issues</h3>
                <p className="text-sm text-gray-700">
                  Please ensure your delivery address is complete and accurate. If you need to change the address after order placement, contact us within 2 hours. Address changes after dispatch may not be possible.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Damaged Packages</h3>
                <p className="text-sm text-gray-700">
                  If your package arrives damaged, do not accept delivery. Contact us immediately at support@pranajiva.in with photos. We'll arrange a replacement at no extra cost.
                </p>
              </div>
            </div>
          </section>

          {/* COD */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Cash on Delivery (COD)
            </h2>
            <div className="bg-champagne/10 border border-champagne/30 rounded-lg p-4">
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Available on all orders (no minimum value)</li>
                <li>COD charges: ₹50 per order</li>
                <li>Payment accepted in cash only (exact amount preferred)</li>
                <li>COD not available for pre-orders or custom products</li>
              </ul>
            </div>
          </section>

          {/* Shipping Charges */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Shipping Charges
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 rounded-lg">
                <thead className="bg-sage-primary text-cream">
                  <tr>
                    <th className="p-3 text-left">Order Value</th>
                    <th className="p-3 text-left">Standard Shipping</th>
                    <th className="p-3 text-left">Express Shipping</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="p-3">Below ₹999</td>
                    <td className="p-3">₹50</td>
                    <td className="p-3">₹150</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">₹999 - ₹1,999</td>
                    <td className="p-3 text-green-600 font-semibold">FREE</td>
                    <td className="p-3">₹150</td>
                  </tr>
                  <tr>
                    <td className="p-3">Above ₹1,999</td>
                    <td className="p-3 text-green-600 font-semibold">FREE</td>
                    <td className="p-3 text-green-600 font-semibold">FREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Remote Areas */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Remote & Rural Areas
            </h2>
            <p className="text-gray-700 mb-3">
              Delivery to remote locations may take additional 2-3 days. Pin codes in the following categories may have extended delivery times:
            </p>
            <ul className="space-y-1 text-gray-700 list-disc list-inside ml-4 text-sm">
              <li>Islands (Andaman, Lakshadweep, etc.)</li>
              <li>High-altitude regions (Ladakh, parts of Himachal Pradesh, Uttarakhand)</li>
              <li>Remote Northeast areas</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              Our system will notify you during checkout if your pin code has extended delivery time.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Shipping Support
            </h2>
            <p className="text-gray-700 mb-4">
              For questions about shipping or to track your order:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>📧 Email: <a href="mailto:support@pranajiva.in" className="text-sage-primary hover:underline">support@pranajiva.in</a></p>
              <p>📞 Phone: <a href="tel:+911234567890" className="text-sage-primary hover:underline">+91 123 456 7890</a></p>
              <p>💬 WhatsApp: +91 123 456 7890</p>
              <p>⏰ Support Hours: Monday - Saturday, 10 AM - 7 PM IST</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
