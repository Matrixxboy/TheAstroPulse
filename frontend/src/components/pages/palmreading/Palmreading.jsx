import React from "react"
import { Link } from "react-router-dom"
import SectionWrapper from "../../partials/SectionWrapper"
import { FaHandPaper, FaSearch, FaFingerprint } from "react-icons/fa"

const Palmreading = () => {
  return (
    <div className="w-full">
      <SectionWrapper className="text-center">
        <div className="inline-block animate-fadeInUp mb-4">
          <span className="py-1 px-4 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold tracking-widest uppercase">
            Ancient Science
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 drop-shadow-md animate-fadeInUp">
          Unravel the Secrets <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-200">
            In Your Hands
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto animate-fadeInUp delay-200 leading-relaxed">
          Your life's map is etched in your palms. Using advanced image analysis
          and ancient wisdom, we interpret your lines to reveal personality
          traits, talents, and destiny.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 animate-fadeInUp delay-500">
          <Link
            to="/palmreading/palmreadingpage"
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold rounded-full shadow-lg shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <FaFingerprint /> Scan Your Palm
          </Link>
          <Link
            to="/palmreading/PalmistryInfo"
            className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-full backdrop-blur-md transition-all duration-300"
          >
            Learn Palmistry
          </Link>
        </div>
      </SectionWrapper>

      {/* Features (Visual Only) */}
      <SectionWrapper className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="bg-pink-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-300">
              <FaHandPaper size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Life Line</h3>
            <p className="text-gray-400 text-sm">
              Vitality, physical health, and general well-being.
            </p>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="bg-pink-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-300">
              <FaSearch size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Head Line</h3>
            <p className="text-gray-400 text-sm">
              Intellect, mentality, and psychological makeup.
            </p>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="bg-pink-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-300">
              <FaFingerprint size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Heart Line</h3>
            <p className="text-gray-400 text-sm">
              Emotions, love perspectives, and cardiac health.
            </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}

export default Palmreading
