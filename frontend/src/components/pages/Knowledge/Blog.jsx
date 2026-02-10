import React from "react"
import { motion } from "framer-motion"
import { BookOpen, User, Calendar, ArrowRight } from "lucide-react"

const articles = [
  {
    id: 1,
    title: "Understanding Retrograde Mercury",
    excerpt:
      "Why communication failures happen and how to navigate this tricky period.",
    author: "Pandit Sharma",
    date: "June 10, 2026",
    image:
      "https://images.unsplash.com/photo-1614730341194-75c60740a08f?w=500&auto=format&fit=crop&q=60",
    category: "Planetary Transits",
  },
  {
    id: 2,
    title: "The Power of Gemstones",
    excerpt:
      "How to choose the right gemstone based on your birth chart for maximum benefit.",
    author: "Dr. Rao",
    date: "June 08, 2026",
    image:
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=60",
    category: "Gemology",
  },
  {
    id: 3,
    title: "Vastu Tips for Home Office",
    excerpt:
      "Boost productivity and career growth by aligning your workspace correctly.",
    author: "Vastu Expert Anil",
    date: "June 05, 2026",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&auto=format&fit=crop&q=60",
    category: "Vastu Shastra",
  },
]

const Blog = () => {
  return (
    <div className="min-h-screen bg-transparent bg-cosmic-dark pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Cosmic <span className="text-gradient-gold">Insights</span>
          </h1>
          <p className="text-smoke max-w-2xl mx-auto text-lg">
            Explore articles on Astrology, Vastu, Numerology, and ancient Vedic
            wisdom.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all hover:-translate-y-2 group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-maroon/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {article.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-smoke mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {article.date}
                  </span>
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3 leading-tight group-hover:text-gold transition-colors">
                  {article.title}
                </h3>
                <p className="text-smoke text-sm mb-6 line-clamp-3">
                  {article.excerpt}
                </p>
                <button className="text-gold font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog
