import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/Layout/AdminLayout.jsx";
import { motion } from "framer-motion";

const ConstituencyCRUD = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    state: "",
    type: "LOK_SABHA",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/constituencies");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load constituencies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await axiosClient.post("/constituencies", form);
      setForm({ name: "", state: "", type: "LOK_SABHA" });
      await load();
      setMessage("Constituency created successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Error creating constituency.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            Constituency Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add new Lok Sabha / Vidhan Sabha constituencies and view the list.
          </p>
        </header>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-3 py-2 text-xs text-slate-700 dark:text-slate-200"
          >
            {message}
          </motion.div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="md:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm p-4 space-y-3 text-xs"
          >
            <h3 className="text-sm font-semibold">Add constituency</h3>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/60 px-2 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
                placeholder="Patna Sahib"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                State
              </label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/60 px-2 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
                placeholder="Bihar"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/60 px-2 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
              >
                <option value="LOK_SABHA">Lok Sabha</option>
                <option value="VIDHAN_SABHA">Vidhan Sabha</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-1 w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-medium py-1.5 shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create"}
            </button>
          </motion.form>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Existing constituencies</h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Total: {list.length}
              </span>
            </div>

            {loading ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Loading...
              </p>
            ) : list.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No constituencies created yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 dark:bg-slate-800/70 text-[11px] text-slate-500 dark:text-slate-400 uppercase">
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">State</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Locked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-slate-100 dark:border-slate-800/70"
                      >
                        <td className="px-3 py-1.5">{c.name}</td>
                        <td className="px-3 py-1.5">{c.state}</td>
                        <td className="px-3 py-1.5">
                          {c.type === "LOK_SABHA"
                            ? "Lok Sabha"
                            : "Vidhan Sabha"}
                        </td>
                        <td className="px-3 py-1.5">
                          {c.isLocked ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default ConstituencyCRUD;
