import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Return & Refund Policy | PranaJiva',
  description: 'Learn about our hassle-free return and refund policy for wellness products.',
}

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-unbleached to-cream pb-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Return & Refund Policy
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
              At PranaJiva, we are committed to your satisfaction and wellness journey. We understand that sometimes products may not meet your expectations. This policy outlines our return, refund, and exchange procedures.
            </p>
          </section>

          {/* Return Window */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Return Window
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>• <strong>Standard Products:</strong> 30 days from delivery date</p>
              <p>• <strong>Intimate Wellness Products:</strong> 15 days from delivery (due to hygiene regulations)</p>
              <p>• <strong>Consumables:</strong> 7 days from delivery (if unopened)</p>
              <p className="text-sm text-gray-600 mt-4">
                Products must be unused, in original packaging, and with all tags/seals intact.
              </p>
            </div>
          </section>

          {/* Eligible Returns */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Eligible for Return
            </h2>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Defective or damaged products upon arrival</li>
              <li>Wrong product delivered</li>
              <li>Product does not match description</li>
              <li>Missing accessories or components</li>
              <li>Change of mind (within return window, subject to conditions)</li>
            </ul>
          </section>

          {/* Non-Returnable Items */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Non-Returnable Items
            </h2>
            <div className="bg-champagne/10 border border-champagne/30 rounded-lg p-4">
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Opened or used intimate wellness products (for hygiene reasons)</li>
                <li>Consumable products that have been opened</li>
                <li>Personalized or customized items</li>
                <li>Products without original packaging or tags</li>
                <li>Sale or clearance items (marked "Final Sale")</li>
                <li>Digital products or gift cards</li>
              </ul>
            </div>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              How to Initiate a Return
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="bg-sage-primary text-cream rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <p className="font-semibold">Contact Our Support Team</p>
                  <p className="text-sm text-gray-600">Email us at support@pranajiva.in or call +91 123 456 7890 with your order number.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-sage-primary text-cream rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <p className="font-semibold">Receive Return Authorization</p>
                  <p className="text-sm text-gray-600">Our team will review your request and provide a Return Merchandise Authorization (RMA) number.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-sage-primary text-cream rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <p className="font-semibold">Pack the Product</p>
                  <p className="text-sm text-gray-600">Securely pack the item with original packaging, tags, and include the RMA number.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-sage-primary text-cream rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  4
                </div>
                <div>
                  <p className="font-semibold">Ship the Return</p>
                  <p className="text-sm text-gray-600">We'll provide a prepaid return label via email. Drop off at nearest courier location.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Refund Processing
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>• Refunds are processed within <strong>5-7 business days</strong> after we receive the returned item.</p>
              <p>• Refunds are issued to the original payment method.</p>
              <p>• For COD orders, refunds are processed via bank transfer (requires account details).</p>
              <p>• Shipping charges are non-refundable unless the return is due to our error.</p>
              <p className="text-sm text-gray-600 mt-4">
                Please allow 5-10 business days for the refund to reflect in your account, depending on your bank.
              </p>
            </div>
          </section>

          {/* Exchanges */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Exchanges
            </h2>
            <p className="text-gray-700">
              We currently do not offer direct exchanges. If you need a different product, please return the original item for a refund and place a new order for the desired product.
            </p>
          </section>

          {/* Damaged/Defective */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Damaged or Defective Products
            </h2>
            <div className="bg-sage-primary/10 border border-sage-primary/30 rounded-lg p-4">
              <p className="text-gray-700 mb-3">
                If you receive a damaged or defective product:
              </p>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Contact us within <strong>48 hours</strong> of delivery</li>
                <li>Provide photos of the damage/defect</li>
                <li>We'll arrange for free return pickup</li>
                <li>Receive full refund or replacement at no extra cost</li>
              </ul>
            </div>
          </section>

          {/* Privacy Note */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Privacy & Discretion
            </h2>
            <p className="text-gray-700">
              All return communications and packages maintain our commitment to discretion. Returns are processed under "PJ Wellness" with no product details visible on external packaging.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Questions?
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our return policy, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>📧 Email: <a href="mailto:support@pranajiva.in" className="text-sage-primary hover:underline">support@pranajiva.in</a></p>
              <p>📞 Phone: <a href="tel:+911234567890" className="text-sage-primary hover:underline">+91 123 456 7890</a></p>
              <p>⏰ Support Hours: Monday - Saturday, 10 AM - 7 PM IST</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
