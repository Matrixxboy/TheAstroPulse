import { useState } from "react"
import { motion } from "framer-motion"
import { gemRing } from "@lucide/lab"
import { House, Car, Briefcase, Clock } from "lucide-react"

const categories = [
  { id: "marriage", label: "Vivah (Marriage)", icon: gemRing },
  { id: "property", label: "Griha Pravesh", icon: House },
  { id: "vehicle", label: "Vehicle Purchase", icon: Car },
  { id: "business", label: "New Business", icon: Briefcase },
]

const timings = [
  {
    category: "marriage",
    date: "June 15, 2026",
    time: "09:45 AM - 12:30 PM",
    nakshatra: "Rohini",
    quality: "Excellent",
  },
  {
    category: "marriage",
    date: "June 18, 2026",
    time: "06:15 PM - 08:00 PM",
    nakshatra: "Mrigashirsha",
    quality: "Good",
  },
  {
    category: "property",
    date: "June 21, 2026",
    time: "10:00 AM - 11:45 AM",
    nakshatra: "Pushya",
    quality: "Best",
  },
  {
    category: "vehicle",
    date: "June 16, 2026",
    time: "11:30 AM - 01:00 PM",
    nakshatra: "Swati",
    quality: "Good",
  },
]

const Muhurat = () => {
  const [activeCategory, setActiveCategory] = useState("marriage")

  const filteredTimings = timings.filter((t) => t.category === activeCategory)

  return (
    <div className="min-h-screen bg-transparent bg-cosmic-dark pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Shubh <span className="text-gradient-gold">Muhurat</span>
          </h1>
          <p className="text-smoke max-w-2xl mx-auto">
            Discover the most auspicious timings for your life's important
            beginnings.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-gold text-cosmic-dark border-gold font-bold shadow-lg shadow-gold/20"
                  : "bg-white/5 text-white border-white/10 hover:border-gold/50 hover:bg-white/10"
              }`}
            >
              <cat.icon className="w-5 h-5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTimings.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-gold/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-gold/20 to-transparent rounded-xl text-gold group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    item.quality === "Excellent" || item.quality === "Best"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {item.quality}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{item.date}</h3>
              <p className="text-gold font-mono text-lg mb-4">{item.time}</p>

              <div className="border-t border-white/10 pt-4 flex justify-between text-sm">
                <span className="text-smoke">Nakshatra</span>
                <span className="text-white font-medium">{item.nakshatra}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTimings.length === 0 && (
          <div className="text-center py-20 text-white/50">
            No specific muhurats found for this category in the upcoming week.
          </div>
        )}
      </div>
    </div>
  )
}

export default Muhurat
