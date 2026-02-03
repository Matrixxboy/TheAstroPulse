import React from "react"
import { Link } from "react-router-dom"
import SectionWrapper from "../../partials/SectionWrapper"
import {
  FaSortNumericDown,
  FaBriefcase,
  FaUser,
  FaInfinity,
} from "react-icons/fa"

const NumerologyFeature = ({ icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
    <div className="text-3xl text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
)

const Numerology = () => {
  return (
    <div className="w-full">
      <SectionWrapper className="text-center">
        <div className="inline-block animate-fadeInUp mb-4">
          <span className="py-1 px-4 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-widest uppercase">
            The Power of Numbers
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 drop-shadow-md animate-fadeInUp">
          Decode Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Numerical DNA
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg md:text-xl text-gray-300 font-light max-w-3xl mx-auto animate-fadeInUp delay-200 leading-relaxed">
          Numbers are the universal language of the universe. Discover how your
          name and birth date influence your life path, destiny, and success.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 animate-fadeInUp delay-500">
          <Link
            to="/numerology/business-numerology-report"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <FaBriefcase /> Business Report
          </Link>
          <Link
            to="/numerology/name-numerology-report"
            className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-full backdrop-blur-md transition-all duration-300 flex items-center gap-2"
          >
            <FaUser /> Personal Report
          </Link>
        </div>
      </SectionWrapper>

      {/* Features */}
      <SectionWrapper className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NumerologyFeature
            icon={<FaSortNumericDown />}
            title="Life Path Number"
            description="The most important number in your numerology chart, revealing the path you're destined to walk."
          />
          <NumerologyFeature
            icon={<FaInfinity />}
            title="Destiny Number"
            description="Reveals the person you are destined to become and the potential you must realize."
          />
          <NumerologyFeature
            icon={<FaBriefcase />}
            title="Business Vibrations"
            description="Ensure your brand name aligns with success and abundance using Chaldean numerology."
          />
        </div>
      </SectionWrapper>
    </div>
  )
}

export default Numerology
