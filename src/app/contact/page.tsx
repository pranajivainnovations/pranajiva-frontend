'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-unbleached to-cream pb-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-primary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Get In Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            Have questions about our products or services? We're here to help. Reach out through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Cards */}
            <div className="card-premium p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-sage-primary/10 p-3 rounded-full">
                  <Mail className="text-sage-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Email Us
                  </h3>
                  <a href="mailto:support@pranajiva.in" className="text-sage-primary hover:underline text-sm" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    support@pranajiva.in
                  </a>
                  <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-champagne/30 p-3 rounded-full">
                  <Phone className="text-sage-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Call Us
                  </h3>
                  <a href="tel:+911234567890" className="text-sage-primary hover:underline text-sm" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    +91 123 456 7890
                  </a>
                  <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    Mon-Sat, 10 AM - 7 PM IST
                  </p>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-sage-primary/10 p-3 rounded-full">
                  <MapPin className="text-sage-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Visit Us
                  </h3>
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    PranaJiva Wellness Pvt. Ltd.<br />
                    Mumbai, Maharashtra<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-champagne/30 p-3 rounded-full">
                  <Clock className="text-sage-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Business Hours
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    <p><strong>Mon - Sat:</strong> 10 AM - 7 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-sage-primary/10 border border-sage-primary/30 rounded-lg p-4">
              <p className="text-xs text-gray-700" style={{ fontFamily: 'Space Mono, monospace' }}>
                🔒 All communications are handled with complete confidentiality and discretion.
              </p>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card-premium p-8">
              <h2 className="text-2xl font-semibold text-sage-primary mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Send Us a Message
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                  ✓ Thank you! Your message has been sent successfully. We'll respond within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-primary focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-primary focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-primary focus:border-transparent"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-primary focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="order-status">Order Status</option>
                    <option value="return-refund">Return / Refund</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="feedback">Feedback / Suggestion</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-primary focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-velvet w-full py-4 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-600 text-center">
                  By submitting this form, you agree to our <a href="/privacy-policy" className="text-sage-primary hover:underline">Privacy Policy</a>.
                </p>

              </form>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-sage-primary mb-8 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="card-premium p-6">
              <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                How long does shipping take?
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available in select cities. See our <a href="/shipping-policy" className="text-sage-primary hover:underline">Shipping Policy</a>.
              </p>
            </div>

            <div className="card-premium p-6">
              <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Is my purchase discreet?
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                Absolutely. All packages are shipped in plain brown boxes with "PJ Wellness" as the sender. Billing shows "PJ WELLNESS SERVICES."
              </p>
            </div>

            <div className="card-premium p-6">
              <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Can I return a product?
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                Yes, within 15-30 days depending on product type. Unopened intimate products are returnable. Check our <a href="/return-policy" className="text-sage-primary hover:underline">Return Policy</a>.
              </p>
            </div>

            <div className="card-premium p-6">
              <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Are your products certified?
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                Yes, all products are body-safe, quality-tested, and sourced from trusted brands. We provide certifications upon request.
              </p>
            </div>

          </div>

          <div className="text-center mt-8">
            <p className="text-gray-700 mb-4" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
              Still have questions?
            </p>
            <a href="/knowledge" className="text-sage-primary hover:underline font-medium" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
              Visit our Knowledge Center →
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
