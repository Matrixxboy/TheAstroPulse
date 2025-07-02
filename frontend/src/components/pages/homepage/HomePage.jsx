import React from 'react';
import Chatbot from '../chatbot/Chatbot';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from "react-error-boundary";

const HomePage = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center py-16 px-4">
            {/* Main Content */}
            <div className="container mx-auto flex flex-col items-center text-center max-w-4xl z-10">
                {/* Hero Section */}
                <div className="space-y-6 py-12 md:py-24">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg animate-fade-in-down">
                        Unveil Your Cosmic Blueprint
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto animate-fade-in delay-200">
                        At <span className="font-semibold text-yellow-300">The Astro Pulse</span>, we guide you through the stars to discover your true potential and destiny.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 animate-fade-in delay-500">
                        <Link
                            to="/palmreading"
                            className="bg-yellow-500 hover:bg-yellow-600 text-indigo-900 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Explore Palm Reading
                        </Link>
                        <Link
                            to="/horoscope"
                            className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-indigo-900 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Get Your Daily Horoscope
                        </Link>
                    </div>
                </div>

                {/* Offerings Section */}
                <div className="mt-20 pt-10 border-t border-purple-700/50 w-full max-w-3xl text-center">
                    <h2 className="text-3xl font-bold mb-4 text-purple-300">Our Offerings</h2>
                    <p className="text-md text-gray-300 leading-relaxed max-w-xl mx-auto">
                        Dive deep into the ancient arts of palmistry and astrology. Whether you're seeking clarity on your life path, career, relationships, or daily guidance, our expert readers are here to illuminate your journey.
                    </p>
                </div>
            </div>
            <ErrorBoundary>
            <Chatbot />
            </ErrorBoundary>
        </div>
    );
};

export default HomePage;
