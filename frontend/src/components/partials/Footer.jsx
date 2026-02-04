import React from "react"
import { Link } from "react-router-dom"
import { Sparkles, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-cosmic-dark border-t border-gold/20 pt-16 pb-8 text-ash font-body relative overflow-hidden">
      {/* Background Mandala Effect (Subtle) */}
      <div className="absolute -top-24 -right-24 w-64 h-64 border border-gold/5 rounded-full opacity-20 pointer-events-none animate-spin-slow"></div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              to="/"
              className="text-2xl font-heading font-bold text-gradient-gold flex items-center gap-2"
            >
              <Sparkles className="w-6 h-6 text-saffron" /> The Astro Pulse
            </Link>
            <p className="text-smoke text-sm leading-relaxed">
              Illuminating your life path through the fusion of Vedic wisdom and
              Artificial Intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-bold text-white mb-6">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/horoscope"
                  className="hover:text-gold transition-colors"
                >
                  Daily Horoscope
                </Link>
              </li>
              <li>
                <Link
                  to="/palmreading"
                  className="hover:text-gold transition-colors"
                >
                  AI Palmistry
                </Link>
              </li>
              <li>
                <Link
                  to="/numerology"
                  className="hover:text-gold transition-colors"
                >
                  Numerology
                </Link>
              </li>
              <li>
                <Link to="/vastu" className="hover:text-gold transition-colors">
                  Vastu Shastra
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-heading font-bold text-white mb-6">
              Wisdom
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/astrology/astroinfo"
                  className="hover:text-gold transition-colors"
                >
                  Vedic Knowledge
                </Link>
              </li>
              <li>
                <Link
                  to="/vastu/know-about-vastu"
                  className="hover:text-gold transition-colors"
                >
                  Vastu Principles
                </Link>
              </li>
              <li>
                <Link to="/pdf" className="hover:text-gold transition-colors">
                  Generate Reports
                </Link>
              </li>
              <li>
                <Link to="/test" className="hover:text-gold transition-colors">
                  Compatibility Test
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-heading font-bold text-white mb-6">
              Connect
            </h4>
            <ul className="space-y-3 text-sm text-smoke">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-saffron" /> contact@astropulse.ai
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-saffron" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-saffron" /> Gujarat, India
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 text-center text-xs text-smoke/60">
          <p>
            &copy; {new Date().getFullYear()} The Astro Pulse. All Cosmic Rights
            Reserved.
          </p>
          <p className="mt-2 text-[10px] tracking-widest uppercase opacity-50">
            Om Tat Sat
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
