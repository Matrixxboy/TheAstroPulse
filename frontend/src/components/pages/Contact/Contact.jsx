import React, { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log(formState)
    alert("Message sent successfully!")
    setFormState({ name: "", email: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-transparent bg-cosmic-dark pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 blur-3xl rounded-full -ml-20 -mb-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20 mb-6">
            <Mail className="w-4 h-4" />
            <span className="text-sm font-semibold">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Let's Start a <br />
            <span className="text-gradient-gold">Conversation</span>
          </h1>
          <p className="text-smoke text-lg mb-12 max-w-md">
            Have questions about our services or need support? We're here to
            help you navigate your cosmic journey.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/5 rounded-xl text-gold group-hover:bg-gold group-hover:text-cosmic-dark transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Email Us</h3>
                <p className="text-smoke">support@theastropulse.com</p>
                <p className="text-smoke">consult@theastropulse.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/5 rounded-xl text-gold group-hover:bg-gold group-hover:text-cosmic-dark transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Call Us</h3>
                <p className="text-smoke">+91 98765 43210</p>
                <p className="text-smoke">Mon - Fri, 9am - 6pm IST</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/5 rounded-xl text-gold group-hover:bg-gold group-hover:text-cosmic-dark transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Visit Us</h3>
                <p className="text-smoke">123 Cosmic Lane, Spiritual Hub,</p>
                <p className="text-smoke">Varanasi, India - 221001</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-smoke mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-smoke mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-smoke mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                rows={4}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
                placeholder="How can we help you?"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-gold to-saffron text-cosmic-dark font-bold rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center justify-center gap-2"
            >
              Send Message <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact
