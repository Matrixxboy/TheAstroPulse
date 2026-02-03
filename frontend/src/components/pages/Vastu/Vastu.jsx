import React from "react"
import { Link } from "react-router-dom"
import SectionWrapper from "../../partials/SectionWrapper"
import { FaHome, FaCompass, FaTree, FaWater } from "react-icons/fa"

const VastuFeature = ({ icon, title, text }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
    <div className="text-3xl text-emerald-400 mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{text}</p>
  </div>
)

const Vastu = () => {
  return (
    <div className="w-full">
      <SectionWrapper className="text-center">
        <div className="inline-block animate-fadeInUp mb-4">
          <span className="py-1 px-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-widest uppercase">
            Architectural Harmony
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 drop-shadow-md animate-fadeInUp">
          Harmonize Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            Living Space
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto animate-fadeInUp delay-200">
          Align your home and office with the forces of nature using ancient
          Vastu Shastra principles for prosperity, health, and peace.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-5 animate-fadeInUp delay-500">
          <Link
            to="/vastu/vastu-report"
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow-lg shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1"
          >
            Get Vastu Report
          </Link>
          <Link
            to="/vastu/compass"
            className="px-8 py-4 bg-white/10 border border-white/10 hover:bg-white/20 text-white font-semibold rounded-full backdrop-blur-md transition-all duration-300 flex items-center gap-2"
          >
            <FaCompass /> Digital Compass
          </Link>
          <Link
            to="/vastu/know-about-vastu"
            className="px-8 py-4 bg-transparent border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 font-semibold rounded-full transition-all duration-300"
          >
            Learn Basics
          </Link>
        </div>
      </SectionWrapper>

      {/* Vastu Principles Grid */}
      <SectionWrapper className="pt-0">
        <h2 className="text-3xl font-bold text-center text-white mb-10">
          The Elements of Vastu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <VastuFeature
            icon={<FaWater />}
            title="Water (Jal)"
            text="North-East: Source of health and wealth. Keep it light and open."
          />
          <VastuFeature
            icon={<FaHome />}
            title="Fire (Agni)"
            text="South-East: Transformation and energy. Ideal for kitchens."
          />
          <VastuFeature
            icon={<FaTree />}
            title="Air (Vayu)"
            text="North-West:  Movement and change. Best for guest rooms."
          />
          <VastuFeature
            icon={<FaCompass />}
            title="Earth (Prithvi)"
            text="South-West: Stability and strength. Perfect for master bedroom."
          />
        </div>
      </SectionWrapper>
    </div>
  )
}

export default Vastu
