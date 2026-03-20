import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { setCurrentChatId, setChats } from '../chat.slice'
import { deleteChat } from '../service/chat.api'
import Sidebar from '../components/Sidebar'
import HomePage from './HomePage'
import ChatView from './ChatView'
import ChatsLibrary from './ChatsLibrary'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const Dashboard = () => {
  const chat = useChat()
  const dispatch = useDispatch()
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const [activePage, setActivePage] = useState('home') // 'home' | 'chat' | 'library'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null))
    setActivePage('home')
    setMobileSidebarOpen(false)
  }

 const handleDeleteChat = async (chatId) => {
  try {
    await deleteChat(chatId)
  } catch (err) {
    console.error('Failed to delete chat:', err)
  }
  const updated = { ...chats }
  delete updated[chatId]
  dispatch(setChats(updated))
  if (currentChatId === chatId) {
    dispatch(setCurrentChatId(null))
    setActivePage('home')
  }
}

  const handleOpenChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setActivePage('chat')
    setMobileSidebarOpen(false)
  }

  const handleNavigate = (page) => {
    setActivePage(page)
    setMobileSidebarOpen(false)
  }

  const handleNavigateToChat = () => {
    setActivePage('chat')
  }

  return (
    <main className="min-h-screen w-full bg-[#07090f] text-white overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.12); }
        * { box-sizing: border-box; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>

      <div className="flex h-screen">

        {/* Mobile top bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#07090f]/95 backdrop-blur-sm border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <img src="https://artificialanalysis.ai/img/logos/perplexity_small.png" alt="Perplexity" className="w-5 h-5 object-contain opacity-80" />
            <span className="text-[14px] font-medium text-white/75">perplexity</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
              {/* Drawer */}
              <motion.div
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72"
              >
                <Sidebar
                  activePage={activePage}
                  onNavigate={handleNavigate}
                  onNewChat={handleNewChat}
                  onDeleteChat={handleDeleteChat}
                  mobileClose={() => setMobileSidebarOpen(false)}
                  isMobile={true}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden pt-14 md:pt-0">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.008] rounded-full blur-[100px]" />
          </div>

          <AnimatePresence mode="wait">
            {activePage === 'home' && (
              <motion.div
                key="home"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <HomePage onNavigateToChat={handleNavigateToChat} />
              </motion.div>
            )}

            {activePage === 'chat' && (
              <motion.div
                key="chat"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <ChatView chatId={currentChatId} />
              </motion.div>
            )}

            {activePage === 'library' && (
              <motion.div
                key="library"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <ChatsLibrary
                  onOpenChat={handleOpenChat}
                  onDeleteChat={handleDeleteChat}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}

export default Dashboard