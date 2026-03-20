import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { setCurrentChatId } from '../chat.slice'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const ChatsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)

const Sidebar = ({ activePage, onNavigate, onNewChat, onDeleteChat, isMobile = false, mobileClose }) => {
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const chat = useChat()
  const dispatch = useDispatch()
  const [hoveredChat, setHoveredChat] = useState(null)

  const recentChats = Object.values(chats).slice(0, 5)

  const handleOpenChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    onNavigate('chat')
  }

  return (
    <aside className={`flex flex-col h-full w-64 shrink-0 bg-[#080b13] border-r border-white/[0.04] ${isMobile ? 'flex' : 'hidden md:flex'}`}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://artificialanalysis.ai/img/logos/perplexity_small.png"
            alt="Perplexity"
            className="w-5 h-5 object-contain shrink-0 opacity-80"
          />
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: '-0.01em' }}>
            perplexity
          </span>
        </div>
        {isMobile && (
          <button
            onClick={mobileClose}
            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5">
        <NavItem
          icon={<SearchIcon />}
          label="Search"
          active={activePage === 'home'}
          onClick={() => onNavigate('home')}
        />
        <NavItem
          icon={<ChatsIcon />}
          label="Chats"
          active={activePage === 'library'}
          onClick={() => onNavigate('library')}
        />
      </nav>

      {/* New Chat */}
      <div className="px-3 mt-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all duration-200 group"
        >
          <span className="w-5 h-5 rounded-md border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
            <PlusIcon />
          </span>
          New Chat
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mt-4 mb-3 h-px bg-white/[0.05]" />

      {/* Recent Chats */}
      <div className="px-3 flex-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.1em] uppercase text-white/20">
          Recent
        </p>

        <AnimatePresence>
          {recentChats.length === 0 ? (
            <p className="px-3 text-[12px] text-white/20 italic">No recent chats</p>
          ) : (
            recentChats.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ delay: i * 0.04 }}
                className="relative group"
                onMouseEnter={() => setHoveredChat(c.id)}
                onMouseLeave={() => setHoveredChat(null)}
              >
                <button
                  onClick={() => handleOpenChat(c.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-[13px] transition-all duration-150 ${
                    currentChatId === c.id
                      ? 'bg-white/[0.07] text-white/90'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0 mt-px" />
                  <span className="truncate leading-snug">{c.title}</span>
                </button>

                {/* Delete button */}
                <AnimatePresence>
                  {hoveredChat === c.id && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={(e) => { e.stopPropagation(); onDeleteChat(c.id) }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/20 hover:text-red-400/70 hover:bg-red-400/10 transition-all duration-150"
                    >
                      <TrashIcon />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {Object.values(chats).length > 5 && (
          <button
            onClick={() => onNavigate('library')}
            className="mt-1 px-3 py-1.5 text-[11px] text-white/30 hover:text-white/50 transition-colors"
          >
            View all →
          </button>
        )}
      </div>

      {/* Bottom user area */}
      <div className="px-3 pb-4 pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center text-[10px] font-bold text-[#07090f]">
            D
          </div>
          <span className="text-[13px] text-white/50 font-medium">dhruv</span>
        </div>
      </div>
    </aside>
  )
}

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
      active
        ? 'bg-white/[0.07] text-white/90'
        : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
    }`}
  >
    <span className={active ? 'text-white/70' : ''}>{icon}</span>
    {label}
  </button>
)

export default Sidebar