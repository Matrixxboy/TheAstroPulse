import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Calendar, Sun, Moon, Clock, Star } from "lucide-react"

const Muhurat = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  )
  const [panchangData, setPanchangData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Default location: Varanasi
  const location = {
    lat: 25.3176,
    lon: 82.9739,
    timezone: "Asia/Kolkata",
    name: "Varanasi",
  }

  const fetchPanchang = useCallback(
    async (date) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `http://localhost:5000/api/panchang?date=${date}&latitude=${location.lat}&longitude=${location.lon}&timezone=${location.timezone}`,
        )
        if (!response.ok) {
          throw new Error("Failed to fetch panchang data")
        }
        const data = await response.json()
        setPanchangData(data)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching panchang:", err)
      } finally {
        setLoading(false)
      }
    },
    [location.lat, location.lon, location.timezone],
  )

  useEffect(() => {
    fetchPanchang(selectedDate)
  }, [selectedDate, fetchPanchang])

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  return (
    <div className="min-h-screen bg-transparent bg-cosmic-dark pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Shubh <span className="text-gradient-gold">Muhurat</span>
          </h1>
          <p className="text-smoke max-w-2xl mx-auto mb-6">
            Discover the most auspicious timings based on Vedic Panchang
          </p>

          {/* Date Picker */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <Calendar className="w-5 h-5 text-gold" />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <p className="text-smoke text-sm">
            Location: {location.name} ({location.lat}°N, {location.lon}°E)
          </p>
        </div>

        {loading && (
          <div className="text-center py-20 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4">Loading panchang data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && panchangData && (
          <div className="space-y-6">
            {/* Sunrise/Sunset Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sun className="w-6 h-6 text-gold" />
                Sun Timings
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl">
                    <Sun className="w-8 h-8 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-smoke text-sm">Sunrise</p>
                    <p className="text-2xl font-bold text-white">
                      {panchangData.sunrise}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl">
                    <Moon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-smoke text-sm">Sunset</p>
                    <p className="text-2xl font-bold text-white">
                      {panchangData.sunset}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Panchang Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-gold" />
                Panchang Details
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-smoke text-sm mb-1">Tithi</p>
                  <p className="text-lg font-bold text-white">
                    {panchangData.tithi.name}
                  </p>
                  <p className="text-gold text-sm">
                    {panchangData.tithi.paksha}
                  </p>
                </div>
                <div>
                  <p className="text-smoke text-sm mb-1">Nakshatra</p>
                  <p className="text-lg font-bold text-white">
                    {panchangData.nakshatra}
                  </p>
                </div>
                <div>
                  <p className="text-smoke text-sm mb-1">Yoga</p>
                  <p className="text-lg font-bold text-white">
                    {panchangData.yoga}
                  </p>
                </div>
                <div>
                  <p className="text-smoke text-sm mb-1">Weekday</p>
                  <p className="text-lg font-bold text-white">
                    {panchangData.weekday}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Auspicious Timings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-gold" />
                Special Timings
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-green-400 font-bold mb-2">
                    Abhijit Muhurat (Best)
                  </p>
                  <p className="text-white text-lg">
                    {panchangData.abhijit_muhurat}
                  </p>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 font-bold mb-2">
                    Rahu Kalam (Avoid)
                  </p>
                  <p className="text-white text-lg">
                    {panchangData.rahu_kalam}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Day Choghadiya */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Day Choghadiya
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {panchangData.day_choghadiya.map((chog, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      chog.quality === "Best" || chog.quality === "Good"
                        ? "bg-green-500/10 border-green-500/20"
                        : chog.quality === "Gain"
                          ? "bg-blue-500/10 border-blue-500/20"
                          : chog.quality === "Neutral"
                            ? "bg-gray-500/10 border-gray-500/20"
                            : "bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    <p className="font-bold text-white mb-1">{chog.name}</p>
                    <p className="text-sm text-smoke mb-2">{chog.quality}</p>
                    <p className="text-xs text-white/70">
                      {chog.start} - {chog.end}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Night Choghadiya */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Night Choghadiya
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {panchangData.night_choghadiya.map((chog, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      chog.quality === "Best" || chog.quality === "Good"
                        ? "bg-green-500/10 border-green-500/20"
                        : chog.quality === "Gain"
                          ? "bg-blue-500/10 border-blue-500/20"
                          : chog.quality === "Neutral"
                            ? "bg-gray-500/10 border-gray-500/20"
                            : "bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    <p className="font-bold text-white mb-1">{chog.name}</p>
                    <p className="text-sm text-smoke mb-2">{chog.quality}</p>
                    <p className="text-xs text-white/70">
                      {chog.start} - {chog.end}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Muhurat
