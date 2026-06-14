import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMousePointer,
  FiClock,
  FiActivity,
  FiZap,
  FiLink,
  FiBarChart2,
  FiTrendingUp,
  FiCalendar,
  FiGlobe,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";

function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-9 w-40 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-4 h-10 w-72 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-2 h-5 w-96 max-w-full animate-pulse rounded-lg bg-white/10" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                  <div className="mt-3 h-9 w-16 animate-pulse rounded-lg bg-white/10" />
                </div>
                <div className="h-12 w-12 animate-pulse rounded-xl bg-white/10" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-80 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
          <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        </div>
      </main>
    </div>
  );
}

function getActiveStatus(totalClicks, lastVisited) {
  if (!totalClicks || totalClicks === 0) {
    return {
      label: "No Activity",
      description: "Waiting for first click",
      color: "text-slate-400",
      gradient: "from-slate-500 to-slate-600",
      dot: "bg-slate-400",
    };
  }

  const lastVisitDate = lastVisited ? new Date(lastVisited) : null;
  const daysSinceVisit = lastVisitDate
    ? Math.floor((Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  if (daysSinceVisit !== null && daysSinceVisit <= 7) {
    return {
      label: "Active",
      description: "Receiving traffic recently",
      color: "text-emerald-400",
      gradient: "from-emerald-500 to-teal-600",
      dot: "bg-emerald-400",
    };
  }

  return {
    label: "Idle",
    description: "No recent visits",
    color: "text-amber-400",
    gradient: "from-amber-500 to-orange-600",
    dot: "bg-amber-400",
  };
}

function buildChartData(recentVisits) {
  if (!recentVisits?.length) return [];

  const grouped = {};

  recentVisits.forEach((visit) => {
    const date = new Date(visit.visitedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([date, clicks]) => ({ date, clicks }))
    .reverse();
}

function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/url/analytics/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalytics(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load analytics");
    }
  };

  const chartData = useMemo(
    () => buildChartData(analytics?.recentVisits),
    [analytics]
  );

  const activeStatus = useMemo(
    () =>
      analytics
        ? getActiveStatus(analytics.totalClicks, analytics.lastVisited)
        : null,
    [analytics]
  );

  if (!analytics) {
    return <AnalyticsSkeleton />;
  }

  const statCards = [
    {
      label: "Total Clicks",
      value: analytics.totalClicks.toLocaleString(),
      icon: FiMousePointer,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      label: "Last Visited",
      value: analytics.lastVisited
        ? new Date(analytics.lastVisited).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Never",
      subValue: analytics.lastVisited
        ? new Date(analytics.lastVisited).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "No visits recorded",
      icon: FiClock,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      label: "Recent Visits",
      value: analytics.recentVisits.length.toLocaleString(),
      subValue: "Last 20 tracked visits",
      icon: FiActivity,
      gradient: "from-pink-500 to-rose-600",
    },
    {
      label: "Active Status",
      value: activeStatus.label,
      subValue: activeStatus.description,
      icon: FiZap,
      gradient: activeStatus.gradient,
      valueColor: activeStatus.color,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Gradient header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="group mb-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
          >
            <FiArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <FiBarChart2 className="h-5 w-5 text-violet-400" />
                <span className="text-sm font-medium text-violet-300">
                  Analytics Overview
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                URL Analytics
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                Track click performance, monitor visit activity, and understand
                how your shortened link is performing over time.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${activeStatus.dot} animate-pulse`}
              />
              <span className={`text-sm font-semibold ${activeStatus.color}`}>
                {activeStatus.label}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
          {statCards.map(
            ({ label, value, subValue, icon: Icon, gradient, valueColor }) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-400">{label}</p>
                    <p
                      className={`mt-1 text-2xl font-bold sm:text-3xl ${
                        valueColor || "text-white"
                      }`}
                    >
                      {value}
                    </p>
                    {subValue && (
                      <p className="mt-1 text-xs text-slate-500">{subValue}</p>
                    )}
                  </div>
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Summary + URL info */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Analytics summary */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/15 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <FiTrendingUp className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Analytics Summary
              </h2>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-300">
              <p>
                This link has received{" "}
                <span className="font-semibold text-white">
                  {analytics.totalClicks.toLocaleString()} total click
                  {analytics.totalClicks === 1 ? "" : "s"}
                </span>
                {analytics.lastVisited && (
                  <>
                    , with the most recent visit on{" "}
                    <span className="font-semibold text-white">
                      {new Date(analytics.lastVisited).toLocaleString()}
                    </span>
                  </>
                )}
                .
              </p>
              <p>
                {analytics.recentVisits.length > 0
                  ? `We've tracked ${analytics.recentVisits.length} recent visit${
                      analytics.recentVisits.length === 1 ? "" : "s"
                    } in the latest activity window.`
                  : "No visits have been recorded yet. Share your short link to start collecting analytics."}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  {analytics.totalClicks} lifetime clicks
                </span>
                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                  {analytics.recentVisits.length} recent events
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    activeStatus.label === "Active"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : activeStatus.label === "Idle"
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                        : "border-slate-500/20 bg-slate-500/10 text-slate-300"
                  }`}
                >
                  {activeStatus.label}
                </span>
              </div>
            </div>
          </div>

          {/* URL information card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/15 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <FiGlobe className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">
                URL Information
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Resource ID
                </p>
                <p className="mt-1 break-all font-mono text-sm text-slate-200">
                  {id}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Tracking Endpoint
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <FiLink className="h-4 w-4 shrink-0 text-violet-400" />
                  <p className="truncate font-mono text-xs text-slate-300">
                    /url/analytics/{id}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Performance
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                    <p className="text-lg font-bold text-white">
                      {analytics.totalClicks}
                    </p>
                    <p className="text-xs text-slate-500">Clicks</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                    <p className="text-lg font-bold text-white">
                      {analytics.recentVisits.length}
                    </p>
                    <p className="text-xs text-slate-500">Recent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart section */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/15 sm:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FiBarChart2 className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Click Trend
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Daily clicks from recent visit data
            </p>
          </div>

          {chartData.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-center">
              <FiBarChart2 className="mb-3 h-10 w-10 text-slate-600" />
              <p className="text-sm font-medium text-slate-400">
                No chart data available yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Visit activity will appear here once clicks are recorded
              </p>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      backdropFilter: "blur(12px)",
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                    itemStyle={{ color: "#a78bfa" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#clickGradient)"
                    dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: "#c4b5fd" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent visits timeline */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/15 sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <FiCalendar className="h-5 w-5 text-pink-400" />
            <h2 className="text-lg font-semibold text-white">Recent Visits</h2>
          </div>

          {analytics.recentVisits.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                <FiActivity className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-base font-medium text-slate-300">
                No visits yet
              </p>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                When someone clicks your short link, visit events will appear
                here in a live activity timeline.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/50 via-purple-500/30 to-transparent" />

              <ul className="space-y-4">
                {analytics.recentVisits.map((visit, index) => (
                  <li
                    key={visit._id}
                    className="group relative flex gap-4 pl-0 transition-all duration-300"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 transition-all duration-300 group-hover:border-violet-400/50 group-hover:bg-violet-500/20">
                      <FiMousePointer className="h-4 w-4 text-violet-300" />
                    </div>

                    <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.06]">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-medium text-white">
                          Link clicked
                        </p>
                        <p className="text-xs text-slate-500">
                          Visit #{analytics.recentVisits.length - index}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {new Date(visit.visitedAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Analytics;
