import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

const wisdoms = [
  {
    sanskrit:
      "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
    transliteration:
      "Om Bhur Bhuva Swaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyoyo Nah Prachodayat",
    meaning:
      "We meditate on the glory of that being who has produced this universe; may He enlighten our minds.",
    source: "Gayatri Mantra",
  },
  {
    sanskrit:
      "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration:
      "Karmanye Vadhikaraste Ma Phaleshu Kadachana, Ma Karma Phala Hetur Bhur Ma Te Sango Stv Akarmani",
    meaning:
      "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.",
    source: "Bhagavad Gita 2.47",
  },
  {
    sanskrit:
      "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
    transliteration:
      "Vakratunda Mahakaya Surya Koti Samaprabha, Nirvighnam Kuru Me Deva Sarva Karyeshu Sarvada",
    meaning:
      "O Lord Ganesha, of huge body with elephant head, shining like billions of suns, please remove all obstacles in my work.",
    source: "Ganesha Chinmayam",
  },
  {
    sanskrit:
      "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    transliteration:
      "Yada Yada Hi Dharmasya Glanir Bhavati Bharata, Abhyutthanam Adharmasya Tadatmanam Srijamyaham",
    meaning:
      "Whenever there is a decline in righteousness and an uprise of unrighteousness, at that time, I manifest myself.",
    source: "Bhagavad Gita 4.7",
  },
  {
    sanskrit: "ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥",
    transliteration:
      "Om Asato Ma Sadgamaya, Tamaso Ma Jyotirgamaya, Mrityorma Amritam Gamaya",
    meaning:
      "Lead me from the unreal to the real, lead me from darkness to light, lead me from death to immortality.",
    source: "Brihadaranyaka Upanishad",
  },
]

const DailyWisdom = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wisdoms.length)
    }, 10000) // Change every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const currentWisdom = wisdoms[currentIndex]

  return (
    <div className="bg-cosmic-dark/80 border-y border-gold/20 backdrop-blur-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-saffron" />
            <h4 className="text-gold font-bold text-xs uppercase tracking-widest font-heading">
              Timeless Wisdom
            </h4>
            <Sparkles className="w-4 h-4 text-saffron" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <p className="text-saffron font-sanskrit text-lg md:text-xl font-medium mb-1">
                {currentWisdom.sanskrit}
              </p>
              <p className="text-white/60 text-xs md:text-sm font-body italic mb-1">
                "{currentWisdom.meaning}"
              </p>
              <p className="text-gold/40 text-[10px] uppercase tracking-wide">
                — {currentWisdom.source}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default DailyWisdom
