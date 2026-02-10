import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Sun,
  Moon,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const PanchangRow = ({ label, value, icon: Icon, time }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-gold/30 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-gold/10 rounded-lg text-gold">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-white font-semibold">{label}</h4>
        <p className="text-sm text-gold">{value}</p>
      </div>
    </div>
    {time && (
      <div className="text-right">
        <p className="text-xs text-smoke">Until</p>
        <p className="text-sm font-mono text-white/80">{time}</p>
      </div>
    )}
  </motion.div>
)

const ChoghadiyaItem = ({ name, quality, start, end }) => {
  const getQualityColor = (q) => {
    switch (q) {
      case "Best":
      case "Good":
      case "Gain":
        return "text-green-400 border-green-500/20 bg-green-900/10"
      case "Bad":
      case "Evil":
      case "Loss":
        return "text-red-400 border-red-500/20 bg-red-900/10"
      default:
        return "text-blue-300 border-blue-500/20 bg-blue-900/10"
    }
  }

  const colorClass = getQualityColor(quality)

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${colorClass} mb-2`}
    >
      <div>
        <span className="font-semibold block">{name}</span>
        <span className="text-xs opacity-70 uppercase tracking-wider">
          {quality}
        </span>
      </div>
      <div className="text-right font-mono text-sm opacity-90">
        {start} - {end}
      </div>
    </div>
  )
}

const Panchang = () => {
  const [date, setDate] = useState(new Date())
  const [panchangData, setPanchangData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Toggle sections
  const [showDayChoghadiya, setShowDayChoghadiya] = useState(true)
  const [showNightChoghadiya, setShowNightChoghadiya] = useState(true)

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value)
    if (!isNaN(newDate)) {
      setDate(newDate)
    }
  }

  React.useEffect(() => {
    const fetchPanchang = async () => {
      try {
        setLoading(true)
        // Default location: Varanasi (Spiritual capital)
        // TODO: Get user's location
        const lat = 25.3176
        const lon = 82.9739
        const tz = "Asia/Kolkata"
        // Adjust for local time representation to avoid UTC shift issues on date string
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        const formattedDate = `${year}-${month}-${day}`

        const response = await fetch(
          `http://localhost:5000/api/panchang?date=${formattedDate}&latitude=${lat}&longitude=${lon}&timezone=${tz}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch Panchang data")
        }

        const data = await response.json()
        setPanchangData(data)
      } catch (err) {
        console.error("Error fetching panchang:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPanchang()
  }, [date])

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent bg-cosmic-dark pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-gold animate-pulse text-xl">
          Aligning with the cosmos...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent bg-cosmic-dark pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-red-400">
          Error loading cosmic data. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent bg-cosmic-dark pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/20 mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-semibold">Daily Panchang</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            <span className="text-gradient-gold">Cosmic Rhythm</span>
          </h1>

          {/* Date Picker */}
          <div className="mt-6 flex justify-center">
            <input
              type="date"
              value={date.toISOString().split("T")[0]}
              onChange={handleDateChange}
              className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-gold/50 transition-colors cursor-pointer text-center font-mono"
            />
          </div>

          <p className="text-smoke max-w-2xl mx-auto mt-4">
            Plan your day with the precision of Vedic timekeeping. Authentic
            Tithi, Nakshatra, Yoga, and Choghadiya calculations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-[#1A1A2E]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-heading font-bold text-white">
                  {date.toLocaleDateString("en-US", { weekday: "long" })}
                </h2>
                <p className="text-gold text-lg">
                  {date.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-8 text-right bg-black/20 p-4 rounded-xl border border-white/5">
                <div>
                  <p className="text-xs text-smoke uppercase tracking-wider">
                    Sunrise
                  </p>
                  <p className="text-gold font-mono text-lg">
                    {panchangData?.sunrise}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-smoke uppercase tracking-wider">
                    Sunset
                  </p>
                  <p className="text-blue-300 font-mono text-lg">
                    {panchangData?.sunset}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <PanchangRow
                label="Tithi"
                value={`${panchangData?.tithi?.name} (${panchangData?.tithi?.paksha})`}
                icon={Moon}
                time="Full Day"
              />
              <PanchangRow
                label="Nakshatra"
                value={panchangData?.nakshatra}
                icon={Star}
                time="Full Day"
              />
              <PanchangRow
                label="Yoga"
                value={panchangData?.yoga}
                icon={Sun}
                time="Full Day"
              />
              <PanchangRow
                label="Karana"
                value={panchangData?.karana}
                icon={Clock}
                time="Full Day"
              />
            </div>

            {/* Choghadiya Section */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-gold" />
                Choghadiya Timings
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Day Choghadiya */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => setShowDayChoghadiya(!showDayChoghadiya)}
                  >
                    <h4 className="text-lg font-semibold text-yellow-200 flex items-center gap-2">
                      <Sun className="w-4 h-4" /> Day Choghadiya
                    </h4>
                    {showDayChoghadiya ? (
                      <ChevronUp className="w-4 h-4 text-smoke" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-smoke" />
                    )}
                  </div>
                  {showDayChoghadiya && (
                    <div className="space-y-1">
                      {panchangData?.day_choghadiya?.map((item, idx) => (
                        <ChoghadiyaItem key={idx} {...item} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Night Choghadiya */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => setShowNightChoghadiya(!showNightChoghadiya)}
                  >
                    <h4 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                      <Moon className="w-4 h-4" /> Night Choghadiya
                    </h4>
                    {showNightChoghadiya ? (
                      <ChevronUp className="w-4 h-4 text-smoke" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-smoke" />
                    )}
                  </div>
                  {showNightChoghadiya && (
                    <div className="space-y-1">
                      {panchangData?.night_choghadiya?.map((item, idx) => (
                        <ChoghadiyaItem key={idx} {...item} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Side Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/20"
            >
              <h3 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Abhijit Muhurat
              </h3>
              <p className="text-sm text-green-200/80 mb-1">
                Best time for auspicious activities
              </p>
              <p className="text-xl font-mono text-white">
                {panchangData?.abhijit_muhurat}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/20"
            >
              <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Rahu Kaal
              </h3>
              <p className="text-sm text-red-200/80 mb-1">
                Avoid starting new ventures
              </p>
              <p className="text-xl font-mono text-white">
                {panchangData?.rahu_kalam}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-3">
                Today's Festival
              </h3>
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1605634648799-6e5454b5f8f2?q=80&w=200&auto=format&fit=crop"
                  alt="Festival"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="text-gold font-semibold">Daily Rituals</h4>
                  <p className="text-sm text-smoke mt-1 line-clamp-2">
                    Check today's special rituals and observances based on the
                    Tithi.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Panchang
