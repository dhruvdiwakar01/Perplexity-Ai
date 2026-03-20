import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useChat } from '../hooks/useChat'
import { useDispatch } from 'react-redux'

const suggestions = [
  "What are the latest advancements in LangChain AI agents for real-time MERN applications?",
  "How to optimize WebRTC performance in a MERN stack for low-latency video streaming?",
  "Best practices for integrating LangChain with MongoDB in a MERN environment?",
  "How does RAG (Retrieval-Augmented Generation) improve AI response accuracy?",
]

const topicChips = [
  { label: "MERN Stack", icon: "⬡" },
  { label: "LangChain Agents", icon: "⟳" },
  { label: "WebRTC", icon: "◎" },
  { label: "AI Integration", icon: "✦" },
]

const ArrowUpIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
)

const MicIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
  </svg>
)

const HomePage = ({ onNavigateToChat }) => {
  const [input, setInput] = useState('')
  const chat = useChat()

  const handleSubmit = async (message) => {
    if (!message.trim()) return
    await chat.handleSendMessage({ message: message.trim(), chatId: null })
    onNavigateToChat()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(input)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 overflow-y-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 text-center"
      >
        <h1
          className="text-[72px] font-light tracking-[-0.04em] text-white/90 leading-none"
          style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
        >
          perplexity
        </h1>
      </motion.div>

      {/* Input box */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl"
      >
        <div className="relative rounded-2xl bg-[#111318] border border-white/[0.08] hover:border-white/[0.13] focus-within:border-white/20 transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={3}
            className="w-full bg-transparent px-5 pt-4 pb-3 text-[15px] text-white/80 placeholder:text-white/20 outline-none resize-none leading-relaxed"
            style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-white/25 hover:text-white/50 hover:bg-white/[0.04] transition-all border border-white/[0.05] hover:border-white/10">
                <span>+</span> Attach
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all">
                <MicIcon />
              </button>
              <button
                onClick={() => { handleSubmit(input); setInput('') }}
                disabled={!input.trim()}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/80 hover:bg-white disabled:bg-white/10 disabled:text-white/20 text-[#07090f] transition-all duration-200 disabled:cursor-not-allowed"
              >
                <ArrowUpIcon />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Topic chips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-2 mt-5 justify-center"
      >
        {topicChips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => { handleSubmit(chip.label); }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-[12px] text-white/40 hover:text-white/70 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-200"
          >
            <span className="text-white/30 text-[10px]">{chip.icon}</span>
            {chip.label}
          </button>
        ))}
      </motion.div>

      {/* Suggestion list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="w-full max-w-2xl mt-8 space-y-1"
      >
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            onClick={() => { handleSubmit(s) }}
            className="w-full text-left px-4 py-3 rounded-xl text-[13px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200 leading-snug border border-transparent hover:border-white/[0.05]"
          >
            <span className="text-[#a8d8e8]/30 mr-2">→</span>
            {s}
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

export default HomePage