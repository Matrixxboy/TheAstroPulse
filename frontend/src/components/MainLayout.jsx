import React from "react"
import Navbar from "./partials/haeder/Navbar"
import Footer from "./partials/Footer"

import AdBanner from "./partials/AdBanner"

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-cosmic-dark text-ash font-body flex flex-col overflow-hidden">
      {/* Background Stars for every page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-20 w-full relative">
          {children}
          <AdBanner />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
