import React from "react"

const SectionWrapper = ({ children, className = "", id = "" }) => {
  return (
    <section
      id={id}
      className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10 ${className}`}
    >
      {children}
    </section>
  )
}

export default SectionWrapper
