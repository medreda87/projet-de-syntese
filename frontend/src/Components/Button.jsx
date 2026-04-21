import React from 'react'

const Button = ({ 
  children, 
  variant = "primary", 
  icon = null,
  onClick,
  className = "",
  ...props 
}) => {
  const baseClasses = "font-semibold transition-all duration-200 flex items-center justify-center gap-2"
  
  const variants = {
    primary: "bg-[#0C8CE9] hover:bg-[#0A6FC2] text-white px-7 py-3.5 rounded-xl shadow-[0_2px_8px_rgba(12,140,233,0.3)] hover:shadow-[0_4px_16px_rgba(12,140,233,0.4)] hover:-translate-y-0.5",
    pill: "bg-[#0C8CE9]/8 hover:bg-[#0C8CE9]/15 text-[#0C8CE9] px-6 py-2.5 rounded-full"
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

