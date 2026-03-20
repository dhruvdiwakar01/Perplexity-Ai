import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

// Typewriter component for AI messages
const TypewriterText = ({ content, isLatest }) => {
  const [displayed, setDisplayed] = useState(isLatest ? '' : content)
  const [done, setDone] = useState(!isLatest)
  const indexRef = useRef(isLatest ? 0 : content.length)

  useEffect(() => {
    if (!isLatest) return
    if (indexRef.current >= content.length) { setDone(true); return }
    const timer = setTimeout(() => {
      indexRef.current += 2
      setDisplayed(content.slice(0, indexRef.current))
      if (indexRef.current >= content.length) setDone(true)
    }, 12)
    return () => clearTimeout(timer)
  }, [displayed, content, isLatest])

  const text = isLatest ? displayed : content

  return (
    <div className="relative">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-white/75">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 list-none pl-0 space-y-1">{children}</ul>,
          li: ({ children }) => (
            <li className="flex gap-2 text-white/65">
              <span className="text-[#a8d8e8]/50 mt-1 shrink-0">·</span>
              <span>{children}</span>
            </li>
          ),
          ol: ({ children }) => <ol className="mb-3 list-decimal pl-5 space-y-1 text-white/65">{children}</ol>,
          code: ({ inline, children }) => inline
            ? <code className="rounded-md bg-white/8 text-white/60 px-1.5 py-0.5 text-[13px]">{children}</code>
            : <code className="text-white/55 text-[13px]">{children}</code>,
          pre: ({ children }) => (
            <pre className="mb-3 overflow-x-auto rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 text-[13px] leading-relaxed">
              {children}
            </pre>
          ),
          h1: ({ children }) => <h1 className="text-lg font-semibold text-white/90 mb-2 mt-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold text-white/85 mb-2 mt-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold text-white/80 mb-1 mt-2">{children}</h3>,
          strong: ({ children }) => <strong className="font-semibold text-white/90">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#a8d8e8]/30 pl-4 my-2 text-white/50 italic">
              {children}
            </blockquote>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      >
        {text}
      </ReactMarkdown>
      {isLatest && !done && (
        <span className="inline-block w-0.5 h-4 bg-[#a8d8e8]/60 ml-0.5 align-middle animate-pulse" />
      )}
    </div>
  )
}

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const ThumbUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
)

const ThumbDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
  </svg>
)

const ArrowUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
)

const ShareIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
)

const ChatView = ({ chatId }) => {
  const chat = useChat()
  const [input, setInput] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = chatId || useSelector((state) => state.chat.currentChatId)
  const messages = chats[currentChatId]?.messages || []
  const messagesEndRef = useRef(null)
  const lastAiMessageIndex = messages.map(m => m.role).lastIndexOf('assistant')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setInput('')
    await chat.handleSendMessage({ message: trimmed, chatId: currentChatId })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#a8d8e8]/60 animate-pulse" />
          <span className="text-[13px] font-medium text-white/40 tracking-wide" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
            {chats[currentChatId]?.title || 'New Conversation'}
          </span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.07] text-[11px] text-white/30 hover:text-white/60 hover:border-white/15 transition-all">
          <ShareIcon /> Share
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        <AnimatePresence initial={false}>
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {message.role === 'user' ? (
                /* User message */
                <div className="flex justify-end">
                  <div className="max-w-[70%] px-4 py-3 rounded-2xl rounded-br-md bg-white/[0.07] border border-white/[0.06] text-[14px] text-white/80 leading-relaxed">
                    {message.content}
                  </div>
                </div>
              ) : (
                /* AI message */
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] leading-relaxed">
                      <TypewriterText
                        content={message.content}
                        isLatest={i === lastAiMessageIndex}
                      />
                    </div>
                    {/* Action row */}
                    <div className="flex items-center gap-1 mt-3 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                      <ActionBtn icon={<CopyIcon />} label="Copy" onClick={() => navigator.clipboard.writeText(message.content)} />
                      <ActionBtn icon={<ThumbUpIcon />} label="Good" />
                      <ActionBtn icon={<ThumbDownIcon />} label="Bad" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 shrink-0">
        <div className="relative rounded-2xl bg-[#0d1117] border border-white/[0.07] hover:border-white/[0.11] focus-within:border-white/15 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up..."
            rows={2}
            className="w-full bg-transparent px-4 pt-3.5 pb-2 text-[14px] text-white/75 placeholder:text-white/20 outline-none resize-none leading-relaxed"
            style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-white/20 hover:text-white/45 hover:bg-white/[0.04] transition-all border border-white/[0.05] hover:border-white/10">
              + Attach
            </button>
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="flex items-center justify-center w-7 h-7 rounded-xl bg-white/80 hover:bg-white disabled:bg-white/[0.06] disabled:text-white/15 text-[#07090f] transition-all duration-200 disabled:cursor-not-allowed"
            >
              <ArrowUpIcon />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-white/15 mt-2 tracking-wide">
          AI can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  )
}

const ActionBtn = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    className="p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all"
  >
    {icon}
  </button>
)

export default ChatView