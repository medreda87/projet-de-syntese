import React from 'react'
import Icon from './ui/Icon'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const Component21 = ({
  emailCard = {
    title: "Email Us",
    subtitle: "We'll respond within 24 hours",
    contact: "support@freshfold.com"
  },
  phoneCard = {
    title: "Call Us",
    subtitle: "Mon-Fri 9AM-6PM",
    contact: "+1 (555) 123-4567"
  },
  visitCard = {
    title: "Visit Us",
    subtitle: "Our headquarters",
    contact: "123 Market Street, SF"
  }
}) => {
  return (
    <div className="bg-[#F7F9FA] py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Us Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#0C8CE9] to-[#06D6A0] flex items-center justify-center">
                <Icon icon={FaEnvelope} theme="light" size="xl" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">
              {emailCard.title}
            </h3>
            <p className="text-[#64748B] text-sm mb-4">
              {emailCard.subtitle}
            </p>
            <a 
              href={`mailto:${emailCard.contact}`}
              className="text-[#0C8CE9] hover:text-[#06D6A0] transition-colors duration-200"
            >
              {emailCard.contact}
            </a>
          </div>

          {/* Call Us Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#0C8CE9] to-[#06D6A0] flex items-center justify-center">
                <Icon icon={FaPhone} theme="light" size="xl" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">
              {phoneCard.title}
            </h3>
            <p className="text-[#64748B] text-sm mb-4">
              {phoneCard.subtitle}
            </p>
            <a 
              href={`tel:${phoneCard.contact.replace(/\s/g, '')}`}
              className="text-[#0C8CE9] hover:text-[#06D6A0] transition-colors duration-200"
            >
              {phoneCard.contact}
            </a>
          </div>

          {/* Visit Us Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#0C8CE9] to-[#06D6A0] flex items-center justify-center">
                <Icon icon={FaMapMarkerAlt} theme="light" size="xl" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">
              {visitCard.title}
            </h3>
            <p className="text-[#64748B] text-sm mb-4">
              {visitCard.subtitle}
            </p>
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(visitCard.contact)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0C8CE9] hover:text-[#06D6A0] transition-colors duration-200"
            >
              {visitCard.contact}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component21
