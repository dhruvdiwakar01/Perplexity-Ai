import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)

const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const ChatsLibrary = ({ onOpenChat, onDeleteChat }) => {
  const chats = useSelector((state) => state.chat.chats)
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const chatList = Object.values(chats)

  const filtered = chatList.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-[22px] font-semibold text-white/90 tracking-[-0.02em]" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
            Chats
          </h1>
          <p className="text-[11px] text-white/25 mt-0.5">{chatList.length} conversation{chatList.length !== 1 ? 's' : ''}</p>
        </div>
      </motion.div>

      {/* Search + view toggle */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
            <SearchIcon />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your chats..."
            className="w-full bg-[#0d1117] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white/70 placeholder:text-white/20 outline-none focus:border-white/10 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-[#0d1117] border border-white/[0.07] rounded-xl p-1">
          <ViewToggle active={view === 'grid'} onClick={() => setView('grid')} icon={<GridIcon />} />
          <ViewToggle active={view === 'list'} onClick={() => setView('list')} icon={<ListIcon />} />
        </div>
      </motion.div>

      {/* Chat cards */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="text-[13px] text-white/20">{search ? 'No chats found' : 'No chats yet. Start a conversation!'}</p>
          </motion.div>
        ) : view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#0d1117] transition-all duration-200 cursor-pointer"
                onClick={() => onOpenChat(c.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] text-white/20 font-medium tracking-wide">
                    {formatDate(c.lastUpdated)}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteChat(c.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/20 hover:text-red-400/60 hover:bg-red-400/10 transition-all"
                  >
                    <TrashIcon />
                  </button>
                </div>
                <h3 className="text-[14px] font-medium text-white/75 group-hover:text-white/90 transition-colors leading-snug mb-2 line-clamp-2">
                  {c.title}
                </h3>
                <p className="text-[11px] text-white/20">Chat session</p>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1"
          >
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-all duration-150 cursor-pointer border border-transparent hover:border-white/[0.05]"
                onClick={() => onOpenChat(c.id)}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white/60 group-hover:text-white/85 transition-colors truncate">{c.title}</p>
                </div>
                <span className="text-[11px] text-white/20 shrink-0">{formatDate(c.lastUpdated)}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteChat(c.id) }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/20 hover:text-red-400/60 hover:bg-red-400/10 transition-all"
                >
                  <TrashIcon />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ViewToggle = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-all duration-150 ${
      active ? 'bg-white/[0.08] text-white/70' : 'text-white/25 hover:text-white/50'
    }`}
  >
    {icon}
  </button>
)

export default ChatsLibrary