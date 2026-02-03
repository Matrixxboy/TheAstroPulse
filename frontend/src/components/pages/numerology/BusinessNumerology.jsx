import React, { useState } from "react"
import SectionWrapper from "../../partials/SectionWrapper"
import { FaBuilding, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"

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
        showToast("Report generated successfully", "success")
      }
    } catch (e) {
      setResult({
        error: "Failed to fetch numerology report. Please try again.",
        e,
      })
      showToast("Connection Error", "error")
    }

    setLoading(false)
  }

  return (
    <div className="w-full min-h-screen py-10">
      <SectionWrapper>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 mb-4">
            Business Name Numerology
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Analyze the vibrational frequency of your brand name. Ensure it
            aligns with prosperity, growth, and market leadership using Chaldean
            numerology.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <FaBuilding />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. The Astral Pulse"
                    className="w-full pl-11 focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Calculating Vibrations..." : "Analyze Brand Name"}
              </button>
            </form>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-10 animate-fadeInUp">
              {result.error ? (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
                  <p className="text-red-400 flex items-center justify-center gap-2">
                    <FaExclamationCircle /> {result.error}
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 p-8 rounded-3xl backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-center text-cyan-200 mb-8 border-b border-white/5 pb-4">
                    Numerology Analysis
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                      <span className="text-gray-400 text-sm">Input Name</span>
                      <span className="font-semibold text-white">{cuname}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                      <span className="text-gray-400 text-sm">
                        Cleaned Name
                      </span>
                      <span className="font-mono text-cyan-300">
                        {result.cleaned_name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-cyan-500/20 p-4 rounded-xl text-center border border-cyan-500/30">
                        <div className="text-3xl font-bold text-cyan-300 mb-1">
                          {result.name_number}
                        </div>
                        <div className="text-xs text-cyan-100 uppercase tracking-wider">
                          Name Number
                        </div>
                      </div>
                      <div className="bg-blue-500/20 p-4 rounded-xl text-center border border-blue-500/30">
                        <div className="text-3xl font-bold text-blue-300 mb-1">
                          {result.master_sum}
                        </div>
                        <div className="text-xs text-blue-100 uppercase tracking-wider">
                          Compound
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-white mb-1">
                          {result.vowels_sum}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Soul Urge
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-white mb-1">
                          {result.consonants_sum}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Dream
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-white mb-1">
                          {result.connector_number}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Connector
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-2xl text-white z-50 transition-all duration-300 animate-fadeInUp flex items-center gap-3 ${toast.type === "error" ? "bg-red-500/90" : "bg-green-500/90"}`}
          >
            {toast.type === "error" ? (
              <FaExclamationCircle />
            ) : (
              <FaCheckCircle />
            )}{" "}
            {toast.message}
          </div>
        )}
      </SectionWrapper>
    </div>
  )
}

export default BusinessNumerology
