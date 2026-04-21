import React from 'react'
import Icon from './ui/Icon'
import { FaShieldAlt, FaCheckCircle, FaCreditCard, FaClock, FaHeadphones, FaRedo } from 'react-icons/fa'

const Component3 = ({
  features = [
    {
      icon: FaShieldAlt,
      title: "Secure Payments",
      description: "256-bit SSL encryption"
    },
    {
      icon: FaCheckCircle,
      title: "Verified Providers",
      description: "All providers vetted"
    },
    {
      icon: FaCreditCard,
      title: "Money-Back Guarantee",
      description: "Full refund policy"
    },
    {
      icon: FaClock,
      title: "On-Time Delivery",
      description: "Guaranteed turnaround"
    },
    {
      icon: FaHeadphones,
      title: "24/7 Support",
      description: "Always here to help"
    },
    {
      icon: FaRedo,
      title: "Free Re-clean",
      description: "Not satisfied? Free redo"
    }
  ],
  backgroundColor = "bg-white",
  iconBackgroundColor = "bg-[#0C8CE9]/8",
  iconColor = "text-[#0C8CE9]",
  titleColor = "text-[#0F172A]",
  descriptionColor = "text-[#64748B]"
}) => {
  return (
    <div className={`${backgroundColor} border-b border-gray-100 py-6`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-2">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="flex gap-2.5 items-center">
                {/* Icon Container */}
                <div className={`${iconBackgroundColor} rounded-lg p-2 flex items-center justify-center flex-shrink-0`}>
                  <Icon
                    icon={IconComponent}
                    theme="primary"
                    size="md"
                    className={iconColor}
                  />
                </div>

                <div>
                  {/* Title */}
                <h3 className={`font-semibold ${titleColor} text-[13px] leading-tight`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className={`text-xs ${descriptionColor} mt-0.5`}>
                  {feature.description}
                </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Component3


