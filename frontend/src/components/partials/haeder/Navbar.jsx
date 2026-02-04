import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaBars, FaTimes } from "react-icons/fa"
import { Sparkles } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  // Active link check
  const isActive = (path) =>
    location.pathname === path ? "text-gold" : "text-white hover:text-gold"

  return (
    <nav className="flex w-full bg-cosmic-dark/80 backdrop-blur-md border-b border-white/5 px-6 py-4 fixed top-0 left-0 z-50 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-heading font-bold tracking-wide flex items-center gap-2"
          onClick={closeMenu}
        >
          <span className="text-gradient-gold">The Astro Pulse</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm font-medium font-body uppercase tracking-wider">
          {[
            "/",
            "/astrology",
            "/vastu",
            "/palmreading",
            "/numerology",
            "/horoscope",
          ].map((path) => {
            const label =
              path === "/"
                ? "Home"
                : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`${isActive(path)} transition-colors duration-300 relative group`}
                >
                  {path === "/palmreading" ? "Palmistry" : label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="text-gold focus:outline-none text-2xl"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-cosmic-dark/95 z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}
        >
          {[
            "/",
            "/astrology",
            "/vastu",
            "/palmreading",
            "/numerology",
            "/horoscope",
          ].map((path) => {
            const label =
              path === "/"
                ? "Home"
                : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)
            return (
              <Link
                key={path}
                to={path}
                onClick={closeMenu}
                className="text-2xl font-heading font-bold text-white hover:text-gold transition-colors"
              >
                {path === "/palmreading" ? "Palmistry" : label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
