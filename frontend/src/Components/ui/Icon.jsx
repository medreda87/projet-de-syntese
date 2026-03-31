import React from 'react'

const Icon = ({ 
  icon: IconComponent, 
  theme = "light",
  size = "md",
  className = "",
  ...props 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10"
  }

  const themeClasses = {
    light: "text-white",
    dark: "text-gray-800",
    primary: "text-[#0EA5C9]",
    accent: "text-[#1BB38C]"
  }

  if (!IconComponent) {
    return null
  }

  return (
    <IconComponent 
      className={`${sizeClasses[size]} ${themeClasses[theme]} ${className}`}
      {...props}
    />
  )
}

export default Icon

