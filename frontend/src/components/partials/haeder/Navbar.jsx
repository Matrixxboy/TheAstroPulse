import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons for hamburger and close

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
                <ul className="hidden md:flex gap-6 text-lg font-medium">
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
                </ul>

                {/* Hamburger/Close Icon for Mobile */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="text-white focus:outline-none text-2xl">
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu (conditionally rendered) */}
                {isOpen && (
                    <ul className="absolute top-full left-0 w-full bg-slate-800 text-white flex flex-col items-center py-4 md:hidden shadow-lg rounded-b-lg">
                        <li>
                            <Link
                                to="/"
                                className="block py-2 px-4 hover:bg-slate-700 w-full text-center"
                                onClick={toggleMenu} // Close menu on link click
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/palmreading"
                                className="block py-2 px-4 hover:bg-slate-700 w-full text-center"
                                onClick={toggleMenu} // Close menu on link click
                            >
                                Palm Reading
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/palm"
                                className="block py-2 px-4 hover:bg-slate-700 w-full text-center"
                                onClick={toggleMenu} // Close menu on link click
                            >
                                Hand Palm Info
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/horoscope"
                                className="block py-2 px-4 hover:bg-slate-700 w-full text-center"
                                onClick={toggleMenu} // Close menu on link click
                            >
                                Horoscope
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;