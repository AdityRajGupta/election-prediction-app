import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import VoteSharePie from "../../components/charts/VoteSharePie.jsx";
import BoothTrendChart from "../../components/charts/BoothTrendChart.jsx";
import ProgressBar from "../../components/charts/ProgressBar.jsx";
import { motion } from "framer-motion";

const LeaderDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setMessage("");
      const res = await axiosClient.get(
        "/analytics/leader/constituency-summary/me"
      );
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error loading constituency summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
            EP
          </div>
          <div>
            <h1 className="text-sm md:text-base font-semibold tracking-tight">
              Leader Dashboard
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              High-level view of your constituency prediction.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(to bottom right,#a855f7,#6366f1)"
                    : "linear-gradient(to bottom right,#6366f1,#a855f7)",
              }}
            ></span>
            {theme === "dark" ? "Dark" : "Light"} mode
          </button>

          <div className="hidden md:flex flex-col items-end text-xs text-slate-500 dark:text-slate-400">
            <span>Logged in as</span>
            <span className="font-medium text-slate-800 dark:text-slate-100">
              {user?.name}
            </span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 shadow-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-rose-200/80 dark:border-rose-900/80 bg-rose-50/80 dark:bg-rose-950/40 px-3 py-2 text-xs text-rose-700 dark:text-rose-200"
            >
              {message}
            </motion.div>
          )}

          {loading || !summary ? (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Loading constituency analytics...
            </div>
          ) : (
            <>
              {/* Title + meta */}
              <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {summary.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Overview of predicted performance based on booth-level
                    inputs.
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-500">
                    Updated booths: {summary.boothsUpdated} /{" "}
                    {summary.totalBooths} (
                    {Math.round(summary.updateProgress || 0)}%)
                  </p>
                </div>
                <button
                  onClick={loadSummary}
                  className="self-start md:self-auto inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  ⟳ Refresh data
                </button>
              </section>

              {/* Summary cards */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InfoCard
                  title="Predicted winner"
                  value={summary.predictedWinner || "N/A"}
                  description="Based on aggregated booth-level vote share."
                  gradient="from-indigo-500 to-purple-500"
                />
                <InfoCard
                  title="Booth update progress"
                  value={`${Math.round(summary.updateProgress || 0)}%`}
                  description={`${summary.boothsUpdated} of ${summary.totalBooths} booths have submitted predictions.`}
                  gradient="from-emerald-500 to-lime-500"
                  extra={
                    <div className="mt-2">
                      <ProgressBar value={summary.updateProgress} />
                    </div>
                  }
                />
                <InfoCard
                  title="Data confidence"
                  value={
                    summary.totalBooths
                      ? `${Math.round(
                          (summary.boothsUpdated / summary.totalBooths) * 100
                        )}%`
                      : "N/A"
                  }
                  description="Approximate confidence based on coverage."
                  gradient="from-sky-500 to-cyan-500"
                />
              </section>

              {/* Charts */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm p-4"
                >
                  <h3 className="text-sm font-semibold tracking-tight mb-1">
                    Vote share by party
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                    Percentage of predicted votes aggregated from all updated
                    booths.
                  </p>
                  <VoteSharePie voteShare={summary.voteShare} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm p-4"
                >
                  <h3 className="text-sm font-semibold tracking-tight mb-1">
                    Trend over time
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                    How major parties&apos; predicted share has evolved as more
                    booths reported.
                  </p>
                  <BoothTrendChart trend={summary.trendOverTime || []} />
                </motion.div>
              </section>

              {/* Simple booth strength view (optional placeholder) */}
              <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight">
                      Booth snapshot
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Quick look at which party is leading in some booths.
                    </p>
                  </div>
                </div>

                {(!summary.boothStrength ||
                  summary.boothStrength.length === 0) && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Detailed booth strength data is not configured yet, but you
                    can extend the backend to provide it.
                  </p>
                )}

                {summary.boothStrength && summary.boothStrength.length > 0 && (
                  <div className="overflow-x-auto mt-2">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 dark:bg-slate-800/70 text-[11px] uppercase text-slate-500 dark:text-slate-400">
                          <th className="px-3 py-2 text-left">Booth</th>
                          <th className="px-3 py-2 text-left">Leading party</th>
                          <th className="px-3 py-2 text-left">Margin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.boothStrength.map((b, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-slate-100 dark:border-slate-800/80"
                          >
                            <td className="px-3 py-2 text-[11px]">
                              {b.boothName}
                            </td>
                            <td className="px-3 py-2 text-[11px]">
                              {b.leadingParty}
                            </td>
                            <td className="px-3 py-2 text-[11px]">
                              {b.margin}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({ title, value, description, gradient, extra }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-sm px-4 py-4"
  >
    <div
      className={`absolute inset-x-0 -top-10 h-20 bg-gradient-to-br ${gradient} opacity-20 dark:opacity-30 blur-xl`}
    />
    <div className="relative space-y-1">
      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {title}
      </p>
      <p className="text-xl font-semibold">{value}</p>
      {description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {extra}
    </div>
  </motion.div>
);

export default LeaderDashboard;
