import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/Layout/AdminLayout.jsx";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [booths, setBooths] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [usersRes, constRes, boothsRes, partiesRes] = await Promise.all([
        axiosClient.get("/users"),
        axiosClient.get("/constituencies"),
        axiosClient.get("/booths"),
        axiosClient.get("/parties"),
      ]);

      setUsers(usersRes.data || []);
      setConstituencies(constRes.data || []);
      setBooths(boothsRes.data || []);
      setParties(partiesRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLockToggle = async (c) => {
    try {
      setMessage("");
      if (c.isLocked) {
        await axiosClient.post(`/constituencies/${c._id}/unlock`);
      } else {
        await axiosClient.post(`/constituencies/${c._id}/lock`);
      }
      await loadData();
      setMessage(
        `Constituency "${c.name}" has been ${
          c.isLocked ? "unlocked" : "locked"
        }.`
      );
    } catch (err) {
      console.error(err);
      setMessage("Error updating lock status");
    }
  };

  const totalUsers = users.length;
  const workersCount = users.filter((u) => u.role === "WORKER").length;
  const leadersCount = users.filter((u) => u.role === "LEADER").length;
  const adminsCount = users.filter((u) => u.role === "ADMIN").length;

  const lokSabhaCount = constituencies.filter(
    (c) => c.type === "LOK_SABHA"
  ).length;
  const vidhanSabhaCount = constituencies.filter(
    (c) => c.type === "VIDHAN_SABHA"
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast / message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/40 px-4 py-2 text-sm text-blue-800 dark:text-blue-200 shadow-sm"
          >
            {message}
          </motion.div>
        )}

        {/* Summary cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-4 text-sm text-slate-500 dark:text-slate-400">
              Loading admin dashboard...
            </div>
          ) : (
            <>
              <StatCard
                title="Total Users"
                value={totalUsers}
                subtitle={`Admins: ${adminsCount} · Workers: ${workersCount} · Leaders: ${leadersCount}`}
                gradient="from-sky-500 to-cyan-500"
              />
              <StatCard
                title="Constituencies"
                value={constituencies.length}
                subtitle={`Lok Sabha: ${lokSabhaCount} · Vidhan Sabha: ${vidhanSabhaCount}`}
                gradient="from-indigo-500 to-purple-500"
              />
              <StatCard
                title="Booths"
                value={booths.length}
                subtitle={
                  constituencies.length
                    ? `Avg / Constituency: ${Math.round(
                        booths.length / constituencies.length
                      )}`
                    : "No constituencies yet"
                }
                gradient="from-emerald-500 to-lime-500"
              />
              <StatCard
                title="Parties"
                value={parties.length}
                subtitle="Manage party list & logos"
                gradient="from-rose-500 to-orange-500"
              />
            </>
          )}
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Quick actions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Jump quickly to key management sections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 py-4 text-sm">
            <ActionPill label="Manage Constituencies" to="/admin/constituencies" />
            <ActionPill label="Manage Booths" to="/admin/booths" />
            <ActionPill label="Manage Parties" to="/admin/parties" />
            <ActionPill label="Manage Users" to="/admin/users" />
          </div>
        </section>

        {/* Constituency control table */}
        <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Constituency control
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lock a constituency to stop workers from updating predictions.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800/70 text-left text-[11px] md:text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                    Name
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                    State
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                    Type
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                    Status
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {constituencies.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                    >
                      No constituencies created yet.
                    </td>
                  </tr>
                ) : (
                  constituencies.map((c, idx) => (
                    <motion.tr
                      key={c._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-slate-100 dark:border-slate-800/80"
                    >
                      <td className="px-3 py-2">{c.name}</td>
                      <td className="px-3 py-2">{c.state}</td>
                      <td className="px-3 py-2">
                        {c.type === "LOK_SABHA" ? "Lok Sabha" : "Vidhan Sabha"}
                      </td>
                      <td className="px-3 py-2">
                        {c.isLocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50/80 dark:bg-rose-950/40 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-300 border border-rose-200/70 dark:border-rose-900/60">
                            ● Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900/60">
                            ● Open
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleLockToggle(c)}
                          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium shadow-sm transition-colors ${
                            c.isLocked
                              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                              : "bg-rose-500 hover:bg-rose-600 text-white"
                          }`}
                        >
                          {c.isLocked ? "Unlock" : "Lock"}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, subtitle, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm"
  >
    <div
      className={`absolute inset-x-0 -top-12 h-24 bg-gradient-to-br ${gradient} opacity-20 dark:opacity-30 blur-2`}
    />
    <div className="relative px-4 py-4 space-y-1">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {title}
      </p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  </motion.div>
);

const ActionPill = ({ label, to }) => {
  return (
    <motion.a
      href={to}
      whileHover={{ y: -2, scale: 1.01 }}
      className="inline-flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 px-3 py-2 text-xs md:text-sm text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
    >
      <span>{label}</span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500">
        →
      </span>
    </motion.a>
  );
};

export default AdminDashboard;
