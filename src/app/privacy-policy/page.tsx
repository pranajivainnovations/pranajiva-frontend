import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | PranaJiva',
  description: 'Your privacy is our priority. Learn how we protect your data and maintain discretion.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-unbleached to-cream pb-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Privacy Policy
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            Last Updated: January 22, 2026
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-sage-primary/10 rounded-full">
            <span className="text-sm text-sage-primary" style={{ fontFamily: 'Space Mono, monospace' }}>
              🔒 Your privacy is our top priority
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="card-premium p-8 space-y-8" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
          
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              At PranaJiva, we understand the sensitive nature of wellness products. We are committed to protecting your privacy with the highest standards of data security and discretion. This Privacy Policy explains how we collect, use, protect, and handle your personal information.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Information We Collect
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">1. Personal Information</h3>
                <ul className="space-y-1 text-gray-700 list-disc list-inside ml-4">
                  <li>Name, email address, phone number</li>
                  <li>Shipping and billing address</li>
                  <li>Date of birth (for age verification)</li>
                  <li>Payment information (processed securely via Razorpay)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2. Order Information</h3>
                <ul className="space-y-1 text-gray-700 list-disc list-inside ml-4">
                  <li>Products purchased</li>
                  <li>Order history and preferences</li>
                  <li>Delivery preferences (including stealth mode settings)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">3. Technical Information</h3>
                <ul className="space-y-1 text-gray-700 list-disc list-inside ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information</li>
                  <li>Cookies and usage data (see Cookie Policy below)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              How We Use Your Information
            </h2>
            <div className="bg-champagne/10 border border-champagne/30 rounded-lg p-4">
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li><strong>Process Orders:</strong> Fulfill purchases and arrange discreet delivery</li>
                <li><strong>Communication:</strong> Send order updates, shipping notifications, and customer support</li>
                <li><strong>Account Management:</strong> Maintain your account and privacy preferences</li>
                <li><strong>Personalization:</strong> Improve product recommendations (only with consent)</li>
                <li><strong>Legal Compliance:</strong> Age verification and regulatory requirements</li>
                <li><strong>Security:</strong> Prevent fraud and protect our platform</li>
              </ul>
            </div>
          </section>

          {/* Discretion Commitment */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Our Discretion Commitment
            </h2>
            <div className="bg-sage-primary/10 border border-sage-primary/30 rounded-lg p-4 space-y-3">
              <p className="text-gray-700">
                We understand the importance of privacy for wellness products:
              </p>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li><strong>Billing Statements:</strong> Transactions appear as "PJ WELLNESS SERVICES"</li>
                <li><strong>Packaging:</strong> Plain, unmarked boxes with no product details</li>
                <li><strong>Sender Name:</strong> Packages shipped from "PJ Wellness"</li>
                <li><strong>Email Communications:</strong> Discreet subject lines and content</li>
                <li><strong>Stealth Mode:</strong> Optional privacy mode hides product details in your account</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Data Sharing & Third Parties
            </h2>
            <p className="text-gray-700 mb-3">
              We <strong>never sell</strong> your personal information. We only share data with:
            </p>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="text-sage-primary">✓</span>
                <div>
                  <p className="font-semibold">Payment Processors</p>
                  <p className="text-sm text-gray-600">Razorpay (PCI-DSS compliant) for secure transactions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-sage-primary">✓</span>
                <div>
                  <p className="font-semibold">Logistics Partners</p>
                  <p className="text-sm text-gray-600">Shiprocket for delivery (only name, address, phone - no product details)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-sage-primary">✓</span>
                <div>
                  <p className="font-semibold">Analytics Services</p>
                  <p className="text-sm text-gray-600">Anonymized usage data for improving user experience (opt-out available)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-sage-primary">✓</span>
                <div>
                  <p className="font-semibold">Legal Authorities</p>
                  <p className="text-sm text-gray-600">Only when required by law or to protect rights and safety</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Data Security Measures
            </h2>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Industry-standard SSL/TLS encryption for all data transmission</li>
              <li>Secure database storage with encryption at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Limited employee access with strict confidentiality agreements</li>
              <li>Two-factor authentication for account access</li>
              <li>Automatic session timeout for inactive accounts</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Your Privacy Rights
            </h2>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-unbleached rounded-lg">
                <p className="font-semibold text-gray-800">Access Your Data</p>
                <p className="text-sm text-gray-600">Request a copy of all personal information we hold</p>
              </div>
              <div className="p-3 bg-unbleached rounded-lg">
                <p className="font-semibold text-gray-800">Correct Inaccuracies</p>
                <p className="text-sm text-gray-600">Update or correct your personal details</p>
              </div>
              <div className="p-3 bg-unbleached rounded-lg">
                <p className="font-semibold text-gray-800">Delete Your Data</p>
                <p className="text-sm text-gray-600">Request account deletion (subject to legal obligations)</p>
              </div>
              <div className="p-3 bg-unbleached rounded-lg">
                <p className="font-semibold text-gray-800">Opt-Out</p>
                <p className="text-sm text-gray-600">Unsubscribe from marketing communications anytime</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@pranajiva.in" className="text-sage-primary hover:underline">privacy@pranajiva.in</a>
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Cookie Policy
            </h2>
            <p className="text-gray-700 mb-3">We use cookies for:</p>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li><strong>Essential Cookies:</strong> Required for site functionality (e.g., age verification, cart management)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings (e.g., stealth mode preference)</li>
              <li><strong>Analytics Cookies:</strong> Help us improve user experience (optional, can be disabled)</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              You can control cookies through your browser settings or our cookie consent banner.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Age Restriction
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-gray-700">
                Our services are intended for adults aged <strong>18 years and above</strong>. We do not knowingly collect information from minors. If we discover that we have inadvertently collected data from someone under 18, we will delete it immediately.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Data Retention
            </h2>
            <p className="text-gray-700">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Order history is retained for 7 years for tax and legal compliance. You can request earlier deletion by contacting us.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              International Data Transfers
            </h2>
            <p className="text-gray-700">
              Your data is primarily stored in India. If we transfer data internationally, we ensure adequate safeguards are in place, such as standard contractual clauses or Privacy Shield certification.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Policy Updates
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              For privacy-related questions or to exercise your rights:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>📧 Email: <a href="mailto:privacy@pranajiva.in" className="text-sage-primary hover:underline">privacy@pranajiva.in</a></p>
              <p>📞 Phone: <a href="tel:+911234567890" className="text-sage-primary hover:underline">+91 123 456 7890</a></p>
              <p>📍 Address: PranaJiva Wellness Pvt. Ltd., Mumbai, Maharashtra, India</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
