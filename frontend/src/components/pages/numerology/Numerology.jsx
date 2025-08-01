import React, { useState } from "react";
import {Link} from 'react-router-dom';

const Numerology = () => {
    return (
            <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center">
                {/* Hero Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md animate-fade-in-down">
                    Discover Your Numerology Blueprint
                </h1>

                {/* Description */}
                <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto animate-fade-in delay-200">
                    At <span className="font-semibold text-yellow-300">The Astro Pulse</span>, we decode the energetic essence of your name and business to help you align with success, clarity, and cosmic flow.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in delay-500">
                    <Link
                    to="/numerology/business-numerology-report"
                    className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                    Get Business Name Report
                    </Link>
                    <Link
                    to="/numerology/name-numerology-report"
                    className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-indigo-900 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                    Get Personal Name Report
                    </Link>
                </div>
            </div>

    );
};

export default Numerology;
