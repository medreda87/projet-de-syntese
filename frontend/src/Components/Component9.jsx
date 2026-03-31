import React from 'react'
import TitleSectionText from './ui/TitleSectionText'
import Button from './Button'
import Icon from './ui/Icon'
import { FaArrowRight, FaUsers, FaChartLine, FaDollarSign, FaShieldAlt, FaClock, FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Component9 = ({
  tagText = null,
  titlePart1 = "Why Partner with <span>FreshFold?</span>",
  description = "We provide everything you need to succeed in the laundry business.",
  ctaButtonText = "Become Provier",
  cards = [
    {
      icon: FaUsers,
      title: "Reach More Customers",
      description: "Get discovered by thousands of customers actively looking for laundry services."
    },
    {
      icon: FaChartLine,
      title: "Grow Your Business",
      description: "Expand your customer base and increase your revenue with our marketing tools."
    },
    {
      icon: FaDollarSign,
      title: "Competitive Pricing",
      description: "Set your own prices and keep more of what you earn with low platform fees."
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payments",
      description: "Get paid on time with our secure payment processing system."
    },
    {
      icon: FaClock,
      title: "Flexible Schedule",
      description: "Work on your own terms. Accept orders when it suits your business."
    },
    {
      icon: FaStar,
      title: "Build Your Reputation",
      description: "Collect reviews and ratings to stand out from the competition."
    }
  ],
  onCtaClick,
}) => {

  return (
    <div className="bg-primary-light py-16 px-4">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <TitleSectionText
            tagText={tagText}
            titlePart1={titlePart1}
            description={description}
            descriptionClass="mx-auto"
            
          />
        </div>

        {/* Service Cards Grid - 3x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 mb-12">
          {cards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <div
                key={index}
                className="bg-white relative  rounded-xl shadow-sm px-6  py-[50px] hover:shadow-md transition-shadow duration-200"
              >
                {/* Icon */}
                <div className="mb-4 left-[-10px] bg-primary-light rounded-xl p-3 top-[-10px] absolute">
                  <Icon
                    icon={IconComponent}
                    theme="primary"
                    size="lg"
                    className="text-[#0EA5C9]"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-dark mb-3">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-[#62707D] leading-relaxed">
                  {card.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <a href="#register">
          <Button
            variant="primary"
            icon={<Icon icon={FaArrowRight} theme="light" size="sm" />}
            onClick={onCtaClick}
            className="mx-auto"
            size="lg"
          >
            {ctaButtonText}
          </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Component9

