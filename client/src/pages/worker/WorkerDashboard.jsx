import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import PredictionForm from "../../components/forms/PredictionForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { motion } from "framer-motion";

const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadBooths = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/predictions/my-booths");
      setBooths(res.data || []);
      if (!selectedBooth && res.data?.length) {
        setSelectedBooth(res.data[0]);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load booths.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooths();
  }, []);

  const handleSubmitPrediction = async (payload) => {
    try {
      setSaving(true);
      setMessage("");
      await axiosClient.post("/predictions", payload);
      setMessage("Prediction saved successfully.");
      await loadBooths();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error saving prediction.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
            EP
          </div>
          <div>
            <h1 className="text-sm md:text-base font-semibold tracking-tight">
              Worker Dashboard
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Enter booth-level predictions assigned to you.
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
                    ? "linear-gradient(to bottom right,#4ade80,#22c55e)"
                    : "linear-gradient(to bottom right,#22c55e,#14b8a6)",
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
          {/* Status / message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/80 bg-emerald-50/80 dark:bg-emerald-950/40 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-200"
            >
              {message}
            </motion.div>
          )}

          {/* Header summary */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SummaryCard
              label="Total assigned booths"
              value={booths.length}
              tone="blue"
            />
            <SummaryCard
              label="Booths with prediction"
              value={booths.filter((b) => b.prediction).length}
              tone="green"
            />
            <SummaryCard
              label="Booths pending"
              value={booths.filter((b) => !b.prediction).length}
              tone="amber"
            />
          </section>

          {/* Main grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Booth list */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight">
                    Assigned booths
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Select a booth to enter or edit prediction.
                  </p>
                </div>
              </div>

              <div className="max-h-[460px] overflow-auto">
                {loading ? (
                  <div className="p-4 text-xs text-slate-500 dark:text-slate-400">
                    Loading booths...
                  </div>
                ) : booths.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500 dark:text-slate-400">
                    No booths assigned to you yet.
                  </div>
                ) : (
                  <table className="min-w-full text-xs md:text-sm">
                    <thead>
                      <tr className="bg-slate-100/80 dark:bg-slate-800/70 text-[11px] uppercase text-slate-500 dark:text-slate-400">
                        <th className="px-3 py-2 text-left">Booth</th>
                        <th className="px-3 py-2 text-center">Voters</th>
                        <th className="px-3 py-2 text-center">Status</th>
                        <th className="px-3 py-2 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {booths.map((b) => {
                        const active =
                          selectedBooth && selectedBooth.boothId === b.boothId;
                        return (
                          <tr
                            key={b.boothId}
                            className={`border-b border-slate-100 dark:border-slate-800/80 ${
                              active
                                ? "bg-blue-50/70 dark:bg-blue-950/30"
                                : "bg-transparent hover:bg-slate-50/70 dark:hover:bg-slate-900"
                            }`}
                          >
                            <td className="px-3 py-2">
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  #{b.boothNumber}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {b.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              {b.voterCount || "-"}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {b.prediction ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900/60">
                                  ● Filled
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50/80 dark:bg-amber-950/40 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-300 border border-amber-200/70 dark:border-amber-900/60">
                                  ● Pending
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                onClick={() => setSelectedBooth(b)}
                                className="text-[11px] px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>

            {/* Prediction form */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm p-4 md:p-5"
            >
              {selectedBooth ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-sm font-semibold tracking-tight">
                        Prediction for #{selectedBooth.boothNumber}
                      </h2>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {selectedBooth.name}
                      </p>
                    </div>
                    {selectedBooth.prediction && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Last updated:{" "}
                        {new Date(
                          selectedBooth.prediction.updatedAt ||
                            selectedBooth.prediction.createdAt
                        ).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                    Tip: Ensure party vote share % adds roughly to 100 for
                    better accuracy.
                  </div>

                  <PredictionForm
                    booth={selectedBooth}
                    onSubmit={handleSubmitPrediction}
                  />

                  {saving && (
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      Saving...
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-slate-500 dark:text-slate-400">
                  Select a booth from the left panel to start entering
                  predictions.
                </div>
              )}
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
};

const SummaryCard = ({ label, value, tone }) => {
  const configs = {
    blue: {
      ring: "ring-blue-100 dark:ring-blue-900/40",
      bg: "bg-blue-50/60 dark:bg-blue-950/30",
      text: "text-blue-700 dark:text-blue-200",
    },
    green: {
      ring: "ring-emerald-100 dark:ring-emerald-900/40",
      bg: "bg-emerald-50/60 dark:bg-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-200",
    },
    amber: {
      ring: "ring-amber-100 dark:ring-amber-900/40",
      bg: "bg-amber-50/60 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-200",
    },
  }[tone || "blue"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 px-3 py-3 text-xs shadow-sm bg-white/80 dark:bg-slate-900/80 ${configs.ring}`}
    >
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </p>
      <p className={`text-xl font-semibold ${configs.text}`}>{value}</p>
    </motion.div>
  );
};

export default WorkerDashboard;
