'use client'

import { Package, CreditCard, Shield } from 'lucide-react'

export default function DiscretionSection() {
  return (
    <section className="w-full bg-[#2D3A30] py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <h2 
          className="text-4xl md:text-6xl lg:text-5xl text-[#E2D192] mb-6 italic font-serif"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Absolute Discretion, Hand-Packed
        </h2>
        
        {/* Sub-header */}
        <p 
          className="text-[#F5F5DC] text-base md:text-lg max-w-[1100px] mx-auto mb-16 opacity-90"
          style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
        >
          Your privacy is paramount. From packaging to payment, every detail is designed to protect your confidentiality. The sender name on your statement will appear as "PJ Wellness". No logos, no mentions of the contents. Your sanctuary remains yours alone.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Item 01 */}
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div className="mb-4">
              <Package className="text-[#E2D192]" size={48} strokeWidth={1.5} />
            </div>
            
            {/* Index Number */}
            <span 
              className="text-[#E2D192] text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
            >
              01
            </span>
            
            {/* Title */}
            <h3 
              className="text-[#F5F5DC] text-sm md:text-base uppercase tracking-[0.15em] font-semibold mb-3"
              style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
            >
              Stealth Pack
            </h3>
            
            {/* Description */}
            <p 
              className="text-[#F5F5DC] text-sm opacity-80 max-w-[280px]"
              style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
            >
              No branding or product names on outer packaging.
            </p>
          </div>

          {/* Item 02 */}
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div className="mb-4">
              <CreditCard className="text-[#E2D192]" size={48} strokeWidth={1.5} />
            </div>
            
            {/* Index Number */}
            <span 
              className="text-[#E2D192] text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
            >
              02
            </span>
            
            {/* Title */}
            <h3 
              className="text-[#F5F5DC] text-sm md:text-base uppercase tracking-[0.15em] font-semibold mb-3"
              style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
            >
              Neutral Billing
            </h3>
            
            {/* Description */}
            <p 
              className="text-[#F5F5DC] text-sm opacity-80 max-w-[280px]"
              style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
            >
              'PJ Wellness' descriptor for financial privacy.
            </p>
          </div>

          {/* Item 03 */}
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div className="mb-4">
              <Shield className="text-[#E2D192]" size={48} strokeWidth={1.5} />
            </div>
            
            {/* Index Number */}
            <span 
              className="text-[#E2D192] text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
            >
              03
            </span>
            
            {/* Title */}
            <h3 
              className="text-[#F5F5DC] text-sm md:text-base uppercase tracking-[0.15em] font-semibold mb-3"
              style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
            >
              AES-256 Data
            </h3>
            
            {/* Description */}
            <p 
              className="text-[#F5F5DC] text-sm opacity-80 max-w-[280px]"
              style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
            >
              Your personal details are encrypted and never sold.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
