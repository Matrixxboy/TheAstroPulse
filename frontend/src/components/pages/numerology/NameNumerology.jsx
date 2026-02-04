import React, { useState } from "react"
import LoShuGrid from "./Report/chart/LoShuGrid"
import { motion, AnimatePresence } from "framer-motion"
import { User, Calendar, RefreshCw, Star, Sparkles, Binary } from "lucide-react"

const NameNumerology = () => {
  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [cgender, setCgender] = useState("")
  const [cuname, setCuname] = useState("")
  const [cudob, setCudob] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !dob) return

    setCuname(name)
    setCudob(dob)
    setCgender(gender)

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_NAME_NUMCALCU_API_KEY}?fname=${name}&dob=${dob}&gen=${gender}`,
        {
          headers: {
            "Numlogy-API-KEY": import.meta.env.VITE_API_KEY_TOKEN,
          },
        },
      )
      const data = await response.json()
      if (data.error) {
        setResult({ error: data.error })
        showToast("Something went wrong", "error")
      } else {
        setResult(data)
        showToast("Numerology report fetched successfully", "success")
      }
    } catch (e) {
      setResult({
        error: "Failed to fetch numerology report. Please try again.",
        e,
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen py-12 flex flex-col items-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-gradient-gold mb-3 flex items-center justify-center gap-3">
            <Star className="w-8 h-8 text-saffron" /> Name Numerology
          </h1>
          <p className="text-smoke">Unlock the vibration of your name.</p>
        </div>

        <div className="glass p-8 rounded-2xl border border-white/10 shadow-xl max-w-lg mx-auto mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gold flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pratap Sharma"
                className="w-full bg-cosmic-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gold flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-cosmic-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gold flex items-center gap-2">
                <Binary className="w-4 h-4" /> Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-cosmic-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  Select Gender
                </option>
                <option value="Male" className="bg-slate-900">
                  Male
                </option>
                <option value="Female" className="bg-slate-900">
                  Female
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !dob}
              className="w-full bg-gradient-to-r from-saffron to-maroon text-white font-bold py-4 rounded-xl shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Calculating..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Get Numerology Report
                </>
              )}
            </button>
          </form>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl text-white z-50 flex items-center gap-3 backdrop-blur-md border ${
                toast.type === "error"
                  ? "bg-red-500/80 border-red-400"
                  : "bg-green-500/80 border-green-400"
              }`}
            >
              {toast.type === "error" ? (
                <div className="w-2 h-2 rounded-full bg-white" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 glass p-8 rounded-2xl border border-gold/30"
          >
            {result.error ? (
              <p className="text-red-400 text-center">{result.error}</p>
            ) : (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gold mb-2">
                    Numerology Report
                  </h2>
                  <p className="text-white/60">
                    Analysis for{" "}
                    <span className="text-white font-semibold">{cuname}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                    <h3 className="text-lg font-bold text-saffron mb-4 border-b border-white/10 pb-2">
                      Core Numbers
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Name Number</span>{" "}
                      <span className="text-xl font-bold text-white">
                        {result.name_number}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Life Path</span>{" "}
                      <span className="text-xl font-bold text-white">
                        {result.master_sum}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Soul Urge</span>{" "}
                      <span className="text-xl font-bold text-white">
                        {result.vowels_sum}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Driver</span>{" "}
                      <span className="text-xl font-bold text-white">
                        {result.driver_number}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Connector</span>{" "}
                      <span className="text-xl font-bold text-white">
                        {result.connector_number}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Kua Number</span>{" "}
                      <span className="text-xl font-bold text-white">
                        {result.kua_number}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                    <h3 className="text-lg font-bold text-saffron mb-4 border-b border-white/10 pb-2">
                      Lucky Factors
                    </h3>
                    <div className="flex justify-between">
                      <span className="text-smoke">Lucky Day</span>{" "}
                      <span className="text-white text-right">
                        {result.lucky_list?.day}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-smoke">Planet</span>{" "}
                      <span className="text-white text-right">
                        {result.lucky_list?.planet}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-smoke">Colors</span>{" "}
                      <span className="text-white text-right">
                        {result.lucky_list?.lucky_colors}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-smoke">Stones</span>{" "}
                      <span className="text-white text-right">
                        {result.lucky_list?.lucky_stones}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold text-saffron mb-2">
                      Personality Profile: {result.personality_traits?.nickname}
                    </h3>
                    <div className="text-white/80 space-y-4 leading-relaxed font-body">
                      <p>{result.personality_traits?.vibe}</p>
                      <p>{result.personality_traits?.how_people_see_you}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold text-saffron mb-2">
                      Life Path & Purpose
                    </h3>
                    <div className="text-white/80 space-y-4 leading-relaxed font-body">
                      <p>
                        <strong>Strengths: </strong>
                        {result.life_path_number?.strengths}
                      </p>
                      <p>
                        <strong>Challenges: </strong>
                        {result.life_path_number?.challenges}
                      </p>
                      <p>
                        <strong>Life Purpose: </strong>
                        {result.life_path_number?.life_purpose}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center pt-8 border-t border-white/10">
                  <h3 className="text-2xl font-bold text-gold mb-6">
                    Lo Shu Grid
                  </h3>
                  <div className="bg-white p-4 rounded-xl shadow-2xl">
                    <LoShuGrid gridData={result.lo_shu_grid} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default NameNumerology
