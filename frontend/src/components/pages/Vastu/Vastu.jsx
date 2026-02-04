import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Compass, BookOpen, FileText } from "lucide-react"

const Vastu = () => {
  return (
    <div className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-white/5 rounded-full border border-gold/30">
            <Compass className="w-16 h-16 text-saffron" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-bold text-gradient-gold drop-shadow-lg mb-6">
          Check Your Vastu
        </h1>

        <p className="text-lg sm:text-xl text-smoke font-body font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          At <span className="font-semibold text-gold">The Astro Pulse</span>,
          we help you align your living space with cosmic energies. Discover the
          balance of elements in your home for prosperity, health, and
          happiness.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full">
          <Link
            to="/vastu/vastu-report"
            className="group relative px-8 py-4 bg-gradient-to-r from-saffron to-maroon rounded-full text-white font-bold shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:scale-105 transition-all duration-300 overflow-hidden w-full md:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform" />{" "}
              Get Your Vastu Report
            </span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </Link>

          <Link
            to="/vastu/compass"
            className="group relative px-8 py-4 bg-white/10 border border-gold/50 rounded-full text-gold font-bold hover:bg-gold/10 hover:border-gold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-full md:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />{" "}
              Vastu Compass
            </span>
          </Link>

          <Link
            to="/vastu/know-about-vastu"
            className="group relative px-8 py-4 bg-white/5 border border-white/20 rounded-full text-gray-300 font-bold hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-full md:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" /> Know about Vastu
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Vastu
