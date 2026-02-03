import React, { useState } from "react"
import KundaliReportPage from "./Reportpages/KundaliReportPage"
import SectionWrapper from "../../partials/SectionWrapper"

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
        `${import.meta.env.VITE_ASTRO_API_URL}?dob=${dob}&tob=${tob}&lob=${encodeURIComponent(lob)}&timezone=${timezone}`,
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
    } catch (e) {
      setResult({
        error: "Failed to fetch astrology report. Please try again.",
      })
      showToast("API Error", "error")
    }

    setLoading(false)
  }

  return (
    <div className="w-full min-h-screen">
      <SectionWrapper>
        <div className="flex flex-col items-center justify-center">
          {!result && (
            <div className="w-full max-w-2xl animate-fadeInUp">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 mb-4">
                  Astrology Report Generator
                </h1>
                <p className="text-gray-400">
                  Enter your precise birth details to generate your
                  comprehensive Vedic Kundali.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-cyan-400 transition-colors">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* DOB */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                    {/* TOB */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Time of Birth
                      </label>
                      <input
                        type="time"
                        value={tob}
                        onChange={(e) => setTob(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* LOB with suggestions */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location of Birth
                    </label>
                    <input
                      type="text"
                      value={lob}
                      onChange={(e) => handleLobInput(e.target.value)}
                      placeholder="e.g. Mumbai, India"
                      className="w-full"
                      autoComplete="off"
                      required
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute z-50 left-0 w-full mt-2 bg-[#1a0b2e] border border-white/20 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                        {suggestions.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setLob(item)
                              setSuggestions([])
                            }}
                            className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm text-gray-300 border-b border-white/5 last:border-0 transition-colors"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Timezone
                    </label>
                    <div className="relative">
                      <select
                        id="timezone"
                        name="timezone"
                        onChange={(e) => setTimezone(e.target.value)}
                        value={timezone}
                        className="w-full appearance-none cursor-pointer"
                      >
                        <option value="Asia/Kolkata" className="bg-[#1a0b2e]">
                          Asia/Kolkata (IST)
                        </option>
                        <option
                          value="America/New_York"
                          className="bg-[#1a0b2e]"
                        >
                          New York (EST)
                        </option>
                        <option
                          value="America/Chicago"
                          className="bg-[#1a0b2e]"
                        >
                          Chicago (CST)
                        </option>
                        <option value="America/Denver" className="bg-[#1a0b2e]">
                          Denver (MST)
                        </option>
                        <option
                          value="America/Los_Angeles"
                          className="bg-[#1a0b2e]"
                        >
                          Los Angeles (PST)
                        </option>
                        <option value="Europe/London" className="bg-[#1a0b2e]">
                          London (GMT)
                        </option>
                        <option value="Europe/Berlin" className="bg-[#1a0b2e]">
                          Berlin (CET)
                        </option>
                        <option value="Asia/Dubai" className="bg-[#1a0b2e]">
                          Dubai (GST)
                        </option>
                        <option value="Asia/Singapore" className="bg-[#1a0b2e]">
                          Singapore (SGT)
                        </option>
                        <option value="Asia/Tokyo" className="bg-[#1a0b2e]">
                          Tokyo (JST)
                        </option>
                        <option
                          value="Australia/Sydney"
                          className="bg-[#1a0b2e]"
                        >
                          Sydney (AEDT)
                        </option>
                        <option value="UTC" className="bg-[#1a0b2e]">
                          UTC
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Aligning Stars...
                      </span>
                    ) : (
                      "Generate Cosmic Report"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div
              className={`fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-2xl text-white z-50 transition-all duration-300 animate-fade-in-up flex items-center gap-3 ${
                toast.type === "error"
                  ? "bg-red-500/90 backdrop-blur-md"
                  : "bg-green-500/90 backdrop-blur-md"
              }`}
            >
              {toast.type === "error" ? "⚠️" : "✨"} {toast.message}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="w-full animate-fadeInUp">
              {result.error ? (
                <div className="max-w-2xl mx-auto text-center bg-red-500/10 border border-red-500/20 p-8 rounded-3xl backdrop-blur-md">
                  <h3 className="text-xl font-bold text-red-400 mb-2">
                    Cosmic Alignment Failed
                  </h3>
                  <p className="text-gray-300">{result.error}</p>
                  <button
                    onClick={() => setResult(null)}
                    className="mt-6 text-sm text-red-300 hover:text-white underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="glass-card">
                  <KundaliReportPage reportData={result} p_name1={fullName} />
                  <div className="mt-8 text-center pb-12">
                    <button
                      onClick={() => setResult(null)}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm"
                    >
                      Generate Another Chart
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SectionWrapper>
    </div>
  )
}

export default Astroreportpage
