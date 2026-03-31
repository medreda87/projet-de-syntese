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
  backgroundColor = "bg-[#F7F9FA]",
  iconBackgroundColor = "bg-[#E0F2FE]",
  iconColor = "text-[#0EA5C9]",
  titleColor = "text-[#1E2A36]",
  descriptionColor = "text-[#62707D]"
}) => {
  return (
    <div className={`${backgroundColor} border-b-2 py-10 `}>
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-1">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="flex gap-2 items-center">
                {/* Icon Container */}
                <div className={`${iconBackgroundColor} rounded-md p-1 mb-3 flex items-center justify-center`}>
                  <Icon
                    icon={IconComponent}
                    theme="primary"
                    size="md"
                    className={iconColor}
                  />
                </div>

                <div>
                  {/* Title */}
                <h3 className={`font-medium ${titleColor}  text-sm md:text-[14px]`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className={`text-xs md:text-sm ${descriptionColor}`}>
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


