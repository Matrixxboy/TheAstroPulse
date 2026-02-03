import React from "react"
import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 border-t border-purple-900/50 text-gray-300 py-12 mt-auto relative z-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            The Astro Pulse
          </h3>
          <p className="text-sm leading-relaxed mb-4">
            Unlocking the mysteries of the universe to guide your life's
            journey. Expert astrology, palmistry, and vastu services.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Services Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Our Services
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/astrology"
                className="hover:text-yellow-400 transition-colors"
              >
                Astrology
              </Link>
            </li>
            <li>
              <Link
                to="/vastu"
                className="hover:text-yellow-400 transition-colors"
              >
                Vastu Shastra
              </Link>
            </li>
            <li>
              <Link
                to="/palmreading"
                className="hover:text-yellow-400 transition-colors"
              >
                Palmistry
              </Link>
            </li>
            <li>
              <Link
                to="/numerology"
                className="hover:text-yellow-400 transition-colors"
              >
                Numerology
              </Link>
            </li>
            <li>
              <Link
                to="/horoscope"
                className="hover:text-yellow-400 transition-colors"
              >
                Daily Horoscope
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-yellow-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-yellow-400 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-yellow-400 transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-yellow-400 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
          <p className="text-sm mb-4">
            Subscribe to receive daily cosmic updates.
          </p>
          <div className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-gray-800 border border-purple-800 text-white px-4 py-2 rounded focus:outline-none focus:border-yellow-400 text-sm"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-indigo-900 font-bold py-2 px-4 rounded transition-colors text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="text-center mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center px-6 container mx-auto text-xs text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} The Astro Pulse. All rights
          reserved.
        </p>
        <p>Designed for the Stars.</p>
      </div>
    </footer>
  )
}

export default Footer
