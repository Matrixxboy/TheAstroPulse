import React from "react"
import Navbar from "./partials/haeder/Navbar"
import Footer from "./partials/Footer"

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-cosmic-dark text-ash font-body flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20 w-full">{children}</main>

      <Footer />
    </div>
  )
}

export default MainLayout
