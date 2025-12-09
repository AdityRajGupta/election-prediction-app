import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/Layout/AdminLayout.jsx";
import { motion } from "framer-motion";

const PartyCRUD = () => {
  const [parties, setParties] = useState([]);
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    logoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/parties");
      setParties(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load parties.");
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
      await axiosClient.post("/parties", form);
      setForm({ name: "", shortName: "", logoUrl: "" });
      await load();
      setMessage("Party created successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Error creating party.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            Party Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage list of political parties used in predictions.
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
            <h3 className="text-sm font-semibold">Add party</h3>

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
                placeholder="Bharatiya Janata Party"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                Short name
              </label>
              <input
                name="shortName"
                value={form.shortName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/60 px-2 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
                placeholder="BJP"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                Logo URL (optional)
              </label>
              <input
                name="logoUrl"
                value={form.logoUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/60 px-2 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
                placeholder="https://..."
              />
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
              <h3 className="text-sm font-semibold">Existing parties</h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Total: {parties.length}
              </span>
            </div>

            {loading ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Loading...
              </p>
            ) : parties.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No parties created yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 dark:bg-slate-800/70 text-[11px] text-slate-500 dark:text-slate-400 uppercase">
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Short</th>
                      <th className="px-3 py-2 text-left">Logo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parties.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b border-slate-100 dark:border-slate-800/70"
                      >
                        <td className="px-3 py-1.5">{p.name}</td>
                        <td className="px-3 py-1.5">{p.shortName}</td>
                        <td className="px-3 py-1.5">
                          {p.logoUrl ? (
                            <a
                              href={p.logoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-blue-600 dark:text-blue-300 underline"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-500 dark:text-slate-500">
                              —
                            </span>
                          )}
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

export default PartyCRUD;
