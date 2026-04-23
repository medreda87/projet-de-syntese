import React from 'react'
import TitleSectionText from './ui/TitleSectionText'
import Tag from './ui/Tag'
import Button from './Button'
import Icon from './ui/Icon'
import { FaCheck, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Component18 = ({
  tagText = null,
  titlePart1 = "How We <span>Help</span>",
  description = "Mesbanati creates value for both customers and service providers",
  customersCard = {
    tagText: "For Customers",
    tagVariant: "default",
    heading: "Convenience at Your Fingertips",
    benefits: [
      "Find trusted laundry services instantly",
      "Compare prices and reviews in one place",
      "Book pickup & delivery with ease",
      "Track orders in real-time",
      "Secure payments with buyer protection",
      "Rate and review to help others"
    ],
    buttonText: "Find Services",
    buttonVariant: "primary",
    image: "/images/for-costumer.png"
  },
  providersCard = {
    tagText: "For Providers",
    tagVariant: "default",
    heading: "Grow Your Business",
    benefits: [
      "Zero setup costs to get started",
      "Reach thousands of new customers",
      "Manage orders from one dashboard",
      "Set your own prices and services",
      "Secure weekly payments",
      "Build your reputation with reviews"
    ],
    buttonText: "Become a Provider",
    buttonVariant: "primary",
    image: "/images/for-provider.png"
  },
  onCustomersClick,
  onProvidersClick
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

        {/* Feature Cards - Standalone with images */}
        <div className="space-y-12 mt-12">
          {/* Customers Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Text Content - Left Side */}
              <div className="p-8 flex flex-col">
                <div className="mb-6">
                  <Tag variant={customersCard.tagVariant} className="mb-4">
                    {customersCard.tagText}
                  </Tag>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-6">
                    {customersCard.heading}
                  </h3>
                </div>

                {/* Benefits List */}
                <ul className="space-y-4 flex-1 mb-8">
                  {customersCard.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Icon icon={FaCheck} theme="primary" size="md" className="flex-shrink-0 mt-0.5" />
                      <span className="text-[#0F172A]">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
               <Link to="become-provider">
               <Button
                  variant={customersCard.buttonVariant}
                  icon={<Icon icon={FaArrowRight} theme="light" size="sm" />}
                  onClick={onCustomersClick}
                  className="w-full lg:w-auto"
                >
                  {customersCard.buttonText}
                </Button>
               </Link>
              </div>

              {/* Image - Right Side */}
              {customersCard.image && (
                <div className="w-full h-full min-h-[300px] max-h-[400px]   lg:min-h-full overflow-hidden">
                  <img 
                    src={customersCard.image} 
                    alt={customersCard.heading}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Providers Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image - Left Side (alternating layout) */}
              {providersCard.image && (
                <div className="w-full h-full min-h-[300px] max-h-[400px]   lg:min-h-full overflow-hidden">
                  <img 
                    src={providersCard.image} 
                    alt={providersCard.heading}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Text Content - Right Side */}
              <div className="p-8 flex flex-col order-2 lg:order-2">
                <div className="mb-6">
                  <Tag variant={providersCard.tagVariant} className="mb-4 bg-[#E8F5E9] text-[#06D6A0]">
                    {providersCard.tagText}
                  </Tag>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-6">
                    {providersCard.heading}
                  </h3>
                </div>

                {/* Benefits List */}
                <ul className="space-y-4 flex-1 mb-8">
                  {providersCard.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Icon icon={FaCheck} theme="primary" size="md" className="flex-shrink-0 mt-0.5" />
                      <span className="text-[#0F172A]">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={providersCard.buttonVariant}
                  icon={<Icon icon={FaArrowRight} theme="light" size="sm" />}
                  onClick={onProvidersClick}
                  className="w-full lg:w-auto"
                >
                  {providersCard.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component18

