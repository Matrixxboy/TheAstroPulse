import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  FaBars,
  FaTimes,
  FaSun,
  FaStar,
  FaHandSparkles,
  FaCalculator,
  FaCompass,
  FaLeaf,
  FaBookOpen,
  FaOm,
  FaQuestionCircle,
} from "react-icons/fa"
import {
  ChevronDown,
  Sparkles,
  Zap,
  Globe,
  Calendar,
  Clock,
} from "lucide-react"

const navGroups = {
  astrology: {
    label: "Astrology",
    icon: FaStar,
    items: [
      {
        label: "Kundali / Birth Chart",
        path: "/kundali",
        icon: Globe,
        desc: "Generate your detailed birth chart",
      },
      {
        label: "Daily Horoscope",
        path: "/horoscope",
        icon: Sparkles,
        desc: "Your daily cosmic forecast",
      },
      {
        label: "Panchang",
        path: "/panchang",
        icon: Calendar,
        desc: "Daily Hindu calendar & timing",
      },
      {
        label: "Muhurat",
        path: "/muhurat",
        icon: Clock,
        desc: "Find auspicious timings",
      },
    ],
  },
  services: {
    label: "Services",
    icon: FaHandSparkles,
    items: [
      {
        label: "AI Palmistry",
        path: "/palmreading",
        icon: FaHandSparkles,
        desc: "AI-powered hand analysis",
      },
      {
        label: "Numerology",
        path: "/numerology",
        icon: FaCalculator,
        desc: "Discover your life path number",
      },
      {
        label: "Vastu Shastra",
        path: "/vastu",
        icon: FaCompass,
        desc: "Harmonize your living space",
      },
      {
        label: "Remedies",
        path: "/remedies",
        icon: FaLeaf,
        desc: "Vedic solutions for problems",
      },
    ],
  },
  knowledge: {
    label: "Knowledge",
    icon: FaBookOpen,
    items: [
      {
        label: "Vedic Astrology",
        path: "/vedic-astrology",
        icon: FaOm,
        desc: "Learn the basics of Vedas",
      },
      {
        label: "Festivals",
        path: "/festivals",
        icon: Zap,
        desc: "Upcoming Hindu festivals",
      },
      {
        label: "Articles & Insights",
        path: "/blog",
        icon: FaBookOpen,
        desc: "Deep dive into cosmic wisdom",
      },
      {
        label: "FAQs",
        path: "/faqs",
        icon: FaQuestionCircle,
        desc: "Frequently asked questions",
      },
    ],
  },
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path) =>
    location.pathname === path ? "text-gold" : "text-white/80 hover:text-gold"

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cosmic-dark/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-900/10"
          : "bg-transparent backdrop-blur-sm border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-heading font-bold flex items-center gap-2 group"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <FaSun className="text-gold w-8 h-8 group-hover:text-saffron transition-colors" />
          </motion.div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-saffron to-gold bg-300% animate-gradient">
            The Astro Pulse
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium font-body uppercase tracking-wide text-sm">
          <Link
            to="/"
            className={`${isActive("/")} transition-colors relative group`}
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Dropdowns */}
          {Object.entries(navGroups).map(([key, group]) => (
            <div
              key={key}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(key)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1.5 transition-colors group-hover:text-gold py-2 ${
                  activeDropdown === key ? "text-gold" : "text-white/80"
                }`}
              >
                {group.label}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeDropdown === key ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {activeDropdown === key && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-2 rounded-2xl bg-[#0b0b0b]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-900/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-500/5 pointer-events-none" />
                    <div className="relative flex flex-col gap-1">
                      {group.items.map((item, idx) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5"
                        >
                          <div className="p-2 rounded-full bg-white/5 text-gold group-hover/item:bg-gold/20 group-hover/item:scale-110 transition-all duration-300">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-sm font-semibold text-white group-hover/item:text-gold transition-colors">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-white/50 group-hover/item:text-white/70">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <Link
            to="/live-darshan"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full border border-red-500/30 text-red-200 hover:text-white hover:border-red-500/60 transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live Darshan
          </Link>

          <Link
            to="/contact"
            className="relative px-5 py-2 overflow-hidden bg-transparent border border-gold/30 rounded-full text-gold font-semibold hover:text-cosmic-dark transition-all duration-300 group"
          >
            <span className="absolute inset-0 w-full h-full bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            <span className="relative z-10">Contact</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gold text-2xl p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-cosmic-dark/95 backdrop-blur-xl z-40 md:hidden flex flex-col pt-24 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-heading font-bold text-white hover:text-gold transition-colors"
              >
                Home
              </Link>

              {Object.entries(navGroups).map(([key, group]) => (
                <div key={key} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-gold font-body uppercase tracking-widest text-xs border-b border-white/10 pb-2">
                    <group.icon className="w-3 h-3" />
                    {group.label}
                  </div>
                  <div className="grid gap-4 pl-4 border-l border-white/10 ml-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 text-white/80 hover:text-gold group"
                      >
                        <item.icon className="w-4 h-4 text-white/40 group-hover:text-gold transition-colors" />
                        <span className="text-lg">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <Link
                to="/live-darshan"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 text-red-300 font-bold bg-red-900/20 p-4 rounded-xl border border-red-500/20"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
                Live Darshan
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 text-center font-bold text-cosmic-dark bg-gold rounded-xl hover:bg-saffron transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
