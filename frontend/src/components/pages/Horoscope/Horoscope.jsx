import React, { useState } from "react"
import {
  Sparkles,
  Calendar,
  Sun,
  Moon,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"

const Horoscope = () => {
  const [dob, setDob] = useState("")
  const [day, setDay] = useState("today")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!dob || !day) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOROSCOPE_API_KEY}?dob=${dob}&day=${day}`,
      )
      const data = await response.json()

      if (data.horoscope) {
        setResult(data)
      } else {
        setResult({ error: "No horoscope found." })
      }
    } catch (e) {
      setResult({ error: "Failed to fetch horoscope. Please try again.", e })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen py-12 flex flex-col items-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold mb-3 flex items-center justify-center gap-3">
            <Sun className="w-8 h-8 text-saffron" /> Daily Horoscope
          </h1>
          <p className="text-smoke text-sm md:text-base font-body">
            align your day with the cosmic rhythm
          </p>
        </div>

        <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gold flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-cosmic-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gold flex items-center gap-2">
                <Moon className="w-4 h-4" /> Period
              </label>
              <div className="relative">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full bg-cosmic-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
                >
                  <option value="yesterday" className="bg-cosmic-dark">
                    Yesterday
                  </option>
                  <option value="today" className="bg-cosmic-dark">
                    Today
                  </option>
                  <option value="tomorrow" className="bg-cosmic-dark">
                    Tomorrow
                  </option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowRight className="w-4 h-4 text-smoke rotate-90" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-saffron to-maroon text-white font-bold py-4 rounded-xl shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Reveal Destiny
                </>
              )}
            </button>
          </form>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 glass p-6 rounded-2xl border border-gold/30 relative"
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cosmic-dark border border-gold/30 px-4 py-1 rounded-full text-xs text-gold uppercase tracking-widest font-bold">
              Cosmic Insight
            </div>

            {result.error ? (
              <p className="text-red-400 text-center">{result.error}</p>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <div>
                    <p className="text-xs text-smoke uppercase tracking-wider">
                      Zodiac
                    </p>
                    <p className="text-lg font-heading font-bold text-white">
                      {result.zodiac_sign}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-smoke uppercase tracking-wider">
                      Date
                    </p>
                    <p className="text-sm text-white">{result.dob}</p>
                  </div>
                </div>

                <p className="text-white/90 leading-relaxed font-body">
                  {result.horoscope}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Horoscope
