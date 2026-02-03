import React, { useEffect, useState } from "react"
import Chatbot from "../chatbot/Chatbot"
import { Link } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"
import SectionWrapper from "../../partials/SectionWrapper"
import {
  FaStar,
  FaHandPaper,
  FaCompass,
  FaSortNumericUp,
  FaMoon,
  FaQuoteLeft,
  FaCheckCircle,
  FaLock,
  FaUserCheck,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa"

// Utility for safe color classes
const getColorClass = (color, type) => {
  const map = {
    purple: {
      bg: "bg-purple-500",
      text: "text-purple-400",
      from: "from-purple-400",
      to: "to-purple-600",
    },
    pink: {
      bg: "bg-pink-500",
      text: "text-pink-400",
      from: "from-pink-400",
      to: "to-pink-600",
    },
    green: {
      bg: "bg-emerald-500",
      text: "text-emerald-400",
      from: "from-emerald-400",
      to: "to-emerald-600",
    },
    blue: {
      bg: "bg-cyan-500",
      text: "text-cyan-400",
      from: "from-cyan-400",
      to: "to-cyan-600",
    },
    yellow: {
      bg: "bg-yellow-500",
      text: "text-yellow-400",
      from: "from-yellow-400",
      to: "to-yellow-600",
    },
  }
  const c = map[color] || map.purple

  if (type === "glow") return `${c.bg}/20`
  if (type === "icon-bg") return `bg-gradient-to-br ${c.from} ${c.to}`
  if (type === "title") return c.text
  return ""
}

const ServiceCard = ({ to, icon, title, description, color }) => (
  <Link
    to={to}
    className="group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
  >
    <div
      className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl transition-all duration-500 ${getColorClass(color, "glow")} group-hover:bg-opacity-30`}
    ></div>
    <div className="relative z-10">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 ${getColorClass(color, "icon-bg")}`}
      >
        <div className="text-2xl text-white">{icon}</div>
      </div>
      <h3
        className={`text-xl font-bold mb-3 transition-colors ${getColorClass(color, "title")} group-hover:text-white`}
      >
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
        {description}
      </p>
    </div>
  </Link>
)

const FeatureItem = ({ icon, title, text }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
    <div className="text-4xl text-yellow-400 mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{text}</p>
  </div>
)

const TestimonialCard = ({ name, quote, role }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative">
    <FaQuoteLeft className="text-purple-500/20 text-4xl absolute top-4 left-4" />
    <p className="text-gray-300 italic mb-4 relative z-10 pt-6">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="text-white font-bold text-sm">{name}</h4>
        <p className="text-purple-400 text-xs">{role}</p>
      </div>
    </div>
  </div>
)

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [tip] = useState({
    title: "Cosmic Tip of the Day",
    text: "The moon is in a favorable position today. It's a great time to start new creative projects or reconnect with old friends.",
    sign: "Universal",
  })

  return (
    <div className="relative w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[100px]"></div>
        </div>

        <SectionWrapper className="text-center relative z-10">
          <div className="inline-block animate-fadeInUp mb-6">
            <span className="py-2 px-6 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-sm font-semibold tracking-wider uppercase backdrop-blur-md shadow-lg shadow-purple-500/10">
              ✨ Gateway to Cosmic Wisdom
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 animate-fadeInUp animation-delay-200 leading-tight">
            <span className="text-white drop-shadow-lg">Unveil Your</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-purple-400 to-indigo-400 drop-shadow-lg">
              Cosmic Blueprint
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed animate-fadeInUp animation-delay-400 font-light">
            Ancient Vedic sciences meet modern technology. Explore your destiny
            through
            <span className="text-purple-300 font-medium"> Astrology</span>,
            <span className="text-pink-300 font-medium"> Palmistry</span>, and
            <span className="text-cyan-300 font-medium"> Numerology</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp animation-delay-600">
            <Link
              to="/astrology/astrologyreport"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-bold rounded-full shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              Get Your Free Report <FaArrowRight />
            </Link>
            <Link
              to="/horoscope"
              className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white text-lg font-bold rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              Daily Horoscope
            </Link>
          </div>
        </SectionWrapper>
      </section>

      {/* Daily Cosmic Tip Section */}
      <section className="py-12 relative z-10 -mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="bg-yellow-500/20 p-4 rounded-full text-yellow-400 text-3xl shrink-0 animate-pulse">
              <FaLightbulb />
            </div>
            <div className="flex-1">
              <h3 className="text-purple-300 font-bold uppercase tracking-widest text-sm mb-2">
                {tip.title}
              </h3>
              <p className="text-white text-lg font-medium italic">
                "{tip.text}"
              </p>
            </div>
            <div className="hidden md:block h-12 w-px bg-white/10"></div>
            <div className="text-center shrink-0">
              <span className="block text-gray-400 text-xs uppercase tracking-wider">
                Applicable For
              </span>
              <span className="text-white font-bold">{tip.sign}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <SectionWrapper id="services">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Divine{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Services
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Comprehensive spiritual tools designed to bring clarity, direction,
            and harmony to your life path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            to="/astrology"
            icon={<FaStar />}
            title="Astrology"
            description="Deep dive into your natal chart. Understand planetary influences on your career, relationships, and health."
            color="purple"
          />
          <ServiceCard
            to="/palmreading"
            icon={<FaHandPaper />}
            title="Palmistry"
            description="AI-powered palm reading analysis. Reveal the secrets etched in the lines of your hands."
            color="pink"
          />
          <ServiceCard
            to="/vastu"
            icon={<FaCompass />}
            title="Vastu Shastra"
            description="Optimize your living and work spaces according to ancient architectural principles for positive energy."
            color="green"
          />
          <ServiceCard
            to="/numerology"
            icon={<FaSortNumericUp />}
            title="Numerology"
            description="Discover the power of numbers. Reveal hidden patterns in your name and birth date."
            color="blue"
          />
          <ServiceCard
            to="/horoscope"
            icon={<FaMoon />}
            title="Daily Horoscope"
            description="Stay aligned with cosmic rhythms. Accurate daily, weekly, and monthly forecasts for all zodiac signs."
            color="yellow"
          />
          <Link
            to="/book-reading"
            className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 flex flex-col justify-center items-center text-center hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
              Book a Live Session
            </h3>
            <p className="text-indigo-200 mb-6 text-sm relative z-10">
              Speak directly with our expert Vedic consultants.
            </p>
            <span className="px-8 py-3 bg-white text-indigo-900 font-bold rounded-full text-sm group-hover:scale-105 transition-transform shadow-lg relative z-10">
              Book Now
            </span>
          </Link>
        </div>
      </SectionWrapper>

      {/* Why Choose Us */}
      <section className="py-20 bg-black/20 border-y border-white/5 relative overflow-hidden">
        <SectionWrapper>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem
              icon={<FaCheckCircle />}
              title="Vedic Accuracy"
              text="Our algorithms are based on authentic Vedic scriptures and calculations, ensuring precise and reliable insights."
            />
            <FeatureItem
              icon={<FaLock />}
              title="100% Private"
              text="Your birth details and personal questions are kept strictly confidential. We prioritize your privacy above all."
            />
            <FeatureItem
              icon={<FaUserCheck />}
              title="Expert Verification"
              text="Our interpretations are curated and verified by experienced astrologers and numerologists."
            />
          </div>
        </SectionWrapper>
      </section>

      {/* Testimonials */}
      <SectionWrapper>
        <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
          Trusted by <span className="text-yellow-400">Thousands</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            name="Sarah Jenkins"
            role="Marketing Director"
            quote="The career report gave me the clarity I needed to make a big switch. The timing was predicted perfectly!"
          />
          <TestimonialCard
            name="Rahul Sharma"
            role="Software Engineer"
            quote="I was skeptical about Vastu, but the simple changes suggested for my home office really improved my focus."
          />
          <TestimonialCard
            name="Emily Blunt"
            role="Artist"
            quote="The ease of use and the depth of the Palmistry analysis blew me away. It felt like a real human reading."
          />
        </div>
      </SectionWrapper>

      {/* Footer CTA */}
      <section className="py-24 text-center relative px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
          Ready to find your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Path?
          </span>
        </h2>
        <Link
          to="/astrology"
          className="inline-block px-10 py-5 bg-white text-indigo-900 font-bold text-xl rounded-full hover:scale-105 transition-transform shadow-xl shadow-indigo-500/20"
        >
          Start Free Exploration
        </Link>
      </section>

      <ErrorBoundary fallback={<div></div>}>
        <Chatbot />
      </ErrorBoundary>
    </div>
  )
}

export default HomePage
