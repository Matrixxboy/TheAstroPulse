import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  AlertCircle,
  Loader2,
  Sparkles,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const Festival = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [festivals, setFestivals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFestivals = async (selectedYear) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ASTRO_API_URL}/festivals/year?year=${selectedYear}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch festivals")
      }

      const data = await response.json()
      setFestivals(data.festivals || [])
    } catch (err) {
      setError(err.message)
      setFestivals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFestivals(year)
  }, [year])

  const changeYear = (increment) => {
    setYear((prev) => prev + increment)
  }

  // Group festivals by month
  const groupedFestivals = festivals.reduce((acc, festival) => {
    const month = new Date(festival.date).toLocaleString("default", {
      month: "long",
    })
    if (!acc[month]) acc[month] = []
    acc[month].push(festival)
    return acc
  }, {})

  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="min-h-screen py-12 px-4 relative z-10 w-full">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-saffron" /> Yearly Festival
            Calendar
          </h1>
          <p className="text-lg text-smoke font-light max-w-2xl mx-auto">
            Plan your year with the complete list of auspicious festivals and
            muhurats.
          </p>
        </motion.div>

        {/* Year Selection */}
        <div className="flex items-center gap-6 mb-12 glass px-6 py-3 rounded-full border border-gold/20">
          <button
            onClick={() => changeYear(-1)}
            className="p-2 hover:bg-white/10 rounded-full text-gold transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-3xl font-bold text-white font-heading w-24 text-center">
            {year}
          </span>
          <button
            onClick={() => changeYear(1)}
            className="p-2 hover:bg-white/10 rounded-full text-gold transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
            <p className="text-white/60">
              Calculating the entire year's alignment...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-200 bg-red-500/20 border border-red-500/50 p-6 rounded-2xl max-w-lg mb-8"
          >
            <p className="font-bold flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5" /> Error
            </p>
            <p>{error}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && festivals.length === 0 && (
          <div className="text-center text-white/40 italic py-8">
            No festivals found for {year}.
          </div>
        )}

        {/* Festival List Grouped by Month */}
        {!loading && !error && (
          <div className="w-full space-y-12">
            {monthOrder.map((month) => {
              const monthFestivals = groupedFestivals[month]
              if (!monthFestivals) return null

              return (
                <div key={month} className="w-full">
                  <h2 className="text-2xl font-bold text-gold mb-6 border-b border-white/10 pb-2 pl-2">
                    {month} {year}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monthFestivals.map((festival, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="glass p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-all duration-300 group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col">
                            <span className="text-3xl font-bold text-white mb-1">
                              {new Date(festival.date).getDate()}
                            </span>
                            <span className="text-xs uppercase tracking-wider text-white/40">
                              {new Date(festival.date).toLocaleString(
                                "default",
                                { weekday: "short" },
                              )}
                            </span>
                          </div>
                          <div className="p-2 rounded-full bg-gradient-to-br from-saffron/20 to-maroon/20 text-gold">
                            <Sun className="w-5 h-5" />
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors font-heading truncate">
                          {festival.name}
                        </h3>

                        <div className="space-y-1 text-xs text-white/60">
                          <div className="flex items-center gap-2">
                            <Moon className="w-3 h-3 text-purple-400" />
                            <span>
                              {festival.lunar_month} • {festival.paksha}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pl-5">
                            <span>{festival.tithi}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Festival
