import React from 'react'
import TitleSectionText from './ui/TitleSectionText'
import Button from './Button'
import { Link } from 'react-router-dom'

const Component20 = ({
  tagText = null,
  titlePart1 = "Join the freshfold <span>community</span>",
  description = "Whether you need laundry services or provide them, we're here to help.",
  primaryButtonText = "Get Started",
  onPrimaryClick,
}) => {
  return (
    <div className="bg-white py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-br from-[#0C8CE9]/5 via-[#0C8CE9]/8 to-[#06D6A0]/5 overflow-hidden rounded-3xl border border-[#0C8CE9]/10">
          <div className="flex flex-col md:flex-row">
          <div className="md:order-0 order-2 p-8 md:p-12 lg:p-16 w-full md:w-[50%] flex flex-col justify-center">
            {/* Title and Description using TitleSectionText */}
            <div>
              <TitleSectionText
                titlePart1={titlePart1}
                description={description}
                descriptionClass=""
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start mt-8">
              <Button
                variant="primary"
                onClick={onPrimaryClick}
                className="w-full sm:w-auto"
              >
                <Link to="/signup">
                  {primaryButtonText}
                </Link>
              </Button>
            </div>
          </div>
          <div className='md:order-0 w-full md:w-[50%]'>
            <img
              src="/images/community.png"
              className="w-full h-full object-cover"
              alt="Join FreshFold community"
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component20

