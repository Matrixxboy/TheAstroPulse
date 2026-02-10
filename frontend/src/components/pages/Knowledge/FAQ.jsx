import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, HelpCircle } from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "What is Vedic Astrology?",
    answer:
      "Vedic Astrology, or Jyotish, is an ancient Indian system based on the sidereal zodiac. Unlike Western astrology, it accounts for the precession of equinoxes and offers precise predictive tools like Dashas and Divisional Charts.",
  },
  {
    id: 2,
    question: "How accurate are the AI predictions?",
    answer:
      "Our AI engine is trained on thousands of authentic Vedic scriptures and millions of horoscopes. It calculates planetary positions with high precision, but remember that astrology guides you; your karma shapes your destiny.",
  },
  {
    id: 3,
    question: "Is my personal data safe?",
    answer:
      "Yes, absolutely. We use industry-standard encryption to protect your birth details. We do not share your personal information with any third parties.",
  },
  {
    id: 4,
    question: "Can I get a consultation with a human astrologer?",
    answer:
      "Yes, we offer premium consultations with experienced Vedic astrologers. You can book a session through our Services page.",
  },
]

const FAQ = () => {
  const [activeId, setActiveId] = useState(null)

  const toggle = (id) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Frequently Asked{" "}
            <span className="text-gradient-gold">Questions</span>
          </h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`bg-white/5 border ${
                activeId === faq.id
                  ? "border-gold/30 bg-white/10"
                  : "border-white/10"
              } rounded-2xl overflow-hidden transition-all duration-300`}
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-white">
                  {faq.question}
                </span>
                <span
                  className={`p-2 rounded-full ${activeId === faq.id ? "bg-gold text-cosmic-dark" : "bg-white/10 text-white"}`}
                >
                  {activeId === faq.id ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {activeId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-smoke leading-relaxed border-t border-white/5">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ
