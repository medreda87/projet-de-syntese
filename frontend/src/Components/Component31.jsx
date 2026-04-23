import React from 'react'
import Tag from './ui/Tag'

const Component31 = ({
  tagText = "About Mesbanati",
  titlePart1 = "Who We <span>Are</span>",
  description = "We're revolutionizing the laundry industry by connecting customers with trusted local providers. Our platform makes it easy to find, book, and manage laundry services with just a few clicks. At Mesbanati, we believe that clean clothes shouldn't require stress, time, or guesswork. We've built a comprehensive marketplace that brings together the best laundry service providers in your area, making it simple to compare prices, read reviews, and book services that fit your schedule. ",
  image = "/images/about.png"
}) => {
  return (
    <div className="bg-white py-24 md:py-32">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="text-left">
            {/* Tag */}
            {tagText && (
              <div className="mb-5">
                <Tag variant="default">
                  {tagText}
                </Tag>
              </div>
            )}
            
            {/* Title */}
            <h2 
              className="text-3xl md:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] mb-6 leading-[1.15] tracking-[-0.03em] title-section"
              dangerouslySetInnerHTML={{ __html: titlePart1 }} 
            />

            {/* Description */}
            <p className="text-base md:text-lg text-[#64748B] leading-relaxed">
              {description}
            </p>
          </div>

          {/* Right Column - Image */}
          <div className="flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="w-full max-w-lg">
              <img 
                src={image} 
                alt="Who we are"
                className="w-full h-auto rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component31
