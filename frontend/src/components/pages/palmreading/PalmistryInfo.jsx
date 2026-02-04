import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react"

const TreeItem = ({ label, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="ml-4 md:ml-6 border-l border-white/10 pl-4 py-2 relative">
      {/* Connector line */}
      <div
        className={`absolute top-5 -left-[17px] w-4 h-px ${isOpen ? "bg-gold" : "bg-white/20"}`}
      ></div>

      <div
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`flex items-center gap-2 cursor-pointer select-none group transition-all duration-300 ${isOpen ? "text-gold" : "text-white hover:text-white/80"}`}
      >
        {children ? (
          <span
            className={`transition-transform duration-300 ${isOpen ? "rotate-90 text-gold" : "text-smoke"}`}
          >
            <ChevronRight className="w-4 h-4" />
          </span>
        ) : (
          <span className="w-4" />
        )}

        <span className={`font-medium ${isOpen ? "font-bold" : "font-normal"}`}>
          {label}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 text-smoke text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const PalmistryInfo = () => {
  return (
    <div className="min-h-screen p-4 md:p-12 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold mb-4 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-saffron" /> Palmistry Knowledge
            Base
          </h1>
          <p className="text-smoke">
            Explore the ancient science of Hasthrekha Shastra.
          </p>
        </div>

        <div className="glass p-6 md:p-10 rounded-3xl border border-white/5 bg-cosmic-dark/50 backdrop-blur-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 pl-4 border-l-4 border-saffron">
            Interactive Tree Diagram
          </h2>

          <div className="space-y-2 font-body text-base">
            <TreeItem label="Gender" defaultOpen={true}>
              <TreeItem label="Male">
                Usually, the right hand is considered the active hand (shows
                present/future), and the left is passive (shows inherited
                traits).
              </TreeItem>
              <TreeItem label="Female">
                The left hand is often the active hand (present/future), and the
                right is passive.
              </TreeItem>
            </TreeItem>

            <TreeItem label="Hand Shape">
              <TreeItem label="Earth Hand: Square palm + short fingers">
                Practical, grounded, stable life
              </TreeItem>
              <TreeItem label="Air Hand: Square palm + long fingers">
                Intellectual, restless, communicator
              </TreeItem>
              <TreeItem label="Fire Hand: Rectangular palm + short fingers">
                Ambitious, energetic, passionate
              </TreeItem>
              <TreeItem label="Water Hand: Long palm + long fingers">
                Emotional, sensitive, artistic
              </TreeItem>
            </TreeItem>

            <TreeItem label="Life Line">
              <TreeItem label="Shape">
                <TreeItem label="Long & Deep">Strong vitality</TreeItem>
                <TreeItem label="Short">Efficient energy</TreeItem>
                <TreeItem label="Faint">Weak health</TreeItem>
              </TreeItem>
              <TreeItem label="Curve">
                <TreeItem label="Wide">Adventurous</TreeItem>
                <TreeItem label="Close to Thumb">Cautious</TreeItem>
              </TreeItem>
              <TreeItem label="Length">
                <TreeItem label="< 5.5 cm">Energetically cautious</TreeItem>
                <TreeItem label="5.5–7.5 cm">Good health and vitality</TreeItem>
                <TreeItem label="7.5–9.0 cm">
                  Very energetic and resilient
                </TreeItem>
                <TreeItem label="> 9.0 cm">Exceptional endurance</TreeItem>
              </TreeItem>
            </TreeItem>

            <TreeItem label="Head Line">
              <TreeItem label="Length">
                <TreeItem label="< 6.0 cm">Quick thinker</TreeItem>
                <TreeItem label="6.0–8.0 cm">Balanced mind</TreeItem>
                <TreeItem label="8.0–10.0 cm">Deep thinker</TreeItem>
                <TreeItem label="> 10.0 cm">
                  Analytical genius/overthinker
                </TreeItem>
              </TreeItem>
              <TreeItem label="Shape">
                <TreeItem label="Straight">Logical</TreeItem>
                <TreeItem label="Curved">Creative</TreeItem>
              </TreeItem>
            </TreeItem>

            <TreeItem label="Heart Line">
              <TreeItem label="Shape">
                <TreeItem label="Straight">Polite</TreeItem>
                <TreeItem label="Curved">Passionate</TreeItem>
              </TreeItem>
              <TreeItem label="Length">
                <TreeItem label="< 5.0 cm">Emotionally guarded</TreeItem>
                <TreeItem label="5.0–6.5 cm">Emotionally balanced</TreeItem>
                <TreeItem label="6.5–8.5 cm">Deeply empathetic</TreeItem>
                <TreeItem label="> 8.5 cm">Emotionally idealistic</TreeItem>
              </TreeItem>
            </TreeItem>

            <TreeItem label="Fate Line">
              <TreeItem label="Start Point">
                <TreeItem label="From Life Line">Self-made</TreeItem>
                <TreeItem label="From Moon">Support-based</TreeItem>
                <TreeItem label="From Wrist">Early success</TreeItem>
              </TreeItem>
              <TreeItem label="Length">
                <TreeItem label="< 4.0 cm">Unstable path</TreeItem>
                <TreeItem label="4.0–6.0 cm">Moderate purpose</TreeItem>
                <TreeItem label="6.0–8.5 cm">Strong purpose</TreeItem>
                <TreeItem label="> 8.5 cm">Mission-driven</TreeItem>
              </TreeItem>
            </TreeItem>

            <TreeItem label="Advanced Combinations (Heart + Head + Life Lines)">
              <TreeItem label="Type A: The Struggler">
                Heart &lt; 5.0cm (Reserved) + Head Short (Practical) + Life
                Faint (Low Energy).
                <br />
                <span className="text-gold italic">Likely Situation:</span>{" "}
                Financial struggle due to emotional disconnect and weak health.
                Needs external motivation.
              </TreeItem>
              <TreeItem label="Type B: The Achiever">
                Heart Curved (Loving) + Head Curved (Creative) + Life Deep
                (Vitality).
                <br />
                <span className="text-gold italic">Likely Situation:</span>{" "}
                Artistic or academic success, good relationships, and mental
                strength. Has high earning potential.
              </TreeItem>
              <TreeItem label="Type C: The Burnout">
                Heart Short/Chains (Trauma) + Head Long (Strategist) + Life
                Branching Down (Stress).
                <br />
                <span className="text-gold italic">Likely Situation:</span>{" "}
                Successful but emotionally drained. Wealth may be high but
                satisfaction is low.
              </TreeItem>
              <TreeItem label="Type D: The Balanced">
                Heart Medium (Balanced) + Head Medium (Cognitive Balance) + Life
                Medium (Decent Health).
                <br />
                <span className="text-gold italic">Likely Situation:</span>{" "}
                Stable career, modest income, happy personal life. Good for
                long-term peace.
              </TreeItem>
              <TreeItem label="Type E: The Overwhelmed">
                Heart &gt; 8.5cm (Over-emotional) + Head &gt; 10cm
                (Overanalyzer) + Life Faint (Low Stamina).
                <br />
                <span className="text-gold italic">Likely Situation:</span>{" "}
                Prone to heartbreak, confusion, anxiety. Financially unstable
                unless well-supported.
              </TreeItem>
            </TreeItem>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PalmistryInfo
