import React from 'react'
import TitleSectionText from './ui/TitleSectionText'
import Icon from './ui/Icon'
import { FaHeart, FaShieldAlt, FaBolt, FaUsers } from 'react-icons/fa'

const Component19 = ({
  tagText = null,
  titlePart1 = "Our Values",
  description = "The principles that guide everything we do",
  values = [
    {
      icon: FaHeart,
      title: "Quality First",
      description: "We partner only with providers who meet our high standards for service quality and customer care."
    },
    {
      icon: FaShieldAlt,
      title: "Trust & Safety",
      description: "Every provider is verified. Every payment is secure. Your trust is our priority."
    },
    {
      icon: FaBolt,
      title: "Speed & Convenience",
      description: "Fast turnaround times and seamless booking. Fresh laundry shouldn't take forever."
    },
    {
      icon: FaUsers,
      title: "Community Focus",
      description: "Supporting local laundry businesses and creating opportunities for independent providers."
    }
  ]
}) => {
  return (
    <div className="bg-[#F7F9FA] py-16 px-4">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <TitleSectionText
            tagText={tagText}
            titlePart1={titlePart1}
            description={description}
            descriptionClass="mx-auto"
          />
        </div>

        {/* Values Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const IconComponent = value.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-primary hover:shadow-primary-md transition-shadow duration-200"
              >
                {/* Icon */}
                <div className="mb-4">
                  <Icon
                    icon={IconComponent}
                    theme="primary"
                    size="xl"
                    className="text-[#0EA5C9]"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#1E2A36] mb-3">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-[#62707D] leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Component19

