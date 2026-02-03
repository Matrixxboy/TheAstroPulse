import React, { useState } from "react"
import SectionWrapper from "../../partials/SectionWrapper"
import { FaCalendarAlt, FaStar, FaMoon, FaSun } from "react-icons/fa"

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
        setResult({ error: "No horoscope found. Check the date." })
      }
    } catch (e) {
      setResult({ error: "Failed to fetch horoscope. Please try again.", e })
    }

    setLoading(false)
  }

  return (
    <div className="w-full min-h-screen py-10">
      <SectionWrapper>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-500 mb-4">
            Daily Horoscope
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Get your daily celestial insights based on your birth chart.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaStar className="text-yellow-400" /> Enter Details
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="relative w-full">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Day
                </label>
                <div className="relative">
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full appearance-none cursor-pointer"
                  >
                    <option value="yesterday" className="bg-[#1a0b2e]">
                      Yesterday
                    </option>
                    <option value="today" className="bg-[#1a0b2e]">
                      Today
                    </option>
                    <option value="tomorrow" className="bg-[#1a0b2e]">
                      Tomorrow
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                    <FaCalendarAlt />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/25 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Consulting Stars..." : "Reveal My Forecast"}
              </button>
            </form>
          </div>

          {/* Result Card */}
          <div className="relative">
            {result ? (
              <div className="animate-fadeInUp bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-white/10 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden">
                {/* Decorative bg elements */}
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <FaMoon className="text-9xl text-yellow-100" />
                </div>

                {result.error ? (
                  <p className="text-red-400 font-semibold">{result.error}</p>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-6">
                      <div className="bg-yellow-400/20 p-4 rounded-full text-yellow-300 text-3xl">
                        <FaSun />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {result.zodiac_sign}
                        </h2>
                        <p className="text-gray-400 text-sm">
                          {result.dob} • {result.day_type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-lg text-gray-100 leading-relaxed whitespace-pre-wrap font-light">
                        {result.horoscope}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/5 border-dashed p-12 rounded-3xl flex flex-col items-center justify-center text-gray-500 h-full min-h-[400px]">
                <FaStar className="text-6xl mb-4 opacity-20" />
                <p>Horoscope results will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}

export default Horoscope
