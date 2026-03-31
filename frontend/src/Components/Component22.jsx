import React ,{useState} from "react";
import Button from './Button'
import Icon from './ui/Icon'
import { FaCheck, FaArrowRight, FaQuestionCircle, FaComments, FaUsers, FaClock } from 'react-icons/fa'


const Component22 = ({
    formFields = {
        businessName: {
          label: "Business Name",
          placeholder: "Your Laundry Shop",
          value: ""
        },
        ownerName: {
          label: "Owner Name",
          placeholder: "John Doe",
          value: ""
        },
        email: {
          label: "Email Address",
          placeholder: "john@example.com",
          value: ""
        },
        phone: {
          label: "Phone Number",
          placeholder: "+1 234 567 890",
          value: ""
        },
        address: {
          label: "Business Address",
          placeholder: "123 Main Street, City, State",
          value: ""
        }
      },
      termsText = "By submitting this form, you agree to our Terms of Service and Privacy Policy. We'll contact you within 24 hours to complete your registration.",
      submitButtonText = "Submit Application",
      onSubmit
}) => {

    const [formData, setFormData] = useState({
        businessName: formFields.businessName.value || "",
        ownerName: formFields.ownerName.value || "",
        email: formFields.email.value || "",
        phone: formFields.phone.value || "",
        address: formFields.address.value || ""
      })
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        })
      }
    
      const handleSubmit = (e) => {
        e.preventDefault()
        if (onSubmit) {
          onSubmit(formData)
        }
      }
    
  return (
    <section className="py-[60px]">
      <div className="container grid md:grid-cols-2 grid-col-1">
        <div>
          <div className="bg-white w-full mx-auto rounded-2xl shadow-lg p-8 md:p-12">
            {/* Header Section */}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two Column Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Name */}
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-[#1E2A36] mb-2"
                  >
                    {formFields.businessName.label}
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder={formFields.businessName.placeholder}
                    className="w-full px-4 py-3 bg-[#F7F9FA] border border-[#DDE2E8] rounded-lg text-[#1E2A36] placeholder-[#62707D] focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                  />
                </div>

                {/* Owner Name */}
                <div>
                  <label
                    htmlFor="ownerName"
                    className="block text-sm font-medium text-[#1E2A36] mb-2"
                  >
                    {formFields.ownerName.label}
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder={formFields.ownerName.placeholder}
                    className="w-full px-4 py-3 bg-[#F7F9FA] border border-[#DDE2E8] rounded-lg text-[#1E2A36] placeholder-[#62707D] focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#1E2A36] mb-2"
                  >
                    {formFields.email.label}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={formFields.email.placeholder}
                    className="w-full px-4 py-3 bg-[#F7F9FA] border border-[#DDE2E8] rounded-lg text-[#1E2A36] placeholder-[#62707D] focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-[#1E2A36] mb-2"
                  >
                    {formFields.phone.label}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={formFields.phone.placeholder}
                    className="w-full px-4 py-3 bg-[#F7F9FA] border border-[#DDE2E8] rounded-lg text-[#1E2A36] placeholder-[#62707D] focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Business Address - Full Width */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-[#1E2A36] mb-2"
                >
                  {formFields.address.label}
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={formFields.address.placeholder}
                  className="w-full px-4 py-3 bg-[#F7F9FA] border border-[#DDE2E8] rounded-lg text-[#1E2A36] placeholder-[#62707D] focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="bg-[#F7F9FA] rounded-lg p-4 flex items-start gap-3">
                <Icon
                  icon={FaCheck}
                  theme="primary"
                  size="md"
                  className="flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-[#62707D] leading-relaxed">
                  {termsText}
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  icon={<Icon icon={FaArrowRight} theme="light" size="sm" />}
                  className="w-full bg-gradient-to-r from-[#0EA5C9] to-[#1BB38C] hover:from-[#0d94b8] hover:to-[#16a077] text-white px-8 py-4 rounded-lg text-lg"
                >
                  {submitButtonText}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div className="space-y-6 w-[90%] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1E2A36] mb-2">
                Other Ways to Get Help
              </h2>
              <p className="text-[#62707D]">
                Prefer self-service? Check out these resources.
              </p>
            </div>

            {/* Help Option Cards */}
            <div className="space-y-4">
              {/* Help Center Card */}
              <div className="bg-white rounded-xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#E0F2FE] rounded-full p-3 flex-shrink-0">
                  <Icon icon={FaQuestionCircle} theme="primary" size="lg" className="text-[#0EA5C9]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E2A36] mb-1">Help Center</h3>
                  <p className="text-[#62707D] text-sm">
                    Browse FAQs and guides for quick answers to common questions.
                  </p>
                </div>
              </div>

              {/* Live Chat Card */}
              <div className="bg-white rounded-xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#E0F2FE] rounded-full p-3 flex-shrink-0">
                  <Icon icon={FaComments} theme="primary" size="lg" className="text-[#0EA5C9]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E2A36] mb-1">Live Chat</h3>
                  <p className="text-[#62707D] text-sm">
                    Chat with our support team in real-time during business hours.
                  </p>
                </div>
              </div>

              {/* Community Card */}
              <div className="bg-white rounded-xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#E0F2FE] rounded-full p-3 flex-shrink-0">
                  <Icon icon={FaUsers} theme="primary" size="lg" className="text-[#0EA5C9]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E2A36] mb-1">Community</h3>
                  <p className="text-[#62707D] text-sm">
                    Join our community forum to connect with other users.
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time Guarantee Section */}
            <div className="bg-[#E0F2FE] rounded-xl p-6 mt-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#0EA5C9] rounded-full p-3 flex-shrink-0">
                  <Icon icon={FaClock} theme="light" size="lg" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E2A36] mb-2">Response Time Guarantee</h3>
                  <p className="text-[#62707D] text-sm">
                    We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Component22;
