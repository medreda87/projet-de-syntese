import React, { useState } from 'react'
import { ChevronDown, Search, Users, HelpCircle } from 'lucide-react'

const CUSTOMERS_FAQS = [
  {
    question: "Do I need to create an account to browse?",
    answer: "No, you can browse our platform without creating an account. However, creating an account allows you to book services, track orders, and save your preferences."
  },
  {
    question: "How do I know if a provider is trustworthy?",
    answer: "All providers on our platform are verified and have customer reviews. You can check their ratings, read reviews from other customers, and see their verification badges before booking."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit cards, debit cards, and digital payment methods. Payment is processed securely through our platform."
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer: "Yes, you can cancel or reschedule your booking up to 24 hours before the scheduled pickup time. Check the provider's cancellation policy for specific details."
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "If you're not satisfied with the service, please contact our support team within 48 hours. We'll work with you and the provider to resolve the issue."
  }
]

const PROVIDERS_FAQS = [
  {
    question: "How much does it cost to join?",
    answer: "Joining Mesbanati is free! We only charge a small commission fee on completed bookings, so you only pay when you earn."
  },
  {
    question: "How do I get verified?",
    answer: "Complete your profile, submit required documents, and pass our verification process. This typically takes 1-2 business days."
  },
  {
    question: "How and when do I get paid?",
    answer: "Payments are processed weekly via direct deposit or bank transfer. You'll receive your earnings every Monday for the previous week's completed services."
  },
  {
    question: "Can I set my own prices?",
    answer: "Yes, you have full control over your pricing. Set competitive rates for your services and adjust them anytime based on demand and market conditions."
  },
  {
    question: "What if a customer disputes a charge?",
    answer: "Our support team handles all disputes. We'll review the case, communicate with both parties, and work towards a fair resolution."
  }
]

const FAQItem = ({ faq, isOpen, onToggle, accent }) => (
  <div
    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      isOpen
        ? accent === 'blue'
          ? 'border-[#0C8CE9]/30 shadow-md shadow-[#0C8CE9]/8'
          : 'border-[#06D6A0]/30 shadow-md shadow-[#06D6A0]/8'
        : 'border-gray-100 hover:border-gray-200'
    } bg-white`}
  >
    <button
      onClick={onToggle}
      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 group"
    >
      <span className={`font-semibold text-[15px] transition-colors duration-200 ${isOpen ? (accent === 'blue' ? 'text-[#0C8CE9]' : 'text-[#06D6A0]') : 'text-[#0F172A] group-hover:text-[#0F172A]'}`}>
        {faq.question}
      </span>
      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        isOpen
          ? accent === 'blue'
            ? 'bg-[#0C8CE9] text-white rotate-180'
            : 'bg-[#06D6A0] text-white rotate-180'
          : 'bg-gray-100 text-[#64748B]'
      }`}>
        <ChevronDown className="w-4 h-4" />
      </span>
    </button>

    <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
      <div className="overflow-hidden">
        <p className="px-6 pb-5 text-[#64748B] text-sm leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  </div>
)

const Component24 = () => {
  const [openCustomer, setOpenCustomer] = useState(null)
  const [openProvider, setOpenProvider] = useState(null)

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-white">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0C8CE9]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#06D6A0]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0C8CE9] to-[#06D6A0] shadow-lg shadow-[#0C8CE9]/25 mb-6">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4 tracking-tight">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-[#0C8CE9] to-[#06D6A0] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-[#64748B] text-lg max-w-xl mx-auto">
            Got questions? We've got answers.
          </p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Customers */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center">
                <Search className="w-5 h-5 text-[#0C8CE9]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">For Customers</h3>
            </div>
            <div className="space-y-3">
              {CUSTOMERS_FAQS.map((faq, i) => (
                <FAQItem
                  key={i}
                  faq={faq}
                  isOpen={openCustomer === i}
                  onToggle={() => setOpenCustomer(openCustomer === i ? null : i)}
                  accent="blue"
                />
              ))}
            </div>
          </div>

          {/* Providers */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#06D6A0]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">For Providers</h3>
            </div>
            <div className="space-y-3">
              {PROVIDERS_FAQS.map((faq, i) => (
                <FAQItem
                  key={i}
                  faq={faq}
                  isOpen={openProvider === i}
                  onToggle={() => setOpenProvider(openProvider === i ? null : i)}
                  accent="green"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#64748B] text-sm">
            Still have questions?{' '}
            <a href="/contact" className="text-[#0C8CE9] font-semibold hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Component24

