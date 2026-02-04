import React, { useState } from "react"
import KundaliReportPage from "./Reportpages/KundaliReportPage"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

const Astroreportpage = () => {
  const [dob, setDob] = useState("")
  const [tob, setTob] = useState("")
  const [lob, setLob] = useState("")
  const [timezone, setTimezone] = useState("Asia/Kolkata")
  const [suggestions, setSuggestions] = useState([])
  const [fullName, setFullName] = useState("")

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleLobInput = async (value) => {
    setLob(value)
    if (value.length > 2) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value,
          )}&limit=5`,
        )
        const data = await res.json()
        setSuggestions(data.map((place) => place.display_name))
      } catch {
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!dob || !tob || !lob || !timezone) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_ASTRO_API_URL}/astro-report?dob=${dob}&tob=${tob}&lob=${encodeURIComponent(lob)}&timezone=${timezone}`,
        {
          headers: {
            "Astro-API-KEY": import.meta.env.VITE_API_KEY_TOKEN,
          },
        },
      )

      const data = await response.json()
      if (data.error) {
        setResult({ error: data.error })
        showToast("Something went wrong", "error")
      } else {
        setResult(data)
        showToast("Astrology report fetched successfully", "success")
      }
    } catch {
      setResult({
        error: "Failed to fetch astrology report. Please try again",
      })
      showToast("API Error", "error")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen py-12 px-4 relative z-10 w-full">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-saffron" /> Astrology Report
            Generator
          </h1>
          <p className="text-lg text-smoke font-light max-w-2xl mx-auto">
            Generate your detailed Kundali report by entering your birth
            details.
          </p>
        </motion.div>

        <div className="w-full max-w-4xl glass p-8 md:p-10 rounded-3xl border border-gold/20 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-maroon/5 rounded-full blur-3xl -z-10" />

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gold flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-cosmic-dark/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* DOB */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gold flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-cosmic-dark/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                  required
                />
              </div>

              {/* TOB */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gold flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time of Birth
                </label>
                <input
                  type="time"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-cosmic-dark/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                  required
                />
              </div>

              {/* LOB with suggestions */}
              <div className="space-y-2 relative">
                <label className="text-sm font-bold text-gold flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location of Birth
                </label>
                <input
                  type="text"
                  value={lob}
                  onChange={(e) => handleLobInput(e.target.value)}
                  placeholder="e.g. Surat, Gujarat"
                  className="w-full px-4 py-3 rounded-xl bg-cosmic-dark/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                  autoComplete="off"
                  required
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-50 bg-cosmic-dark border border-gold/30 text-white w-full mt-1 rounded-xl shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setLob(item)
                          setSuggestions([])
                        }}
                        className="p-3 hover:bg-gold/20 cursor-pointer text-sm border-b border-white/5 last:border-0"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timezone */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gold flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Select Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-cosmic-dark/50 border border-white/10 text-white shadow-sm focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
                  defaultValue="Asia/Kolkata"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Chicago">America/Chicago</option>
                  <option value="America/Denver">America/Denver</option>
                  <option value="America/Los_Angeles">
                    America/Los_Angeles
                  </option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="Asia/Dubai">Asia/Dubai</option>
                  <option value="Asia/Singapore">Asia/Singapore</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                  <option value="Australia/Sydney">Australia/Sydney</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative px-10 py-4 bg-gradient-to-r from-saffron to-maroon rounded-full text-white font-bold shadow-xl shadow-saffron/20 hover:shadow-saffron/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden w-full md:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  {loading ? "Calculating..." : "Get Astrology Report"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`fixed bottom-8 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border flex items-center gap-3 z-50 ${
                toast.type === "error"
                  ? "bg-red-500/20 border-red-500/50 text-red-200"
                  : "bg-green-500/20 border-green-500/50 text-green-200"
              }`}
            >
              {toast.type === "error" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span className="font-semibold">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 w-full max-w-7xl"
          >
            {result.error ? (
              <div className="text-center text-red-200 bg-red-500/20 border border-red-500/50 p-6 rounded-2xl">
                <p className="font-bold flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5" /> Error
                </p>
                <p>{result.error}</p>
              </div>
            ) : (
              <KundaliReportPage reportData={result} p_name1={fullName} />
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Astroreportpage
