import React from 'react'
import Button from './Button'
import Tag from './ui/Tag'
import Icon from './ui/Icon'
import { FaSearch, FaArrowRight } from 'react-icons/fa'

const Component24 = ({
  tagText = "Rejoignez + 100 prestataires",
  titlePart1 = "Getting Started is ",
  titlePart2 = "Easy",
  description = "Book your first laundry service in minutes and enjoy fresh, perfectly cleaned clothes without the hassle. Simple scheduling, reliable pickup, and fast delivery—so you can focus on what matters most.",
  ctaButtonText = "Become a Provider",
  rightSideItems = [
    {
      icon: FaSearch,
      title: "Find Providers",
      description: "Browse local laundry shops and independent providers. Use filters to find the perfect match for your needs."
    }
  ]
}) => {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side */}
          <div className="space-y-6">
            {/* Tag */}
            <div>
              <Tag>{tagText}</Tag>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-[#1E2A36]">{titlePart1}</span>
              <span className="text-[#0EA5C9]">{titlePart2}</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-[#62707D] leading-relaxed max-w-xl">
              {description}
            </p>

            {/* CTA Button */}
            <div>
             <Link to="become-provider">
             <Button variant="primary" icon={<Icon icon={FaArrowRight} theme="light" size="md" />}>
                {ctaButtonText}
              </Button> 
            </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {rightSideItems && rightSideItems.length > 0 && rightSideItems.map((item, index) => (
              <div key={index} className="flex gap-4">
                {/* Icon Box */}
                <div className="flex-shrink-0 w-12 h-12 bg-[#0EA5C9] rounded-lg flex items-center justify-center">
                  <Icon icon={item.icon || FaSearch} theme="light" size="md" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1E2A36] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#62707D] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component24

