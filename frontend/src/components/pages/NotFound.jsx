import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, Rocket } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-transparent bg-cosmic-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="text-[12rem] md:text-[16rem] font-bold text-white/5 font-heading leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="w-32 h-32 text-gold animate-bounce" />
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
          Lost in <span className="text-gradient-gold">Space?</span>
        </h1>
        <p className="text-smoke text-lg mb-8">
          The cosmic coordinates you are looking for do not exist in this
          universe.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-cosmic-dark font-bold rounded-full hover:bg-white transition-all hover:scale-105"
        >
          <Home className="w-5 h-5" /> Return to Earth
        </Link>
      </div>
    </div>
  )
}
