import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons for hamburger and close
import './Navbar.css'; // Importing custom styles for the Navbar

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="flex w-full glass-white text-white px-6 py-4 fixed top-0 left-0 z-50">
            <div className="container mx-auto flex items-center justify-between relative">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-wide flex-shrink-0">
                    The Astro Pulse
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-6 m-0 text-lg font-medium">
                    <li>
                        <Link
                            to="/"
                            className="hover:text-yellow-300 transition-colors duration-200"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/palmreading"
                            className="hover:text-yellow-300 transition-colors duration-200"
                        >
                            Palm Reading
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/palm"
                            className="hover:text-yellow-300 transition-colors duration-200"
                        >
                            HandPalm-Info
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
                    <li>
                        <Link
                            to="/numerology"
                            className="hover:text-yellow-300 transition-colors duration-200"
                        >
                            Numerology
                        </Link>
                    </li>
                </ul>

                {/* Hamburger/Close Icon for Mobile */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="text-white focus:outline-none text-2xl">
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu (conditionally rendered) */}
                {isOpen && (
                    <ul className=" phone-menu flex flex-col absolute top-full left-0 w-full bg-yellow-400 text-white md:hidden z-50 rounded-xl shadow-lg p-6">
                        <li>
                            <Link
                                to="/"
                                className="block py-2 px-4 hover:text-color-primary w-full text-center"
                                onClick={toggleMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/palmreading"
                                className="block py-2 px-4 hover:bg-white/20 w-full text-center"
                                onClick={toggleMenu}
                            >
                                Palm Reading
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/palm"
                                className="block py-2 px-4 hover:bg-white/20 w-full text-center"
                                onClick={toggleMenu}
                            >
                                Hand Palm Info
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/horoscope"
                                className="block py-2 px-4 hover:bg-white/20 w-full text-center"
                                onClick={toggleMenu}
                            >
                                Horoscope
                            </Link>
                        </li>
                        <li>
                        <Link
                            to="/numerology"
                            className="hover:text-yellow-300 transition-colors duration-200"
                        >
                            Numerology
                        </Link>
                    </li>
                    </ul>

                )}
            </div>
        </nav>
    );
};

export default Navbar;