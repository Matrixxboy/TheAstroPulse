import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Binary, Briefcase, User, Star } from "lucide-react"

const Numerology = () => {
  return (
    <div className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-white/5 rounded-full border border-gold/30">
            <Binary className="w-16 h-16 text-saffron" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-bold text-gradient-gold drop-shadow-lg mb-6">
          Discover Your Numerology Blueprint
        </h1>

        <p className="text-lg sm:text-xl text-smoke font-body font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          At <span className="font-semibold text-gold">The Astro Pulse</span>,
          we decode the energetic essence of your name and business to help you
          align with success, clarity, and cosmic flow using the ancient science
          of numbers.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link
            to="/numerology/business-numerology-report"
            className="group relative px-8 py-4 bg-gradient-to-r from-saffron to-maroon rounded-full text-white font-bold shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5 group-hover:rotate-12 transition-transform" />{" "}
              Business Name Report
            </span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </Link>

          <Link
            to="/numerology/name-numerology-report"
            className="group relative px-8 py-4 bg-white/10 border border-gold/50 rounded-full text-gold font-bold hover:bg-gold/10 hover:border-gold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />{" "}
              Personal Name Report
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Numerology
