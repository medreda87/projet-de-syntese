import React from 'react'

const Component14 = ({ 
  buttonText = "About FreshFold",
  titlePart1 = "Making Laundry <span>Effortless</span>",
  description = "We're building the future of laundry services — connecting customers with trusted local providers for a seamless, hassle-free experience.",
  steps = null,
  image = "/images/image1.png"
}) => {
  return (
    <div className="bg-primary-light  flex items-center px-4 py-[150px]">
      <div className={`container mx-auto ${image ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center' : ''}`}>
        {/* Left Column - Text Content */}
        <div className={image ? 'text-left' : 'text-center'}>
          {/* About FreshFold Button */}
          <div className="mb-8">
            <button className="bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0EA5C9] font-medium px-6 py-2 rounded-full transition-colors duration-200">
              {buttonText}
            </button>
          </div>

          {/* Main Headline */}
          <h1 className={`text-3xl md:text-4xl bg-background-primary-light text-text-dark title-hero-section lg:text-5xl font-bold mb-6 leading-tight ${image ? '' : 'mx-auto'} max-w-2xl`}
            dangerouslySetInnerHTML={{ __html: titlePart1 }} />

          {/* Descriptive Text */}
          <p className={`text-lg md:text-xl text-[#62707D] leading-relaxed mb-12 ${image ? '' : 'max-w-2xl mx-auto'}`}>
            {description}
          </p>

          {/* Steps Section - Only renders if steps array exists and has items */}
          {steps && steps.length > 0 && (
            <div className={`mt-16 grid grid-cols-1 ${image ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-8 ${image ? '' : 'max-w-3xl mx-auto'}`}>
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  {/* Step Number Circle */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA5C9] flex items-center justify-center">
                    <span className="text-white font-medium text-md">{index + 1}</span>
                  </div>
                  {/* Step Text */}
                  <p className="text-text-gray leading-[20px] text-lg  text-left ">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Image */}
        {image && (
          <div className="flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="w-full">
              <img 
                src={image} 
                alt={buttonText || "Hero image"}
                className="w-full h-[500px] rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Component14

