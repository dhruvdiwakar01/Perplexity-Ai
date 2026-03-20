import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const auth = useAuth();
  const error = useSelector((state) => state.auth.error);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await auth.handleRegister({ email, username, password });
    setSuccess(true);
  };

  const inputStyle = {
    backgroundColor: "#181818",
    border: "1px solid #2a2a2a",
    color: "#F5F5F5",
    outline: "none",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#237D84";
    e.target.style.boxShadow = "0 0 0 3px rgba(35,125,132,0.12)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#2a2a2a";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "#1C1C1C",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        backgroundImage: "radial-gradient(ellipse 55% 40% at 50% 0%, rgba(35,125,132,0.10) 0%, transparent 65%)",
      }}
    >
      <div className="w-full max-w-sm">
        <div
          className="rounded-2xl px-9 py-10 border"
          style={{
            backgroundColor: "#202020",
            borderColor: "#2a2a2a",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
            animation: "fadeUp 0.4s ease both",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <img
              src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/perplexity-color.png"
              alt="Perplexity"
              className="w-7 h-7 object-contain"
              onError={(e) => (e.target.style.display = "none")}
            />
            <span className="text-base font-medium tracking-tight" style={{ color: "#F5F5F5" }}>
              Perplexity
            </span>
          </div>

          {/* Success state */}
          {success && !error ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-[#237D84]/20 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#237D84" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white/90 mb-2">Check your email!</h2>
              <p className="text-sm text-white/40 leading-relaxed">
                We sent a verification link to <strong className="text-white/60">{email}</strong>. Click it to activate your account.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight leading-snug mb-1" style={{ color: "#F5F5F5" }}>
                Create an account
              </h1>
              <p className="text-xs leading-relaxed mb-7" style={{ color: "#666" }}>
                Join Perplexity and explore AI-powered answers.
              </p>

              {/* Error message */}
              {error && (
                <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#666" }}>
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="your_username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-[9px] text-sm px-3.5 py-2.5 transition-colors duration-150"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#666" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-[9px] text-sm px-3.5 py-2.5 transition-colors duration-150"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#666" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-[9px] text-sm px-3.5 py-2.5 transition-colors duration-150"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <p className="text-[0.7rem] mt-1.5" style={{ color: "#444" }}>
                    Use 8+ characters with a mix of letters and numbers.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 text-white font-medium text-sm py-3 rounded-[9px] tracking-wide transition-all duration-150 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "#237D84",
                    boxShadow: "0 4px 16px rgba(35,125,132,0.25)",
                  }}
                  onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = "#1d6b71" }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#237D84" }}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ backgroundColor: "#2a2a2a" }} />
                <span className="text-[0.68rem] uppercase tracking-widest" style={{ color: "#383838" }}>or</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "#2a2a2a" }} />
              </div>

              <p className="text-center text-xs" style={{ color: "#666" }}>
                Already have an account?{" "}
                <a href="/login" className="font-medium hover:underline underline-offset-2" style={{ color: "#F5F5F5" }}>
                  Sign in
                </a>
              </p>

              <p className="text-center text-[0.7rem] mt-4 leading-relaxed" style={{ color: "#444" }}>
                By creating an account, you agree to our{" "}
                <a href="#" className="underline underline-offset-2 hover:text-[#666] transition-colors">Privacy Policy</a>{" "}
                and{" "}
                <a href="#" className="underline underline-offset-2 hover:text-[#666] transition-colors">Terms of Service</a>.
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: #444; }
      `}</style>
    </div>
  );
}