import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiLink,
} from "react-icons/fi";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (error) {
      setError("Login Failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900 px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient background orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl animate-pulse"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-purple-500/25 blur-3xl animate-pulse"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl"
      />

      <div className="relative w-full max-w-md transition-all duration-500 ease-out">
        {/* Glassmorphism card */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl sm:p-10">
          {/* Logo / brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 ring-1 ring-white/20 transition-transform duration-300 hover:scale-105">
              <FiLink className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              LinkShort
            </h1>
            <p className="mt-1 text-sm text-blue-200/80">
              Smart URL management platform
            </p>
          </div>

          {/* Welcome message */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-blue-100/70">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-sm transition-all duration-300"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email input */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-blue-100/90"
              >
                Email address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-300/60">
                  <FiMail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-blue-200/40 shadow-inner shadow-black/10 outline-none transition-all duration-200 focus:border-blue-400/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-blue-100/90"
              >
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-300/60">
                  <FiLock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-white placeholder-blue-200/40 shadow-inner shadow-black/10 outline-none transition-all duration-200 focus:border-blue-400/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-blue-300/60 transition-colors duration-200 hover:text-white focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <FiLoader className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </span>
            </button>
          </form>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-blue-100/70">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-white underline decoration-blue-400/50 underline-offset-4 transition-colors duration-200 hover:text-blue-200 hover:decoration-blue-300"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer tagline */}
        <p className="mt-6 text-center text-xs text-blue-200/40">
          Secure authentication powered by your workspace
        </p>
      </div>
    </div>
  );
}

export default Login;
