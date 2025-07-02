import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState(new Set());

  const toggleChat = () => setIsOpen(!isOpen);
  const handleInputChange = (e) => setInputValue(e.target.value);

  const toggleExpand = (index) => {
    const newSet = new Set(expandedMessages);
    newSet.has(index) ? newSet.delete(index) : newSet.add(index);
    setExpandedMessages(newSet);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: inputValue }
    ]);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_CHATBOT_API_KEY}?question=${encodeURIComponent(inputValue)}`, {
        method: "POST",
        headers: {
          "CHAT-API-KEY": import.meta.env.VITE_API_KEY_TOKEN,
        },
      });

      const data = await response.json();
      const botReply = typeof data === 'string' ? data : data.reply || "No reply received";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Failed to get response. Try again." }
      ]);
    }

    setInputValue('');
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"} // Added aria-label for accessibility
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
          <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 w-[350px] h-[500px] flex flex-col bg-white/15 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#451B6D] text-white flex items-center justify-between px-4 py-2">
            <h2 className="text-lg font-bold">Astro Chat Bot</h2>
            <button onClick={toggleChat} aria-label="Close chat window"> {/* Added aria-label */}
              <svg className="w-5 h-5" fill="white" viewBox="0 0 20 20">
                <path d="M14.348 5.652a.5.5 0 00-.707 0L10 9.293 6.36 5.652a.5.5 0 10-.707.707L9.293 10l-3.64 3.641a.5.5 0 10.707.707L10 10.707l3.641 3.64a.5.5 0 00.707-.707L10.707 10l3.64-3.641a.5.5 0 000-.707z" />
              </svg>
            </button>
          </div>

          {/* Added flex-col to enable self-start/self-end for message alignment */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm flex flex-col">
            {messages.map((message, index) => {
              const isExpanded = expandedMessages.has(index);
              const isLong = message.text.length > 180;
              return (
                <div
                  key={index}
                  //  whitespace-pre-wrap for better general text wrapping
                  className={`rounded-xl px-4 py-2 max-w-[85%] whitespace-pre-wrap ${
                    message.sender === 'user'
                      ? 'self-end bg-[#451B6D] text-white text-right'
                      : 'self-start bg-[#b893de] text-gray-150'
                  }`}
                  // Only apply cursor if message is long and can be expanded
                  style={{ cursor: isLong ? 'pointer' : 'default' }}
                  onClick={() => isLong && toggleExpand(index)}
                >
                  {isLong && !isExpanded
                    ? `${message.text.slice(0, 180)}...`
                    : message.text}
                  {isLong && (
                    <div className={`text-xs mt-1 text-right italic ${
                        message.sender === 'user' ? 'text-gray-100' : 'text-gray-700' // Adjusted text color for bot messages
                    }`}>
                      {isExpanded ? 'Click to collapse' : 'Click to expand'}
                    </div>
                  )}
                </div>
              );
            })} 
          </div>

          <div className="flex items-center px-3 py-2 border-t border-white/30 bg-white/10 backdrop-blur-md">
            <input
              type="text"
              className="flex-1 rounded-lg px-3 py-2 text-sm bg-white/30 placeholder-gray-100 text-gray-100 outline-none focus:ring-2 focus:ring-yellow-500" // Added focus style
              placeholder="Type your question..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSendMessage()} // Added !loading check
              disabled={loading} // Disable input while loading
              aria-label="Type your message" // Added aria-label
              required
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition "
              disabled={loading || !inputValue.trim()} // Disable if loading OR input is empty
              aria-label="Send message" // Added aria-label
            >
              {loading ? (
                // Spinner SVG for loading state
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                // Send icon SVG (Paper airplane style)
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
