import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { email, password };
    await handleLogin(payload);
    navigate("/");
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-sans"
      style={{
        backgroundColor: "#1C1C1C",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        backgroundImage:
          "radial-gradient(ellipse 55% 40% at 50% 0%, rgba(35,125,132,0.10) 0%, transparent 65%)",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Card */}
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
            <span
              className="text-base font-medium tracking-tight"
              style={{ color: "#F5F5F5" }}
            >
              Perplexity
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-2xl font-semibold tracking-tight leading-snug mb-1"
            style={{ color: "#F5F5F5" }}
          >
            Welcome back
          </h1>
          <p className="text-xs leading-relaxed mb-7" style={{ color: "#666" }}>
            Sign in to unlock the full potential of Perplexity.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email */}
            <div>
              <label
                className="block text-xs uppercase tracking-widest mb-1.5"
                style={{ color: "#666" }}
              >
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
                style={{
                  backgroundColor: "#181818",
                  border: "1px solid #2a2a2a",
                  color: "#F5F5F5",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#237D84";
                  e.target.style.boxShadow = "0 0 0 3px rgba(35,125,132,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#2a2a2a";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs uppercase tracking-widest mb-1.5"
                style={{ color: "#666" }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-[9px] text-sm px-3.5 py-2.5 transition-colors duration-150"
                style={{
                  backgroundColor: "#181818",
                  border: "1px solid #2a2a2a",
                  color: "#F5F5F5",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#237D84";
                  e.target.style.boxShadow = "0 0 0 3px rgba(35,125,132,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#2a2a2a";
                  e.target.style.boxShadow = "none";
                }}
              />
              <a
                href="#"
                className="block text-right mt-1.5 text-[0.72rem] transition-colors duration-150 hover:text-[#888]"
                style={{ color: "#555" }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 text-white font-medium text-sm py-3 rounded-[9px] tracking-wide transition-all duration-150 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#237D84",
                boxShadow: "0 4px 16px rgba(35,125,132,0.25)",
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#1d6b71";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(35,125,132,0.35)";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#237D84";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(35,125,132,0.25)";
              }}
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "#2a2a2a" }} />
            <span
              className="text-[0.68rem] uppercase tracking-widest"
              style={{ color: "#383838" }}
            >
              or
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#2a2a2a" }} />
          </div>

          {/* Switch to register */}
          <p className="text-center text-xs" style={{ color: "#666" }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium hover:underline underline-offset-2"
              style={{ color: "#F5F5F5" }}
            >
              Create one
            </Link>
          </p>

          {/* Privacy */}
          <p
            className="text-center text-[0.7rem] mt-4 leading-relaxed"
            style={{ color: "#444" }}
          >
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-2 hover:text-[#666] transition-colors"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-2 hover:text-[#666] transition-colors"
            >
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>

      {/* Fade-up keyframe */}
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