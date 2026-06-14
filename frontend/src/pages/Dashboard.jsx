import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiLink,
  FiCopy,
  FiTrash2,
  FiBarChart2,
  FiLogOut,
  FiPlus,
  FiMousePointer,
  FiZap,
  FiGlobe,
  FiLoader,
} from "react-icons/fi";
import api from "../services/api";

// ============================================================
// SET YOUR LOCAL NETWORK IP HERE (for QR codes on mobile WiFi)
// Run `ipconfig` on Windows or `ifconfig` on Mac/Linux to find it.
// Example: "192.168.1.5"
// ============================================================
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://linkforge-5v5l.onrender.com";

function getQrShortUrl(shortCode) {
  return `${BACKEND_URL}/${shortCode}`;
}
function QrCodeDisplay({ shortCode, size = 64, compact = false }) {
  const qrUrl = getQrShortUrl(shortCode);

  const copyQrLink = () => {
    navigator.clipboard.writeText(qrUrl);
    toast.success("QR Link Copied!");
  };

  return (
    <div className="group/qr flex flex-col items-center gap-2">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white p-2 shadow-sm transition-all duration-300 group-hover/qr:scale-105 group-hover/qr:shadow-lg group-hover/qr:shadow-violet-500/20">
        <QRCodeSVG
          value={qrUrl}
          size={size}
          level="M"
          includeMargin={false}
          className="block h-auto w-full"
          style={{ maxWidth: size, maxHeight: size }}
        />
      </div>

      <p
        title={qrUrl}
        className={`break-all text-center text-slate-400 ${
          compact
            ? "max-w-[120px] text-[10px] leading-tight line-clamp-2"
            : "max-w-[200px] text-xs"
        }`}
      >
        {qrUrl}
      </p>

      <button
        type="button"
        onClick={copyQrLink}
        title="Copy QR Link"
        className={`flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-violet-500/10 font-medium text-violet-300 transition-all duration-200 hover:border-violet-400/30 hover:bg-violet-500/20 hover:scale-105 active:scale-95 ${
          compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
        }`}
      >
        <FiCopy className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
        Copy QR Link
      </button>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const [originalUrl, setOriginalUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/url/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUrls(res.data.urls);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load URLs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      fetchUrls();
    }
  }, [navigate]);

  const createUrl = async () => {
    if (!originalUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      setCreating(true);
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/url/create",
        { originalUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Short URL Created!");
      console.log(res.data);
      setOriginalUrl("");
      await fetchUrls();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create URL");
    } finally {
      setCreating(false);
    }
  };

  const deleteUrl = async (id) => {
    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");

      await api.delete(`/url/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("URL Deleted");
      await fetchUrls();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete URL");
    } finally {
      setDeletingId(null);
    }
  };

  const copyUrl = (shortCode) => {
    const shortUrl = `${BACKEND_URL}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Short URL Copied!");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const totalClicks = urls.reduce((sum, url) => sum + (url.clickCount || 0), 0);
  const activeLinks = urls.filter((url) => url.clickCount > 0).length;

  const stats = [
    {
      label: "Total URLs",
      value: urls.length,
      icon: FiLink,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      label: "Total Clicks",
      value: totalClicks,
      icon: FiMousePointer,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      label: "Active Links",
      value: activeLinks,
      icon: FiZap,
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !creating) {
      createUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 relative overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(15, 23, 42, 0.9)",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
          },
          success: {
            iconTheme: { primary: "#34d399", secondary: "#0f172a" },
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "#0f172a" },
          },
        }}
      />

      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
                <FiLink className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white sm:text-xl">
                  LinkForge
                </h1>
                <p className="hidden text-xs text-slate-400 sm:block">
                  Premium URL Shortener
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
            >
              <FiLogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Dashboard
          </h2>
          <p className="mt-1 text-slate-400">
            Manage your shortened links and track performance
          </p>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {stats.map(({ label, value, icon: Icon, gradient }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{label}</p>
                  {loading ? (
                    <div className="mt-2 h-9 w-16 animate-pulse rounded-lg bg-white/10" />
                  ) : (
                    <p className="mt-1 text-3xl font-bold text-white">
                      {value.toLocaleString()}
                    </p>
                  )}
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* URL creation form */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/15 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <FiGlobe className="h-5 w-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">
              Create Short URL
            </h3>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="https://example.com/your-long-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={creating}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pl-11 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-violet-500/50 focus:bg-white/10 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
              />
              <FiLink className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>

            <button
              onClick={createUrl}
              disabled={creating}
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {creating ? (
                <>
                  <FiLoader className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FiPlus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                  Create Short URL
                </>
              )}
            </button>
          </div>
        </div>

        {/* URLs table / list */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5">
            <h3 className="text-lg font-semibold text-white">Your URLs</h3>
            <p className="text-sm text-slate-400">
              {loading
                ? "Loading your links..."
                : `${urls.length} link${urls.length !== 1 ? "s" : ""} total`}
            </p>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-white/5"
                />
              ))}
            </div>
          ) : urls.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 sm:py-20">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <FiLink className="h-10 w-10 text-slate-500" />
              </div>
              <h4 className="text-xl font-semibold text-white">
                No URLs created yet
              </h4>
              <p className="mt-2 max-w-sm text-center text-slate-400">
                Paste a long URL above and create your first short link to get
                started with tracking and analytics.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Original URL</th>
                      <th className="px-6 py-4">Short Code</th>
                      <th className="px-6 py-4">QR Code</th>
                      <th className="px-6 py-4">Clicks</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {urls.map((url) => {
                      const isDeleting = deletingId === url._id;

                      return (
                        <tr
                          key={url._id}
                          className="group transition-colors duration-200 hover:bg-white/5"
                        >
                          <td className="max-w-xs px-6 py-4">
                            <p className="truncate text-sm text-slate-300">
                              {url.originalUrl}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <code className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-sm font-mono text-violet-300">
                              {url.shortCode}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <QrCodeDisplay
                              shortCode={url.shortCode}
                              size={56}
                              compact
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
                              <FiMousePointer className="h-3.5 w-3.5" />
                              {url.clickCount}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => copyUrl(url.shortCode)}
                                title="Copy URL"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-emerald-500/10 text-emerald-400 transition-all duration-200 hover:border-emerald-400/30 hover:bg-emerald-500/20 hover:scale-105"
                              >
                                <FiCopy className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/analytics/${url._id}`)
                                }
                                title="View Analytics"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-blue-500/10 text-blue-400 transition-all duration-200 hover:border-blue-400/30 hover:bg-blue-500/20 hover:scale-105"
                              >
                                <FiBarChart2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteUrl(url._id)}
                                disabled={isDeleting}
                                title="Delete URL"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-red-500/10 text-red-400 transition-all duration-200 hover:border-red-400/30 hover:bg-red-500/20 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isDeleting ? (
                                  <FiLoader className="h-4 w-4 animate-spin" />
                                ) : (
                                  <FiTrash2 className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet cards */}
              <div className="lg:hidden divide-y divide-white/10">
                {urls.map((url) => {
                  const isDeleting = deletingId === url._id;

                  return (
                    <div
                      key={url._id}
                      className="p-5 transition-colors duration-200 hover:bg-white/5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="shrink-0 self-center sm:self-start">
                          <QrCodeDisplay shortCode={url.shortCode} size={80} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="break-all text-sm text-slate-300 line-clamp-2">
                            {url.originalUrl}
                          </p>
                          <code className="mt-2 inline-block rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-mono text-violet-300">
                            {url.shortCode}
                          </code>
                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                            <FiMousePointer className="h-3 w-3" />
                            {url.clickCount} clicks
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => copyUrl(url.shortCode)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-emerald-500/10 py-2.5 text-sm font-medium text-emerald-400 transition-all duration-200 hover:bg-emerald-500/20 active:scale-95"
                        >
                          <FiCopy className="h-4 w-4" />
                          Copy
                        </button>
                        <button
                          onClick={() => navigate(`/analytics/${url._id}`)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-blue-500/10 py-2.5 text-sm font-medium text-blue-400 transition-all duration-200 hover:bg-blue-500/20 active:scale-95"
                        >
                          <FiBarChart2 className="h-4 w-4" />
                          Analytics
                        </button>
                        <button
                          onClick={() => deleteUrl(url._id)}
                          disabled={isDeleting}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-red-500/10 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <FiLoader className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <FiTrash2 className="h-4 w-4" />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
