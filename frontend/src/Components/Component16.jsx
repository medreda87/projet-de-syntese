import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TitleSectionText from './ui/TitleSectionText'
import Button from './Button'
import Icon from './ui/Icon'
import { FaCheck, FaArrowRight, FaCheckCircle, FaTimes } from 'react-icons/fa'
import { sendEmail } from '../utils/send_email'
import API from '../utils/api';
const Component16 = ({
  tagText = null,
  titlePart1 = "Ready to Get <span>Started ?</span>",
  description = "Fill out the form below and we'll get you set up in no time.",
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
    password: {
       label: "Password", 
       placeholder: "your password",
        value: "" },
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
    address: formFields.address.value || "",
    password: formFields.password.value || ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   setIsSubmitting(true)
  //   setError(null)
  //   setShowSuccess(false)
    


  //   // Create message content
  //   const message = `
  //     Business Name: ${formData.businessName}
  //     Owner Name: ${formData.ownerName}
  //     Email: ${formData.email}
  //     Phone: ${formData.phone}
  //     Address: ${formData.address}
  //   `.trim();
    
  //   sendEmail({
  //     name: formData.ownerName,
  //     phone: formData.phone,
  //     email: formData.email,
  //     address: formData.address,
  //     businessName: formData.businessName,
  //     password: formData.password,
  //     subject: `New Application from ${formData.businessName}`,
  //     message: message
  //   }).then(() => {
  //     // Handle success
  //     if (onSubmit) {
  //       onSubmit(formData)
  //     }
  //     setIsSubmitting(false)
  //     setShowSuccess(true)
  //     setError(null)
      
  //     // Reset form
  //     setFormData({
  //       businessName: '',
  //       ownerName: '',
  //       email: '',
  //       phone: '',
  //       address: '',
  //       password:""
  //     })
      
  //     // Hide success message after 5 seconds
  //     setTimeout(() => {
  //       setShowSuccess(false)
  //     }, 5000)
  //   }).catch((error) => {
  //     console.error('Error sending email:', error)
  //     setIsSubmitting(false)
  //     setError('There was an error submitting your application. Please try again.')
  //     setShowSuccess(false)
  //   })
  // }


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
  const response = await API.post("/providers", {
    laudry_name: formData.businessName,
    provider_name: formData.ownerName,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    address: formData.address
  });


    console.log("Provider créé:", response.data);
    setMessage("Votre demande a été soumise avec succès !");
    setType("success");
    setError(null);
    setShowSuccess(true); 
    
    // Reset form
    setFormData({
      businessName: "",
      ownerName: "",
      email: "",
      phone: "",
      address: ""
    });

  } catch (err) {
    console.error(err);
    setMessage("Une erreur s'est produite lors de la soumission de votre demande. Veuillez réessayer.");
    setType("error");
    setError("There was an error submitting your application. Please try again.");
    setShowSuccess(false);
  }
};
  return (
    <div id='register'  className="bg-primary-light py-16 px-4">
      <div className="container">
      <div className="text-center mb-8">
            <TitleSectionText
              tagText={tagText}
              titlePart1={titlePart1}
              description={description}
              descriptionClass="mx-auto flex text-center items-center w-full"
            />
          </div>

        {/* White Rounded Card */}
        <div className="bg-white md:w-[70%] w-full mx-auto rounded-2xl shadow-lg p-8 md:p-12 relative">
          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 left-4 right-4 bg-gradient-to-r from-[#1BB38C] to-[#0EA5C9] text-white p-4 rounded-xl shadow-lg z-10 flex items-center gap-3"
              >
                <FaCheckCircle className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">Application Submitted Successfully!</h4>
                  <p className="text-sm text-white/90">We've received your application and will contact you within 24 hours.</p>
                </div>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-xl shadow-lg z-10 flex items-center gap-3"
              >
                <FaTimes className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">Error</h4>
                  <p className="text-sm text-white/90">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
         
          {/* Form */}
          <form onSubmit={handleSubmit} className={`space-y-6 transition-all duration-300 ${showSuccess || error ? 'pt-24' : 'pt-0'}`}>
            {/* Two Column Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-[#1E2A36] mb-2">
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
                <label htmlFor="ownerName" className="block text-sm font-medium text-[#1E2A36] mb-2">
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
                <label htmlFor="email" className="block text-sm font-medium text-[#1E2A36] mb-2">
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
              {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1E2A36] mb-2">
                {formFields.password.label}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={formFields.password.placeholder}
                className="w-full px-4 py-3 bg-[#F7F9FA] border border-[#DDE2E8] rounded-lg text-[#1E2A36] placeholder-[#62707D] focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
              />
            </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#1E2A36] mb-2">
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
              <label htmlFor="address" className="block text-sm font-medium text-[#1E2A36] mb-2">
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
              <Icon icon={FaCheck} theme="primary" size="md" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#62707D] leading-relaxed">
                {termsText}
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                icon={!isSubmitting && <Icon icon={FaArrowRight} theme="light" size="sm" />}
                className="w-full bg-gradient-to-r from-[#0EA5C9] to-[#1BB38C] hover:from-[#0d94b8] hover:to-[#16a077] text-white px-8 py-4 rounded-lg text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Component16

