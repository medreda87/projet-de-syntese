import React, { useState } from 'react'
import TitleSectionText from './ui/TitleSectionText'
import Icon from './ui/Icon'
import { FaQuestionCircle, FaSearch, FaUsers, FaChevronDown } from 'react-icons/fa'

const Component24 = ({
  tagText = null,
  titlePart1 = "Frequently Asked <span>Questions</span>",
  description = "Got questions? We've got answers.",
  descriptionClass="mx-auto",
  headerIcon = FaQuestionCircle,
  customersSection = {
    icon: FaSearch,
    title: "For Customers",
    faqs: [
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
  },
  providersSection = {
    icon: FaUsers,
    title: "For Providers",
    faqs: [
      {
        question: "How much does it cost to join?",
        answer: "Joining FreshFold is free! We only charge a small commission fee on completed bookings, so you only pay when you earn."
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
  }
}) => {
  const [openIndex, setOpenIndex] = useState({ customers: null, providers: null })

  const toggleFAQ = (section, index) => {
    setOpenIndex(prev => ({
      ...prev,
      [section]: prev[section] === index ? null : index
    }))
  }

  return (
    <div className="bg-[#F7F9FA] py-16 px-4">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {headerIcon && (
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#E0F2FE] flex items-center justify-center">
                <Icon icon={headerIcon} theme="primary" size="xl" />
              </div>
            </div>
          )}
          <TitleSectionText
            tagText={tagText}
            titlePart1={titlePart1}
            description={description}
          />
        </div>

        {/* FAQ Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Customers Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Icon icon={customersSection.icon} theme="primary" size="lg" />
              <h3 className="text-2xl font-bold text-[#1E2A36]">
                {customersSection.title}
              </h3>
            </div>
            <div className="space-y-4">
              {customersSection.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-[#DDE2E8] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ('customers', index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[#1E2A36] font-medium pr-4">
                      {faq.question}
                    </span>
                    <Icon
                      icon={FaChevronDown}
                      theme="dark"
                      size="sm"
                      className={`transition-transform duration-200 ${
                        openIndex.customers === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex.customers === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-[#DDE2E8]">
                      <p className="text-[#62707D] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Providers Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Icon icon={providersSection.icon} theme="accent" size="lg" />
              <h3 className="text-2xl font-bold text-[#1E2A36]">
                {providersSection.title}
              </h3>
            </div>
            <div className="space-y-4">
              {providersSection.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-[#DDE2E8] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ('providers', index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[#1E2A36] font-medium pr-4">
                      {faq.question}
                    </span>
                    <Icon
                      icon={FaChevronDown}
                      theme="dark"
                      size="sm"
                      className={`transition-transform duration-200 ${
                        openIndex.providers === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex.providers === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-[#DDE2E8]">
                      <p className="text-[#62707D] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component24

