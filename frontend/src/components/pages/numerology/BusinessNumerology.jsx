import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Sparkles } from "lucide-react"

const BusinessNumerology = () => {
  const [name, setName] = useState("")
  const [cuname, setCuname] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name) return

    setCuname(name)

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BUSINESS_NUMCALCU_API_KEY}?bname=${name}`,
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
            <Briefcase className="w-8 h-8 text-saffron" /> Business Numerology
          </h1>
          <p className="text-smoke">
            Ensure your business name resonates with abundance.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl border border-white/10 shadow-xl max-w-lg mx-auto mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gold flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Business Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Astral Pulse"
                className="w-full bg-cosmic-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name}
              className="w-full bg-gradient-to-r from-saffron to-maroon text-white font-bold py-4 rounded-xl shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Calculating..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Analyze Business Name
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
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gold mb-2">
                    Business Analysis
                  </h2>
                  <p className="text-white/60">
                    Report for{" "}
                    <span className="text-white font-semibold">{cuname}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Cleaned Name</span>{" "}
                      <span className="text-right font-medium text-white">
                        {result.cleaned_name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Name Number</span>{" "}
                      <span className="text-right text-2xl font-bold text-gold">
                        {result.name_number}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Master Number</span>{" "}
                      <span className="text-right font-bold text-white">
                        {result.master_sum}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Vowels Sum</span>{" "}
                      <span className="text-right font-bold text-white">
                        {result.vowels_sum}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-smoke">Consonants Sum</span>{" "}
                      <span className="text-right font-bold text-white">
                        {result.consonants_sum}
                      </span>
                    </div>
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

export default BusinessNumerology
