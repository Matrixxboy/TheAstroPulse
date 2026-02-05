import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Zap, Crown, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const ads = [
  {
    id: 1,
    title: "Unlock Your Full Potential",
    text: "Get a detailed 50-page Premium Kundali Report tailored just for you.",
    cta: "Get Report",
    link: "/astrology/astrologyreport",
    icon: Crown,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: 2,
    title: "Confused About Career?",
    text: "Talk to our expert Vedic Astrologers and get instant clarity.",
    cta: "Chat Now",
    link: "/chatbot",
    icon: Star,
    color: "from-blue-500 to-purple-600",
  },
  {
    id: 3,
    title: "Is Your Home Lucky?",
    text: "Get a Vastu analysis of your home simply by uploading a blueprint.",
    cta: "Check Vastu",
    link: "/vastu",
    icon: Zap,
    color: "from-emerald-500 to-teal-600",
  },
]

const AdBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length)
    }, 8000) // Change every 8 seconds
    return () => clearInterval(interval)
  }, [])

  const currentAd = ads[currentIndex]

  return (
    <div className="bg-black/40 border-t border-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-full bg-gradient-to-br ${currentAd.color} shadow-lg shadow-${currentAd.color.split("-")[1]}-500/20`}
              >
                <currentAd.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-white font-bold font-heading text-sm md:text-base">
                  {currentAd.title}
                </h4>
                <p className="text-white/60 text-xs md:text-sm">
                  {currentAd.text}
                </p>
              </div>
            </div>

            <Link
              to={currentAd.link}
              className={`px-6 py-2 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r ${currentAd.color} hover:contrast-125 transition-all shadow-lg shadow-white/5 flex items-center gap-2 group whitespace-nowrap`}
            >
              {currentAd.cta}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AdBanner
