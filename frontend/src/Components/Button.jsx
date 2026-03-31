import React from 'react'

const Button = ({ 
  children, 
  variant = "primary", 
  icon = null,
  onClick,
  className = "",
  ...props 
}) => {
  const baseClasses = "font-medium transition-colors bg-gradient-to-r from-[#0EA5C9] to-[#1BB38C] hover:from-[#0d94b8] hover:to-[#16a077] text-white duration-200 flex items-center justify-center gap-2"
  
  const variants = {
    primary: " hover:bg-[#16a077] text-white px-6 py-3 rounded-[50px]",
    pill: " hover:bg-[#BAE6FD] text-[#0EA5C9] px-6 py-2 rounded-full"
  }

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </button>
  )
}

export default Button

