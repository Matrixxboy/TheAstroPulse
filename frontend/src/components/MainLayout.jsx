import React from 'react';
import Navbar from './partials/haeder/Navbar';
// import ScrollToTop from './ScrollToTop';
// import Footer from './partials/Footer'; // Optional: add footer if needed

const MainLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white overflow-hidden">
            {/* Background Blob Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Navbar */}
            <Navbar />
            {/* <ScrollToTop /> */}
            <main className="w-full pt-24 px-4 sm:px-8 md:px-16 lg:px-24">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
