import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Sparkles,
  Star,
  ScanFace,
  Compass,
  Calculator,
  Brain,
  ArrowRight,
} from "lucide-react"
import Chatbot from "../chatbot/Chatbot"
import { ErrorBoundary } from "react-error-boundary"
import DailyWisdom from "../../partials/DailyWisdom"
// const Mandala = () => {
//   const signs = [
//     "♈",
//     "♉",
//     "♊",
//     "♋",
//     "♌",
//     "♍",
//     "♎",
//     "♏",
//     "♐",
//     "♑",
//     "♒",
//     "♓",
//   ]
//   const radius = 82

//   const points = Array.from({ length: 12 })
//     .map((_, i) => {
//       const angle = (i * 30 - 90) * (Math.PI / 180)
//       const x = 100 + 45 * Math.cos(angle)
//       const y = 100 + 45 * Math.sin(angle)
//       return `${x},${y}`
//     })
//     .join(" ")

//   const starPoints = Array.from({ length: 24 })
//     .map((_, i) => {
//       const r = i % 2 === 0 ? 50 : 25
//       const angle = (i * 15 - 90) * (Math.PI / 180)
//       const x = 100 + r * Math.cos(angle)
//       const y = 100 + r * Math.sin(angle)
//       return `${x},${y}`
//     })
//     .join(" ")

//   return (
//     <motion.svg
//       viewBox="0 0 200 200"
//       className="w-64 h-64 md:w-96 md:h-96 opacity-40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
//       initial={{ rotate: 0 }}
//       animate={{ rotate: 360 }}
//       transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
//     >
//       <circle
//         cx="100"
//         cy="100"
//         r="95"
//         fill="none"
//         stroke="#D4AF37"
//         strokeWidth="0.5"
//         opacity="0.3"
//       />
//       <circle
//         cx="100"
//         cy="100"
//         r="90"
//         fill="none"
//         stroke="#D4AF37"
//         strokeWidth="1.5"
//       />
//       <circle
//         cx="100"
//         cy="100"
//         r="72"
//         fill="none"
//         stroke="#D4AF37"
//         strokeWidth="1"
//       />

//       {signs.map((sign, i) => {
//         const angle = (i * 30 - 90) * (Math.PI / 180)
//         const x = 100 + radius * Math.cos(angle)
//         const y = 100 + radius * Math.sin(angle)

//         return (
//           <text
//             key={sign}
//             x={x}
//             y={y}
//             fill="#D4AF37"
//             fontSize="9"
//             textAnchor="middle"
//             alignmentBaseline="middle"
//             className="select-none font-serif"
//           >
//             {sign}
//           </text>
//         )
//       })}

//       <polygon
//         points={starPoints}
//         fill="none"
//         stroke="#D4AF37"
//         strokeWidth="1"
//         strokeLinejoin="round"
//       />

//       <circle
//         cx="100"
//         cy="100"
//         r="25"
//         fill="none"
//         stroke="#D4AF37"
//         strokeWidth="0.5"
//       />

//       <rect
//         x="65"
//         y="65"
//         width="70"
//         height="70"
//         fill="none"
//         stroke="#D4AF37"
//         strokeWidth="0.75"
//         transform="rotate(45 100 100)"
//         opacity="0.6"
//       />

//       <circle cx="100" cy="100" r="2" fill="#D4AF37" />
//     </motion.svg>
//   )
// }

const ServiceCard = ({ icon: Icon, title, link, desc }) => (
  <motion.div
    whileHover={{ y: -10, rotateX: 5 }}
    className="glass p-6 rounded-2xl border border-white/10 hover:border-gold/50 transition-all duration-300 relative group overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <Icon className="w-12 h-12 text-saffron mb-4 group-hover:text-gold transition-colors" />
    <h3 className="text-xl font-heading font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-smoke mb-4 font-body">{desc}</p>
    <Link
      to={link}
      className="flex items-center text-gold text-sm font-semibold group-hover:gap-2 transition-all"
    >
      Explore <ArrowRight className="w-4 h-4 ml-1" />
    </Link>
  </motion.div>
)

const HomePage = () => {
  return (
    <div className="min-h-screen bg-transparent text-ash font-body overflow-x-hidden relative">
      {/* Background Stars handled in MainLayout */}
      {/* 🟣 Hero Section */}
      <DailyWisdom />
      <section className="w-full relative flex flex-col items-center justify-center text-center px-4 py-10 overflow-hidden">
        {/* Zodiac Wheel Animation */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-20 z-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        >
          <img
            src="/zodicWheel.png"
            alt="Zodiac Wheel"
            className="w-full h-full object-contain mix-blend-darken"
          />
        </motion.div>

        {/* <Mandala /> */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 relative max-w-4xl"
        >
          <h2 className="text-saffron font-sanskrit text-2xl md:text-3xl mb-4 tracking-widest font-bold">
            ॐ ज्ञानं ब्रह्म
          </h2>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight">
            Discover Your <span className="text-gradient-gold">Destiny</span>{" "}
            <br />
            with AI Astrology
          </h1>
          <p className="text-lg md:text-xl text-smoke max-w-2xl mx-auto mb-10 leading-relaxed">
            Unveil the cosmic blueprint of your life using the ancient wisdom of
            the Vedas, powered by advanced Artificial Intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/horoscope"
              className="relative px-8 py-4 bg-gradient-to-r from-saffron to-maroon rounded-full text-white font-bold shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Get Your Kundali
              </span>
            </Link>
            <button className="px-8 py-4 border border-gold/50 rounded-full text-gold font-bold hover:bg-gold/10 transition-all duration-300 flex items-center gap-2">
              <Brain className="w-5 h-5" /> Talk to Astro AI
            </button>
          </div>
        </motion.div>
      </section>

      {/* 🪐 Services Section */}
      <section className="py-24 px-4 relative bg-color-background/20 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Divine Services
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={ScanFace}
              title="AI Palmistry"
              link="/palmreading"
              desc="Scan your palm to reveal your life path, career, and fate using computer vision."
            />
            <ServiceCard
              icon={Star}
              title="Daily Horoscope"
              link="/horoscope"
              desc="Get personalized daily predictions based on your zodiac sign and planetary movements."
            />
            <ServiceCard
              icon={Calculator}
              title="Numerology"
              link="/numerology"
              desc="Unlock the hidden meaning behind your name and birth date numbers."
            />
            <ServiceCard
              icon={Compass}
              title="Vastu Shastra"
              link="/vastu"
              desc="Optimize your living space for harmony and prosperity using ancient architectural science."
            />
            <ServiceCard
              icon={Brain}
              title="Astro AI Chat"
              link="/astrology/astroinfo"
              desc="Ask our Vedic AI sage anything about your future, career, or relationships."
            />
          </div>
        </div>
      </section>

      {/* 🧠 AI Engine Section */}
      <section className="py-24 bg-black/20 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Powered by{" "}
              <span className="text-gradient-gold">Cosmic Intelligence</span>
            </h2>
            <p className="text-smoke text-lg mb-6 leading-relaxed">
              Our proprietary engine combines 5,000 years of Vedic scriptures
              with state-of-the-art Machine Learning. We process planetary
              positions, nakshatras, and dashas in real-time to deliver accuracy
              that rivals human astrologers.
            </p>
            <ul className="space-y-3 text-ash">
              <li className="flex items-center gap-3">
                <Star className="w-4 h-4 text-gold" /> Precise Planetary
                Calculations
              </li>
              <li className="flex items-center gap-3">
                <Star className="w-4 h-4 text-gold" /> Vedic + NLP
                Interpretation
              </li>
              <li className="flex items-center gap-3">
                <Star className="w-4 h-4 text-gold" /> Instant Personalized
                Reports
              </li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Abstract AI Visual */}
            <div className="relative w-80 h-80">
              <motion.div
                className="absolute inset-0 border-2 border-indigo rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 border border-saffron/50 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-32 h-32 text-gold opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌺 Testimonials Section */}
      <section className="py-24 relative bg-color-background/20 backdrop-blur-sm">
        <div className="py-16 text-center">
          <p className="font-sanskrit text-2xl text-gold mb-2">
            "यथा पिण्डे तथा ब्रह्माण्डे"
          </p>
          <p className="text-smoke italic">
            "As is the human body, so is the cosmic body."
          </p>
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-white mb-16">
            Seeker's <span className="text-gradient-gold">Experiences</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Aarav P.",
                text: "The accuracy of the Kundali analysis was frighteningly good. It helped me navigate a tough career change.",
                loc: "Mumbai",
              },
              {
                name: "Sarah J.",
                text: "I was skeptical about AI astrology, but the Vastu report for my new apartment instantly changed the vibe. Highly recommend!",
                loc: "New York",
              },
              {
                name: "Vihaan K.",
                text: "Palmistry scan is next level. It identified traits I've never told anyone. Truly divine tech.",
                loc: "Bangalore",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass p-8 rounded-2xl border border-white/5 relative"
              >
                <div className="absolute -top-6 left-8 bg-cosmic-dark border border-gold/50 p-3 rounded-full">
                  <Sparkles className="w-6 h-6 text-saffron" />
                </div>
                <p className="text-smoke italic mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <div>
                  <h4 className="font-heading font-bold text-white">
                    {t.name}
                  </h4>
                  <p className="text-xs text-gold uppercase tracking-wider">
                    {t.loc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ErrorBoundary>
        <Chatbot />
      </ErrorBoundary>
    </div>
  )
}

export default HomePage
