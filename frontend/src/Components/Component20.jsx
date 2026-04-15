import React from 'react'
import TitleSectionText from './ui/TitleSectionText'
import Button from './Button'

const Component20 = ({
  tagText = null,
  titlePart1 = "Join the freshfold <span>community</span>",
  description = "Whether you need laundry services or provide them, we're here to help.",
  primaryButtonText = "Get Started",
  onPrimaryClick,
}) => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-b md:flex-row flex  flex-col  from-[#F1FAFD] to-[#E8F5F9] overflow-hidden rounded-2xl ">
          <div className="md:order-0 order-2 p-8 md:p-12 lg:p-16 w-full md:w-[50%] max-w-3xl">
            {/* Title and Description using TitleSectionText */}
            <div className="">
              <TitleSectionText
                titlePart1={titlePart1}
                description={description}
                descriptionClass="mx-auto"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4  items-center mt-8">
              <Button
                variant="primary"
                onClick={onPrimaryClick}
                className="w-full sm:w-[50%] "
              >
                {primaryButtonText}
              </Button>
             
            </div>
          </div>
          <div className='h-full md:order-0 w-full md:w-[50%]'>
            <img
              src="/images/community.png"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component20

