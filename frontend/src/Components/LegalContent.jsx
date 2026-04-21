import React from 'react'

const LegalContent = ({ 
  title,
  lastUpdated = "January 16, 2025",
  children 
}) => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            {title}
          </h1>
          <p className="text-[#64748B] text-sm">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </div>
    </div>
  )
}

export const LegalSection = ({ title, children }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-[#0F172A] mb-4 mt-8">
        {title}
      </h2>
      <div className="text-[#64748B] leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export const LegalSubsection = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-[#0F172A] mb-3 mt-6">
        {title}
      </h3>
      <div className="text-[#64748B] leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export const LegalList = ({ items, ordered = false }) => {
  const ListComponent = ordered ? 'ol' : 'ul'
  return (
    <ListComponent className={`${ordered ? 'list-decimal' : 'list-disc'} ml-6 mb-4 space-y-2 text-[#64748B]`}>
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ListComponent>
  )
}

export default LegalContent
