import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ScanFace, BookOpen, Sparkles } from "lucide-react"

const Palmreading = () => {
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
            <ScanFace className="w-16 h-16 text-saffron" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-bold text-gradient-gold drop-shadow-lg mb-6">
          Unravel Your Palm's Secrets
        </h1>

        <p className="text-lg sm:text-xl text-smoke font-body font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          At <span className="font-semibold text-gold">The Astro Pulse</span>,
          we delve into the intricate lines of your palm to reveal insights into
          your personality, destiny, and hidden potentials using ancient Vedic
          wisdom.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link
            to="/palmreading/palmreadingpage"
            className="group relative px-8 py-4 bg-gradient-to-r from-saffron to-maroon rounded-full text-white font-bold shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />{" "}
              Free Hasthrekha Report
            </span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </Link>

          <Link
            to="/palmreading/PalmistryInfo"
            className="px-8 py-4 border border-gold/50 rounded-full text-gold font-bold hover:bg-gold/10 transition-all duration-300 flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" /> Know about Hasthrekha
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Palmreading
