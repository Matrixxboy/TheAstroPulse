import React from 'react';
import Navbar from './partials/haeder/Navbar';
// import ScrollToTop from './ScrollToTop';
// import Footer from './partials/Footer'; // Optional: add footer if needed

const MainLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white overflow-x-hidden font-sans">
            {/* Navbar */}
            <Navbar />
            {/* <ScrollToTop /> */}
            <main className="pt-24 px-4 sm:px-8 md:px-16 lg:px-24">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
