import React, { useState } from "react";
import {Link} from 'react-router-dom';

const Astrology = () => {
    return (
            <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center">
                {/* Hero Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md animate-fade-in-down">
                    Chart Your Cosmic Journey
                </h1>

                {/* Description */}
                <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto animate-fade-in delay-200">
                    At <span className="font-semibold text-yellow-300">The Astro Pulse</span>, we interpret your unique birth chart to illuminate your strengths, challenges, and life path, guiding you through the celestial influences shaping your destiny.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in delay-500">
                    <Link
                    to="/astrology/astrologyreport"
                    className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                    Get Your Astrology Report
                    </Link>
                    <Link
                    to="/astrology/astrologyinfo"
                    className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-indigo-900 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                    Know about the Astrology
                    </Link>
                </div>
            </div>

    );
};

export default Astrology;
