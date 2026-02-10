import React from "react"
import { motion } from "framer-motion"
import { Shield, Coins, Heart, Briefcase, Zap, Moon } from "lucide-react"

const problems = [
  {
    category: "Health",
    icon: Heart,
    color: "rose",
    title: "Vitality & Wellness",
    desc: "Ancient healing mantras and gemstone recommendations for physical and mental well-being.",
  },
  {
    category: "Wealth",
    icon: Coins,
    color: "amber",
    title: "Financial Prosperity",
    desc: "Vedic solutions to remove blockages in wealth accumulation and attract abundance.",
  },
  {
    category: "Career",
    icon: Briefcase,
    color: "blue",
    title: "Professional Growth",
    desc: "Remedies for job stability, promotion, and overcoming workplace politics.",
  },
  {
    category: "Protection",
    icon: Shield,
    color: "purple",
    title: "Evil Eye & Negativity",
    desc: "Powerful yantras and rituals to shield yourself from negative energies.",
  },
]

const Remedies = () => {
  return (
    <div className="min-h-screen bg-transparent bg-cosmic-dark pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">Vedic Solutions</span>
          </div> */}
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Cosmic <span className="text-gradient-gold">Remedies</span>
          </h1>
          <p className="text-smoke max-w-2xl mx-auto text-lg">
            Align your karma with the stars. Discover powerful Vedic remedies to
            harmonize your life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 group relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 p-32 bg-${problem.color}-500/10 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-${problem.color}-500/20`}
              />

              <div
                className={`w-14 h-14 rounded-2xl bg-${problem.color}-500/20 flex items-center justify-center text-${problem.color}-400 mb-6`}
              >
                <problem.icon className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                {problem.title}
              </h3>
              <p className="text-smoke leading-relaxed mb-6">{problem.desc}</p>

              <button className="flex items-center gap-2 text-gold font-semibold group-hover:gap-3 transition-all">
                View Remedies <Moon className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-saffron/10 to-maroon/10 border border-gold/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-5" />
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Need Personalized Guidance?
          </h2>
          <p className="text-smoke max-w-xl mx-auto mb-8">
            Our expert astrologers can analyze your Kundali and suggest the most
            effective remedies tailored specifically for you.
          </p>
          <button className="px-8 py-4 bg-gold text-cosmic-dark font-bold rounded-full hover:bg-white transition-colors">
            Consult an Astrologer
          </button>
        </div>
      </div>
    </div>
  )
}

export default Remedies
