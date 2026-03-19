import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register:", { username, email, password });
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
            Create an account
          </h1>
          <p className="text-xs leading-relaxed mb-7" style={{ color: "#666" }}>
            Join Perplexity and explore AI-powered answers.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username */}
            <div>
              <label
                className="block text-xs uppercase tracking-widest mb-1.5"
                style={{ color: "#666" }}
              >
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
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-[9px] text-sm px-3.5 py-2.5 transition-colors duration-150"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {/* Password strength hint */}
              <p className="text-[0.7rem] mt-1.5" style={{ color: "#444" }}>
                Use 8+ characters with a mix of letters and numbers.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-2 text-white font-medium text-sm py-3 rounded-[9px] tracking-wide transition-all duration-150 hover:-translate-y-px active:translate-y-0"
              style={{
                backgroundColor: "#237D84",
                boxShadow: "0 4px 16px rgba(35,125,132,0.25)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#1d6b71";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(35,125,132,0.35)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#237D84";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(35,125,132,0.25)";
              }}
            >
              Create Account
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

          {/* Switch to login */}
          <p className="text-center text-xs" style={{ color: "#666" }}>
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium hover:underline underline-offset-2"
              style={{ color: "#F5F5F5" }}
            >
              Sign in
            </a>
          </p>

          {/* Privacy */}
          <p
            className="text-center text-[0.7rem] mt-4 leading-relaxed"
            style={{ color: "#444" }}
          >
            By creating an account, you agree to our{" "}
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