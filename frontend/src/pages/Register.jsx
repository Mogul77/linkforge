import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiLink,
} from "react-icons/fi";
import api from "../services/api";

function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: "", bars: 0 };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", bars: 1 };
  if (score === 2) return { score: 2, label: "Fair", bars: 2 };
  if (score === 3) return { score: 3, label: "Good", bars: 3 };
  return { score: 4, label: "Strong", bars: 4 };
}

const strengthColors = {
  1: "bg-red-400",
  2: "bg-orange-400",
  3: "bg-yellow-400",
  4: "bg-emerald-400",
};

const strengthTextColors = {
  1: "text-red-300",
  2: "text-orange-300",
  3: "text-yellow-300",
  4: "text-emerald-300",
};

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.post("/auth/register", formData);

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration Failed"
      );
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
              Create your account
            </h2>
            <p className="mt-2 text-sm text-blue-100/70">
              Start shortening links and tracking analytics in minutes
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
            {/* Name input */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-blue-100/90"
              >
                Full name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-300/60">
                  <FiUser className="h-5 w-5" />
                </span>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-blue-200/40 shadow-inner shadow-black/10 outline-none transition-all duration-200 focus:border-blue-400/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/30"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

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
                  name="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-blue-200/40 shadow-inner shadow-black/10 outline-none transition-all duration-200 focus:border-blue-400/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/30"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-white placeholder-blue-200/40 shadow-inner shadow-black/10 outline-none transition-all duration-200 focus:border-blue-400/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/30"
                  value={formData.password}
                  onChange={handleChange}
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

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-3 space-y-2 transition-all duration-300">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          bar <= passwordStrength.bars
                            ? strengthColors[passwordStrength.score]
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs font-medium transition-colors duration-300 ${
                      strengthTextColors[passwordStrength.score]
                    }`}
                  >
                    Password strength: {passwordStrength.label}
                  </p>
                  <ul className="space-y-1 text-xs text-blue-200/50">
                    <li
                      className={`transition-colors duration-200 ${
                        formData.password.length >= 8
                          ? "text-emerald-300/80"
                          : ""
                      }`}
                    >
                      • At least 8 characters
                    </li>
                    <li
                      className={`transition-colors duration-200 ${
                        /[A-Z]/.test(formData.password)
                          ? "text-emerald-300/80"
                          : ""
                      }`}
                    >
                      • One uppercase letter
                    </li>
                    <li
                      className={`transition-colors duration-200 ${
                        /[0-9]/.test(formData.password)
                          ? "text-emerald-300/80"
                          : ""
                      }`}
                    >
                      • One number
                    </li>
                    <li
                      className={`transition-colors duration-200 ${
                        /[^A-Za-z0-9]/.test(formData.password)
                          ? "text-emerald-300/80"
                          : ""
                      }`}
                    >
                      • One special character
                    </li>
                  </ul>
                </div>
              )}
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
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </span>
            </button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-blue-100/70">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-white underline decoration-blue-400/50 underline-offset-4 transition-colors duration-200 hover:text-blue-200 hover:decoration-blue-300"
            >
              Sign in
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

export default Register;
