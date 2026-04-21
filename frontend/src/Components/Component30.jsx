import React from 'react'
import Icon from './ui/Icon'
import { FaBullseye, FaEye } from 'react-icons/fa'

const Component30 = ({
  mission = {
    title: "Our <i class='text-primary'>Mission</i>",
    description: "To simplify laundry for everyone by creating a trusted marketplace that connects customers with quality service providers. We believe clean clothes shouldn't require stress, time, or guesswork.",
    icon: FaBullseye,
    image: "/images/ourMission.png"
  },
  vision = {
    title: "Our <i class='text-primary'>Vision</i>",
    description: "A world where finding reliable laundry services is as easy as ordering food online. We envision empowering local laundry businesses to thrive while giving customers unmatched convenience.",
    icon: FaEye,
    image: "/images/ourVision.png"
  }
}) => {
  return (
    <div className="bg-[#F7F9FA] py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Image Section */}
            {mission.image && (
              <div className="w-full h-48 md:h-56 overflow-hidden">
                <img 
                  src={mission.image} 
                  alt={mission.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              {/* Icon Section - Only show if no image */}
              {!mission.image && (
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#0C8CE9] to-[#06D6A0] flex items-center justify-center">
                    <Icon icon={mission.icon} theme="light" size="xl" />
                  </div>
                </div>
              )}
              
              <h3 className="text-2xl  font-bold text-[#0F172A] mb-4" dangerouslySetInnerHTML={{__html:mission.title}} />
                
              <p className="text-[#64748B] leading-relaxed">
                {mission.description}
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Image Section */}
            {vision.image && (
              <div className="w-full h-48 md:h-56 overflow-hidden">
                <img 
                  src={vision.image} 
                  alt={vision.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              {/* Icon Section - Only show if no image */}
              {!vision.image && (
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-[#0C8CE9] flex items-center justify-center">
                    <Icon icon={vision.icon} theme="light" size="xl" />
                  </div>
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-[#0F172A] mb-4" dangerouslySetInnerHTML={{__html: vision.title}}/>
               
             
              <p className="text-[#64748B] leading-relaxed">
                {vision.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component30

