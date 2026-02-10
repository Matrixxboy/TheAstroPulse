import React from "react"
import { Link } from "react-router-dom"
import { Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-cosmic-dark text-ash font-body border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-heading font-bold text-gradient-gold">
              The Astro Pulse
            </h2>
            <p className="text-smoke text-sm leading-relaxed max-w-md">
              A modern Sanātani platform blending authentic Vedic sciences with
              intelligent systems — focused on clarity, karma, and conscious
              living.
            </p>

            <div className="pt-4 text-xs tracking-widest uppercase text-gold/60">
              ॐ तत् सत्
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/kundali" className="hover:text-gold">
                  Kundali / Birth Chart
                </Link>
              </li>
              <li>
                <Link to="/horoscope" className="hover:text-gold">
                  Daily Horoscope
                </Link>
              </li>
              <li>
                <Link to="/panchang" className="hover:text-gold">
                  Panchang
                </Link>
              </li>
              <li>
                <Link to="/muhurat" className="hover:text-gold">
                  Muhurat
                </Link>
              </li>
              <li>
                <Link to="/live-darshan" className="hover:text-gold">
                  Live Darshan
                </Link>
              </li>
            </ul>
          </div>

          {/* Knowledge */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Knowledge
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/vedic-astrology" className="hover:text-gold">
                  Vedic Astrology
                </Link>
              </li>
              <li>
                <Link to="/numerology" className="hover:text-gold">
                  Numerology
                </Link>
              </li>
              <li>
                <Link to="/vastu" className="hover:text-gold">
                  Vastu Shastra
                </Link>
              </li>
              <li>
                <Link to="/remedies" className="hover:text-gold">
                  Remedies
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gold">
                  Articles & Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="hover:text-gold">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-gold">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-gold">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-white/5" />

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-sm">
          {/* Contact */}
          <div className="space-y-2 text-smoke">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold" />
              contact@astropulse.ai
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold" />
              +91 98765 43210
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              Gujarat, India
            </div>
          </div>

          {/* Legal */}
          <div className="md:text-center text-xs text-smoke/70 space-x-4">
            <Link to="/privacy-policy" className="hover:text-gold">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-gold">
              Terms
            </Link>
            <span>•</span>
            <Link to="/disclaimer" className="hover:text-gold">
              Disclaimer
            </Link>
          </div>

          {/* Copyright */}
          <div className="md:text-right text-xs text-smoke/60">
            © {new Date().getFullYear()} The World Of Matrix
            <div className="mt-1 uppercase tracking-widest text-[10px]">
              Sanātana Dharma Inspired
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
