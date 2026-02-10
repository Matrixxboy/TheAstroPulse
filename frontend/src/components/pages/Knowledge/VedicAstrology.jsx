import React from "react"
import { motion } from "framer-motion"
import { BookOpen, Star, Sun, Moon } from "lucide-react"

const chapters = [
  {
    title: "The 12 Rashis (Zodiac Signs)",
    icon: Star,
    content: "Detailed breakdown of Aries to Pisces from a Vedic perspective.",
  },
  {
    title: "Planetary Lords (Grahas)",
    icon: Sun,
    content:
      "Understanding the influence of Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu.",
  },
  {
    title: "Nakshatras (Lunar Mansions)",
    icon: Moon,
    content:
      "The 27 Nakshatras and their profound impact on human psychology and destiny.",
  },
]

const VedicAstrology = () => {
  return (
    <div className="min-h-screen bg-transparent bg-cosmic-dark pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-semibold">Knowledge Base</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Fundamentals of{" "}
            <span className="text-gradient-gold">Vedic Astrology</span>
          </h1>
          <p className="text-smoke max-w-2xl mx-auto text-lg leading-relaxed">
            Dive deep into the ancient wisdom of Jyotish Shastra. Learn the
            building blocks of the cosmic language.
          </p>
        </motion.div>

        <div className="space-y-8">
          {chapters.map((chapter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-gold/30 transition-all flex gap-6 items-start"
            >
              <div className="p-4 bg-white/5 rounded-2xl text-gold group-hover:scale-110 transition-transform hidden md:block">
                <chapter.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gold transition-colors">
                  {chapter.title}
                </h3>
                <p className="text-smoke leading-relaxed mb-6">
                  {chapter.content}
                </p>
                <button className="text-sm font-semibold text-white/60 hover:text-white uppercase tracking-wider flex items-center gap-2">
                  Read Chapter <span className="text-gold">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VedicAstrology
