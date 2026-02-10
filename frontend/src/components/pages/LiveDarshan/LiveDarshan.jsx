import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Tv, Wifi, WifiOff, RefreshCcw, Clock } from "lucide-react"

const LiveDarshan = () => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTemple, setSelectedTemple] = useState("random")

  const temples = [
    { id: "random", name: "Featured" },
    { id: "somnath", name: "Somnath" },
    { id: "dakor", name: "Dakor" },
    { id: "ambaji", name: "Ambaji" },
    { id: "ganesha", name: "Ganesha" },
    { id: "saibaba", name: "Shirdi Sai" },
    { id: "Khodal", name: "Khodal" },
  ]

  const darshanSchedule = {
    somnath: [
      "Morning Aarti – 6:00 AM",
      "Shringar – 8:00 AM",
      "Madhyan Aarti – 12:00 PM",
      "Sandhya Aarti – 7:00 PM",
    ],
    dakor: [
      "Mangla Aarti – 5:30 AM",
      "Rajbhog – 12:30 PM",
      "Shayan Aarti – 9:00 PM",
    ],
    ambaji: [
      "Morning Darshan – 7:00 AM",
      "Afternoon Darshan – 12:00 PM",
      "Evening Aarti – 7:30 PM",
    ],
    ganesha: ["Morning Puja – 6:00 AM", "Evening Aarti – 8:00 PM"],
    saibaba: [
      "Kakad Aarti – 4:30 AM",
      "Dhoop Aarti – 12:00 PM",
      "Shej Aarti – 10:30 PM",
    ],
    Khodal: ["Morning Darshan – 6:00 AM", "Evening Darshan – 7:00 PM"],
  }

  const checkLiveStatus = async (templeId = selectedTemple) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `http://localhost:5000/live-darshan?channel_id=${templeId}`,
      )
      const data = await res.json()
      setStatus(data)
    } catch (e) {
      setError("Unable to connect to live service")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkLiveStatus(selectedTemple)
  }, [selectedTemple])

  return (
    <div className="min-h-screen px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold flex justify-center items-center gap-3">
            <Tv /> Live Darshan
          </h1>
          <p className="text-white/60 mt-2">
            Experience divine presence in real time
          </p>
        </div>

        {/* Temple Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {temples.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemple(t.id)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                selectedTemple === t.id
                  ? "bg-white text-black"
                  : "border-white/20 hover:bg-white/10"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <div className="grid md:grid-cols-3 gap-6 glass p-6 rounded-2xl border border-white/10">
          {/* Video Area */}
          <div className="md:col-span-2 aspect-video bg-black rounded-xl flex items-center justify-center">
            {loading ? (
              <Loader2 className="animate-spin w-10 h-10 text-white/60" />
            ) : status?.is_live ? (
              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${status.video_id}?autoplay=1&mute=1`}
                title={status.title || "Live Darshan"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center">
                <WifiOff className="w-10 h-10 mx-auto mb-4 text-white/40" />
                <p className="text-white/60">
                  Live darshan is currently unavailable
                </p>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Status */}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                {status?.is_live ? (
                  <>
                    <Wifi className="text-green-400" />
                    <span className="text-green-400 font-semibold">LIVE</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="text-red-400" />
                    <span className="text-red-400 font-semibold">OFFLINE</span>
                  </>
                )}
              </span>
              <button
                onClick={() => checkLiveStatus(selectedTemple)}
                className="text-sm flex items-center gap-1 text-white/60 hover:text-white"
              >
                <RefreshCcw className="w-4 h-4" /> Refresh
              </button>
            </div>

            {/* Schedule */}
            {!status?.is_live && selectedTemple !== "random" && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <Clock className="w-4 h-4" /> Darshan Timings
                </h3>
                <ul className="space-y-2 text-sm text-white/70">
                  {(darshanSchedule[selectedTemple] || []).map((time, i) => (
                    <li key={i} className="border-b border-white/10 pb-1">
                      {time}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-center text-red-400 mt-6 text-sm">{error}</p>
        )}
      </div>
    </div>
  )
}

export default LiveDarshan
