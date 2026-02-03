import React, { useState, useEffect, useRef } from "react"
import { FaRobot, FaTimes, FaPaperPlane, FaUserCog } from "react-icons/fa"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const [userDetails, setUserDetails] = useState(null)
  const [showProfileForm, setShowProfileForm] = useState(false)

  const messagesEndRef = useRef(null)
  const apiUrl = import.meta.env.VITE_ASTRO_API_URL || "apiUrl"
  useEffect(() => {
    // scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Initialize User ID
    let storedUserId = localStorage.getItem("astro_user_id")
    if (!storedUserId) {
      storedUserId = "user_" + Math.random().toString(36).substr(2, 9)
      localStorage.setItem("astro_user_id", storedUserId)
    }
    setUserId(storedUserId)

    // Check for stored details
    const storedDetails = localStorage.getItem("astro_user_details")
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails))
    } else {
      setShowProfileForm(true)
    }
  }, [])

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const details = {
      name: formData.get("name"),
      dob: formData.get("dob"),
      tob: formData.get("tob"),
      pob: formData.get("pob"),
      gender: formData.get("gender"),
    }
    localStorage.setItem("astro_user_details", JSON.stringify(details))
    setUserDetails(details)
    setShowProfileForm(false)
    setMessages([
      {
        sender: "bot",
        text: `Namaste ${details.name}! 🙏 I am your Vedic AI Assistant. How can I guide you today?`,
      },
    ])
  }

  const clearProfile = () => {
    localStorage.removeItem("astro_user_details")
    setUserDetails(null)
    setShowProfileForm(true)
    setMessages([])
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    if (!userDetails) {
      setShowProfileForm(true)
      return
    }

    const userMsg = inputValue
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }])
    setInputValue("")
    setLoading(true)

    try {
      // Assuming backend is at http://localhost:5000 based on main.py
      // You might need to change this URL or use an env variable
      const apiUrl =
        import.meta.env.VITE_ASTRO_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CHAT-API-KEY": import.meta.env.VITE_API_KEY_TOKEN || "",
        },
        body: JSON.stringify({
          user_id: userId,
          question: userMsg,
          user_details: userDetails,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }])
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ " + (data.error || "Connection error") },
        ])
      }
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Failed to connect to the cosmic server." },
      ])
    }

    setLoading(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        >
          <FaRobot className="text-2xl animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="w-[380px] h-[600px] flex flex-col bg-[#0f0c29]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400">
                <FaRobot />
              </div>
              <div>
                <h3 className="text-white font-bold">Vedic AI Guide</h3>
                <p className="text-xs text-purple-300">Authentic Astrology</p>
              </div>
            </div>
            <div className="flex gap-2">
              {userDetails && (
                <button
                  onClick={clearProfile}
                  className="text-white/50 hover:text-white p-2"
                  title="Reset Profile"
                >
                  <FaUserCog />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white p-2"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
            {/* Profile Form */}
            {showProfileForm ? (
              <div className="absolute inset-0 z-10 bg-[#0f0c29] p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  Setup Your Profile
                </h3>
                <p className="text-gray-400 text-sm text-center mb-6">
                  To provide accurate predictions, I need your birth details.
                </p>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <input
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                  />
                  <div>
                    <label className="text-xs text-gray-400 ml-1">
                      Date of Birth
                    </label>
                    <input
                      name="dob"
                      type="date"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 ml-1">
                      Time of Birth
                    </label>
                    <input
                      name="tob"
                      type="time"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                  <input
                    name="pob"
                    placeholder="Place of Birth (City, Country)"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                  />
                  <select
                    name="gender"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg text-white font-bold hover:shadow-lg transition"
                  >
                    Start Chatting
                  </button>
                </form>
              </div>
            ) : (
              /* Chat Messages */
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 mt-10">
                    <p>
                      Ask me anything about your <br />{" "}
                      <span className="text-yellow-400">
                        Career, Health, or Relationships
                      </span>
                      .
                    </p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-purple-600 text-white rounded-br-none"
                          : "bg-white/10 text-gray-100 rounded-bl-none border border-white/5"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-2xl p-3 flex gap-2 items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer Input */}
          {!showProfileForm && (
            <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask a cosmic question..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white outline-none focus:border-purple-500 transition placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputValue.trim()}
                className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Chatbot
