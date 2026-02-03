import React from "react"
import { Link } from "react-router-dom"
import SectionWrapper from "../../partials/SectionWrapper"
import {
  FaStar,
  FaChartPie,
  FaUserFriends,
  FaGlobeAmericas,
} from "react-icons/fa"

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group">
    <div className="text-3xl text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
)

const Astrology = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <SectionWrapper className="text-center">
        <div className="inline-block animate-fadeInUp mb-4">
          <span className="py-1 px-4 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-widest uppercase">
            Cosmic Guidance
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg animate-fadeInUp animation-delay-200">
          Chart Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-purple-400">
            Cosmic Journey
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 font-light max-w-3xl mx-auto mb-10 animate-fadeInUp animation-delay-400 leading-relaxed">
          Unlock the secrets of the stars. At{" "}
          <span className="font-semibold text-yellow-300">The Astro Pulse</span>
          , we decode your celestial blueprint to illuminate your life's path,
          relationships, and destiny.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fadeInUp animation-delay-600">
          <Link
            to="/astrology/astrologyreport"
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-indigo-900 font-bold rounded-full shadow-lg shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Get Your Birth Chart
          </Link>
          <Link
            to="/astrology/astrologyinfo"
            className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-full backdrop-blur-md transition-all duration-300"
          >
            Learn Astrology
          </Link>
        </div>
      </SectionWrapper>

      {/* Features Grid */}
      <SectionWrapper className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<FaChartPie />}
            title="Natal Charts"
            description="A snapshot of the sky at your birth, revealing your core personality and potential."
          />
          <FeatureCard
            icon={<FaUserFriends />}
            title="Compatibility"
            description="Understand relationship dynamics through Synastry and Composite charts."
          />
          <FeatureCard
            icon={<FaGlobeAmericas />}
            title="Transit Forecasts"
            description="Navigate current planetary movements and how they impact your daily life."
          />
          <FeatureCard
            icon={<FaStar />}
            title="Vedic Wisdom"
            description="Ancient insights tailored to modern life challenges and opportunities."
          />
        </div>
      </SectionWrapper>

      {/* Info Section */}
      <div className="w-full bg-black/20 border-y border-white/5 py-20">
        <SectionWrapper className="py-0">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Why Analytics Matter?
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Astrology is not just about prediction; it's about
                self-awareness. By understanding the cosmic energies at play,
                you can make informed decisions, leverage your strengths, and
                navigate challenges with grace.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Our advanced algorithms combine traditional Vedic principles
                with modern astronomical data to provide the most accurate
                readings possible.
              </p>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    Personalized planetary analysis
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    Dasha and Bhukti periods
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                    Gemstone recommendations
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                    Remedial measures
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </div>
  )
}

export default Astrology
