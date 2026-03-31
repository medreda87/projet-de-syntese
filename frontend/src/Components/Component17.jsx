import React from 'react'

const Component17 = ({
  stats = [
    {
      value: "500+",
      label: "Verified Providers"
    },
    {
      value: "50,000+",
      label: "Happy Customers"
    },
    {
      value: "1M+",
      label: "Orders Completed"
    },
    {
      value: "4.8/5",
      label: "Average Rating"
    }
  ],
  valueColor = "text-[#0EA5C9]",
  labelColor = "text-[#1E2A36]",
  backgroundColor = "bg-[#F7F9FA]"
}) => {
  return (
    <div className={`${backgroundColor} py-16 px-4`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {/* Value */}
              <div className={`text-3xl md:text-4xl font-bold ${valueColor} mb-2`}>
                {stat.value}
              </div>
              {/* Label */}
              <div className={`text-lg text-text-dark`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Component17

