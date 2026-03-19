import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

   if (loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-0"
      style={{
        backgroundColor: "#1C1C1C",
        backgroundImage: "radial-gradient(ellipse 55% 40% at 50% 0%, rgba(35,125,132,0.12) 0%, transparent 65%)"
      }}
    >
      <img
        src="https://artificialanalysis.ai/img/logos/perplexity_small.png"
        className="w-8 h-8 object-contain mb-7"
        onError={(e) => (e.target.style.display = "none")}
      />
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(35,125,132,0.15)" strokeWidth="3"/>
        <circle cx="50" cy="50" r="36" fill="none" stroke="#237D84" strokeWidth="3"
          strokeLinecap="round" strokeDasharray="180"
          style={{ transformOrigin: "50px 50px", animation: "spin 1.6s ease-in-out infinite" }}
        />
      </svg>
      <p className="text-sm font-medium mt-5" style={{ color: "#F5F5F5" }}>Loading your workspace</p>
      <p style={{ color: "#555", fontSize: "12px", marginTop: "6px", animation: "pulse 2s ease-in-out infinite" }}>...</p>

      <style>{`
        @keyframes spin {
          0%   { stroke-dashoffset: 220; transform: rotate(0deg); }
          50%  { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 220; transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

    if (!user) {
        return <Navigate to="/login" replace />
    }


    return children
}

export default Protected