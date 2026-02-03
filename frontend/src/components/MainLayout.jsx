import React from "react"
import Navbar from "./partials/haeder/Navbar"
import Footer from "./partials/Footer"
// import ScrollToTop from './ScrollToTop';

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#0f0c29] text-white font-sans overflow-x-hidden">
      {/* Rich Deep Space Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"></div>

      {/* Background Blob Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gold-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <Navbar />
      {/* <ScrollToTop /> */}

      <main className="w-full flex-grow relative z-10 pt-24 pb-12 px-4 container mx-auto">
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout
