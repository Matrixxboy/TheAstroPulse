import React from "react"
import { motion } from "framer-motion"
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Briefcase,
  Telescope,
  Sparkles,
  Code2,
  Brain,
  Rocket,
} from "lucide-react"

const AboutUs = () => {
  const experiences = [
    {
      role: "Junior AI Engineer",
      company: "Biz Insights",
      period: "Present",
      desc: "Delivering modern web applications and interactive user experiences for personal and client-based projects, emphasizing performance, design quality, and scalability.",
      icon: Code2,
    },
    {
      role: "Data Analysis Intern",
      company: "Biz Insights",
      period: "Past",
      desc: "Gained hands-on experience in data analysis, machine learning, and applied AI techniques to extract insights from complex datasets.",
      icon: Brain,
    },
    {
      role: "Junior Quality Assurance Engineer",
      company: "InsideFPV",
      period: "Past",
      desc: "Gained strong hands-on experience in software testing, quality processes, and real-world product validation in a fast-paced development environment.",
      icon: Rocket,
    },
  ]

  return (
    <div className="min-h-screen bg-cosmic-dark text-white pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saffron/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo/10 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">
              About The Creator
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Meeting the <span className="text-gradient-gold">Visionary</span>
          </h1>
          <p className="text-lg text-smoke max-w-2xl mx-auto leading-relaxed">
            Merging ancient Vedic wisdom with cutting-edge Artificial
            Intelligence to guide you through your cosmic journey.
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass p-8 md:p-12 rounded-3xl border  border-white/10 relative overflow-hidden mb-16"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-saffron to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/20 bg-black/50 flex items-center justify-center relative z-10 overflow-hidden">
                {/* Placeholder for real image, using abstract avatar for now */}
                {/* <span className="text-4xl font-heading font-bold text-white/20">
                  UL
                </span> */}

                <img
                  src="https://avatars.githubusercontent.com/u/168621377?v=4"
                  alt="Utsav Lankapati"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-heading font-bold text-white mb-2">
                Utsav Lankapati
              </h2>
              <p className="text-gold font-medium mb-4 flex items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Full Stack Developer & AI
                  Enthusiast
                </div>
              </p>
              <p className="text-smoke mb-6 leading-relaxed">
                A passionate developer focused on crafting high-performance
                digital experiences at the intersection of design, engineering,
                and artificial intelligence. Currently pursuing a Diploma in
                Computer Engineering at Bhagwan Mahavir Polytechnic, Surat.
              </p>

              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://github.com/Matrixxboy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-white/10 transition-all group"
                >
                  <Github className="w-5 h-5 text-smoke group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.linkedin.com/in/utsav-lankapati/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-white/10 transition-all group"
                >
                  <Linkedin className="w-5 h-5 text-smoke group-hover:text-blue-400 transition-colors" />
                </a>
                <a
                  href="https://twitter.com/mmatrixxboy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-white/10 transition-all group"
                >
                  <Twitter className="w-5 h-5 text-smoke group-hover:text-sky-400 transition-colors" />
                </a>
                <a
                  href="mailto:utsav@example.com"
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-white/10 transition-all group"
                >
                  <Mail className="w-5 h-5 text-smoke group-hover:text-saffron transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-heading font-bold text-white mb-2">
              Journey & Experience
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-2xl border border-white/5 hover:border-gold/30 transition-all duration-300 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-saffron group-hover:text-gold transition-colors">
                  <exp.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">
                  {exp.role}
                </h4>
                <p className="text-sm text-gold/80 mb-3">{exp.company}</p>
                <p className="text-sm text-smoke leading-relaxed">{exp.desc}</p>
                <div className="absolute top-6 right-6 text-xs text-white/20 font-mono">
                  {exp.period}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack & AI Integration Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 relative"
        >
          {/* Decorative Background for Tech Section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b from-indigo/5 to-transparent rounded-full blur-3xl -z-10"></div>

          <div className="text-center mb-16 mt-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <Brain className="w-4 h-4 text-saffron" />
              <span className="text-sm font-medium text-gold">
                Built with Innovation
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Where <span className="text-gradient-gold">Vedic Wisdom</span>{" "}
              Meets <span className="text-blue-400">AI</span>
            </h3>
            <p className="text-smoke max-w-3xl mx-auto leading-relaxed text-lg">
              TheAstroPulse isn't just a website; it's a sophisticated
              computational engine. We combine accurate astronomical algorithms
              with state-of-the-art machine learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Architecture Column */}
            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Code2 className="w-6 h-6 text-blue-400" /> Modern Architecture
              </h4>

              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center shrink-0 border border-white/10">
                    <span className="text-cyan-400 font-bold">R</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-white">React & Frontend</h5>
                    <p className="text-sm text-smoke mt-1">
                      Built with React, Vite, and TailwindCSS for a
                      high-performance, responsive, and visually stunning user
                      interface.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center shrink-0 border border-white/10">
                    <span className="text-yellow-400 font-bold">Py</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Python Backend</h5>
                    <p className="text-sm text-smoke mt-1">
                      Robust Flask API handling complex calculations, data
                      processing, and AI model orchestration.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center shrink-0 border border-white/10">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Swiss Ephemeris</h5>
                    <p className="text-sm text-smoke mt-1">
                      Powered by the gold-standard <strong>Pyswisseph</strong>{" "}
                      library for high-precision planetary positioning spanning
                      5,000 years.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* AI Integration Column */}
            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 p-32 bg-saffron/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
              <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Brain className="w-6 h-6 text-saffron" /> AI Integration
              </h4>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h5 className="font-bold text-gold mb-2">
                    Computer Vision & Palmistry
                  </h5>
                  <p className="text-sm text-smoke leading-relaxed">
                    We utilize <strong>OpenCV</strong> and{" "}
                    <strong>Machine Learning</strong> models to process palm
                    images. Advanced filters (Meijering, Skeletonization)
                    extract clarity from chaos, identifying life lines and
                    mounts with precision.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h5 className="font-bold text-gold mb-2">
                    Vastu Blueprint Analysis
                  </h5>
                  <p className="text-sm text-smoke leading-relaxed">
                    AI algorithms analyze uploaded floor plans, detecting
                    geometric structures and aligning them with directional
                    grids to provide instant Vastu compliance reports.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h5 className="font-bold text-gold mb-2">
                    The Vedic AI Engine
                  </h5>
                  <p className="text-sm text-smoke leading-relaxed">
                    Our proprietary engine synthesizes thousands of astrological
                    rules with Large Language Models (LLMs) to generate
                    human-readable, context-aware predictions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education Section - Optional, can include simple text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Telescope className="w-5 h-5 text-gold" />
            <span className="text-smoke">
              Founder Of{" "}
              <span className="text-white font-medium">
                <a href="https://twomportal.vercel.app/">The World Of Matrix</a>
              </span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutUs
