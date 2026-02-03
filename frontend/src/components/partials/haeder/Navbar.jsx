import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaBars, FaTimes } from "react-icons/fa"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Astrology", path: "/astrology" },
    { name: "Vastu", path: "/vastu" },
    { name: "Palmistry", path: "/palmreading" },
    { name: "Numerology", path: "/numerology" },
    { name: "Horoscope", path: "/horoscope" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0f0c29]/80 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 hover:from-amber-400 hover:to-yellow-300 transition-all duration-300"
          onClick={closeMenu}
        >
          The Astro Pulse
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isActive(link.path)
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                    isActive(link.path) ? "w-full" : "w-0 hover:w-full"
                  }`}
                ></span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/book-reading"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Get Reading
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none text-2xl p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`
                        fixed top-[70px] left-0 w-full bg-[#1a0b2e]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl md:hidden overflow-hidden transition-all duration-300 ease-in-out
                        ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
                    `}
        >
          <ul className="flex flex-col p-6 space-y-4 text-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`block py-3 text-lg font-medium transition-all ${
                    isActive(link.path)
                      ? "text-yellow-400 bg-white/5 rounded-lg"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
