import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons for hamburger and close


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Function to close the menu after clicking a link (important for mobile UX)
    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="flex w-full glass-white text-white px-6 py-4 fixed top-0 left-0 z-50">
            <div className="container mx-auto flex items-center justify-between relative">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-wide flex-shrink-0" onClick={closeMenu}>
                    The Astro Pulse
                </Link>

                {/* Desktop Menu */}
                {/* Removed redundant m-0 as gap handles spacing */}
                <ul className="hidden md:flex gap-6 text-lg font-medium">
                        <Link
                            to="/"
                            className="hover:text-yellow-300 transition-colors duration-200"
                            >
                            <li>
                            Home
                    </li>
                        </Link>
                    <li>
                        <Link
                            to="/numerology"
                            className="hover:text-yellow-300 transition-colors duration-200"
                        >
                            Numerology
                        </Link>
                    </li>
                    <li>
                        {/* Renamed link text for clarity, consider if /palm and /palmreading are different */}
                        <Link
                            to="/astrology"
                            className="hover:text-yellow-300 transition-colors duration-200"
                        >
                            Astrology
                        </Link>
                    </li>
                    <li>
                        {/* Renamed link text for clarity, consider if /palm and /palmreading are different */}
                        <Link
                            to="/palmreading"
                            className="hover:text-yellow-300 transition-colors duration-200"
                        >
                            Palmistry
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/horoscope"
                            className="hover:text-yellow-300 transition-colors duration-200"
                        >
                            Horoscope
                        </Link>
                    </li>
                </ul>

                {/* Hamburger/Close Icon for Mobile */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none text-2xl"
                        aria-label={isOpen ? "Close menu" : "Open menu"} // Added for accessibility
                        aria-expanded={isOpen} // Added for accessibility
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                {/* Mobile Menu (conditionally rendered with transition classes) */}
                {/* Added 'top-[calc(100%+1rem)]' for a small gap below the navbar */}
                {/* Using a basic fade/slide transition with max-h and opacity for smooth animation */}
                <ul
                    className={`
                        phone-menu flex flex-col absolute right-0 w-3/5 text-white md:hidden z-40 rounded-xl shadow-lg p-6 space-y-3
                        transition-all duration-300 ease-in-out transform items-center text-center
                        ${isOpen ? 'top-[calc(100%+1rem)] bg-purple-900/95  opacity-100 max-h-screen' : 'top-full opacity-0 max-h-0 overflow-hidden'}
                    `}
                    // Optional: You might want to use a state-driven approach for mount/unmount if using complex CSS transitions that rely on element being in DOM
                    // For now, simple opacity/max-height for fade/slide effect
                >
                    <Link
                        to="/"
                        className="w-full h-10 flex text-center items-center justify-center"
                        onClick={closeMenu}
                        >
                            <li className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-indigo-900 font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 w-full h-8 text-center">
                            Home
                            </li>
                    </Link>
                    <Link
                        to="/numerology"
                        className="w-full h-10 flex text-center items-center justify-center"
                        onClick={closeMenu}
                        >
                            <li className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-indigo-900 font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 w-full h-8 text-center">
                                Numerology
                            </li>
                    </Link>
                    <Link
                        to="/astrology"
                        className="w-full h-10 flex text-center items-center justify-center"
                        onClick={closeMenu}
                        >
                            <li className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-indigo-900 font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 w-full h-8 text-center">
                                Astrology
                            </li>
                    </Link>
                    <Link
                        to="/palmreading"
                        className="w-full h-10 flex text-center items-center justify-center"
                        onClick={closeMenu}
                        >
                            <li className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-indigo-900 font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 w-full h-8 text-center">
                                Palmistry
                            </li>
                    </Link>
                    
                    <Link
                        to="/horoscope"
                        className="w-full h-10 flex text-center items-center justify-center"
                        onClick={closeMenu}
                        >
                            <li className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-indigo-900 font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 w-full h-8 text-center">
                            Horoscope
                            </li>
                    </Link>
                </ul>

            </div>
        </nav>
    );
};

export default Navbar;