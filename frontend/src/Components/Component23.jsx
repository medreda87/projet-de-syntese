import React from 'react'
import Button from './Button'
import Icon from './ui/Icon'
import { FaSearch, FaBalanceScale, FaCalendarPlus, FaTruck, FaStar, FaArrowRight } from 'react-icons/fa'
import TitleSectionText from './ui/TitleSectionText'
import { Link } from 'react-router-dom'


const Component23 = ({
  titlePart1 = "Getting started is <br/><span>easy</span>",
  ctaButtonText = "Become a Provider",
  image = '/images/car.png',
  variant = "default", // "default" or "provider"
  rightSideItems  = [
    {
      icon: FaSearch,
      title: "Find Providers",
      description: "Browse local laundry shops and independent providers. Use filters to find the perfect match for your needs."
    },
    {
      icon: FaBalanceScale,
      title: "Compare Options",
      description: "View detailed profiles, services, prices, and customer reviews. Make informed decisions with complete transparency."
    },
    {
      icon: FaCalendarPlus,
      title: "Book Service",
      description: "Select your services, choose pickup time, and confirm your booking in just a few clicks."
    },
    {
      icon: FaTruck,
      title: "Receive Delivery",
      description: "Track your order in real-time. Get fresh, clean clothes delivered right to your doorstep."
    },
    {
      icon: FaStar,
      title: "Rate & Review",
      description: "Share your experience to help others find quality services and reward great providers."
    }
  ]
}) => {
  const isProviderVariant = variant === "provider";

  return (
    <div className={`min-h-screen py-20 md:py-[150px] px-4 ${isProviderVariant ? 'bg-gradient-to-br from-[#F1FAFD] via-[#E8F5F9] to-[#E0F2FE]' : 'bg-gradient-to-b from-white to-[#F7F9FA]'}`}>
      <div className="container mx-auto">
        
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isProviderVariant ? 'lg:grid-flow-dense' : ''}`}>
          {/* Left Side */}
          <div className={`space-y-8 md:sticky top-[100px] ${isProviderVariant ? 'lg:col-start-2' : ''}`}>
            {/* Image */}
            <div className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300 ${isProviderVariant ? '' : 'hidden'}`}></div>
              <img
                src={image}
                height={200}
                className={`relative h-[400px] md:h-[500px] rounded-xl w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
                  isProviderVariant 
                    ? 'shadow-2xl ring-4 ring-primary/30' 
                    : 'shadow-lg'
                }`}
              />
            </div>
            
            <div className="space-y-6">
              <TitleSectionText titlePart1={titlePart1} />
              
              {/* CTA Button */}
              <div>
                <Link to="become-provider">
                  <Button 
                    variant="primary" 
                    icon={<Icon icon={FaArrowRight} theme="light" size="md" />}
                    className={`transition-all duration-300 ${
                      isProviderVariant 
                        ? 'shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'hover:scale-105'
                    }`}
                  >
                    {ctaButtonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className={`space-y-6 ${isProviderVariant ? 'lg:col-start-1' : ''}`}>
            {rightSideItems && rightSideItems.length > 0 && rightSideItems.map((item, index) => (
              <div 
                key={index} 
                className={`group flex gap-5 transition-all duration-300 ${
                  isProviderVariant 
                    ? 'bg-white py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl border-l-4 border-primary hover:scale-[1.02] hover:-translate-y-1' 
                    : 'bg-white py-4 px-5 rounded-xl shadow-md hover:shadow-lg border border-[#0C8CE9]/20 hover:border-[#0C8CE9]/40 hover:scale-[1.01]'
                }`}
              >
                {/* Icon Box */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                  isProviderVariant 
                    ? 'bg-gradient-to-br from-primary to-accent shadow-lg' 
                    : 'bg-gradient-to-br from-[#0C8CE9] to-primary shadow-md'
                }`}>
                  <Icon icon={item.icon || FaSearch} theme="light" size="md" />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className={`text-xl md:text-2xl font-bold mb-2 transition-colors ${
                    isProviderVariant 
                      ? 'text-primary group-hover:text-accent' 
                      : 'text-text-dark group-hover:text-primary'
                  }`}>
                    {item.title}
                  </h3>
                  <p className="text-[#64748B] leading-relaxed text-base">
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

export default Component23

