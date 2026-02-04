import React from "react"
import { motion } from "framer-motion"
import { BookOpen, Star } from "lucide-react"
import { Link } from "react-router-dom"

const Astroinfo = () => {
  return (
    <div className="relative z-10 min-h-screen py-20 px-4 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto glass p-10 rounded-3xl border border-gold/20 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-maroon/10 rounded-full blur-3xl -z-10" />

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/5 rounded-full border border-gold/30">
            <BookOpen className="w-16 h-16 text-saffron" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold mb-6">
          Astrological Wisdom
        </h1>

        <p className="text-lg text-smoke leading-relaxed mb-8 font-light">
          Astrology is the study of the movements and relative positions of
          celestial bodies interpreted as having an influence on human affairs
          and the natural world. It has been a central part of Sanatan Dharma,
          guiding individuals through life's journey by understanding cosmic
          rhythms.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors">
            <h3 className="text-xl font-bold text-gold mb-2 flex items-center gap-2">
              <Star className="w-5 h-5" /> The Birth Chart (Kundali)
            </h3>
            <p className="text-sm text-smoke/80 invalid:">
              A map of the sky at the exact moment of your birth. It reveals
              your personality, strengths, weakenesses, and destiny.
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors">
            <h3 className="text-xl font-bold text-gold mb-2 flex items-center gap-2">
              <Star className="w-5 h-5" /> Planetary Dasha
            </h3>
            <p className="text-sm text-smoke/80">
              Unique planetary periods that govern different phases of your
              life, influencing career, relationships, and health.
            </p>
          </div>
        </div>

        <Link
          to="/astrology/astrologyreport"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-saffron to-maroon rounded-full text-white font-bold shadow-lg hover:shadow-saffron/40 hover:scale-105 transition-all duration-300"
        >
          <Star className="w-5 h-5" /> Get Your Free Report
        </Link>
      </motion.div>
    </div>
  )
}

export default Astroinfo
