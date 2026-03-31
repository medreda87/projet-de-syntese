import React from 'react'

const Tag = ({ 
  children, 
  variant = "default",
  className = "",
  ...props 
}) => {
  const baseClasses = "inline-block font-medium transition-colors duration-200"
  
  const variants = {
    default: "bg-[#E0F2FE] text-[#0EA5C9] px-6 py-2 rounded-full",
    outline: "border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg"
  }

  return (
    <span 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Tag

