import React from 'react'

const Tag = ({ 
  children, 
  variant = "default",
  className = "",
  ...props 
}) => {
  const baseClasses = "inline-block font-medium transition-colors duration-200"
  
  const variants = {
    default: "bg-[#0C8CE9]/8 text-[#0C8CE9] px-4 py-1.5 rounded-lg text-sm",
    outline: "border border-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-sm"
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

