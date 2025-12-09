import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/Layout/AdminLayout.jsx";
import { motion } from "framer-motion";

const UserCRUD = () => {
  const [users, setUsers] = useState([]);
  const [constituencies, setConst] = useState([]);
  const [booths, setBooths] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "WORKER",
    constituency: "",
    assignedBooths: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [userRes, constRes, boothRes] = await Promise.all([
        axiosClient.get("/users"),
        axiosClient.get("/constituencies"),
        axiosClient.get("/booths"),
      ]);
      setUsers(userRes.data || []);
      setConst(constRes.data || []);
      setBooths(boothRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBoothToggle = (boothId) => {
    setForm((prev) => {
      const exists = prev.assignedBooths.includes(boothId);
      return {
        ...prev,
        assignedBooths: exists
          ? prev.assignedBooths.filter((id) => id !== boothId)
          : [...prev.assignedBooths, boothId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      };

      if (form.role === "LEADER" && form.constituency) {
        payload.constituency = form.constituency;
      }

      if (form.role === "WORKER" && form.assignedBooths.length) {
        payload.assignedBooths = form.assignedBooths;
      }

      await axiosClient.post("/users", payload);
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "WORKER",
        constituency: "",
        assignedBooths: [],
      });
      await load();
      setMessage("User created successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Error creating user.");
    } finally {
      setSaving(false);
    }
  };

  const workers = users.filter((u) => u.role === "WORKER");
  const leaders = users.filter((u) => u.role === "LEADER");
  const admins = users.filter((u) => u.role === "ADMIN");

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            User Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create workers, leaders, and additional admins.
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
            <h3 className="text-sm font-semibold">Add user</h3>

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
                placeholder="Worker One"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/60 px-2 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
                placeholder="user@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                Phone (optional)
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/60 px-2 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
                placeholder="9999999999"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/60 px-2 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/60 px-2 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
              >
                <option value="WORKER">Worker</option>
                <option value="LEADER">Leader</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {form.role === "LEADER" && (
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                  Constituency (for leader)
                </label>
                <select
                  name="constituency"
                  value={form.constituency}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/60 px-2 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
                >
                  <option value="">Select constituency</option>
                  {constituencies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {form.role === "WORKER" && (
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400">
                  Assigned booths (for worker)
                </label>
                <div className="max-h-32 overflow-auto border border-slate-200 dark:border-slate-800 rounded-lg p-2 space-y-1 bg-slate-50/60 dark:bg-slate-950/40">
                  {booths.map((b) => (
                    <label
                      key={b._id}
                      className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={form.assignedBooths.includes(b._id)}
                        onChange={() => handleBoothToggle(b._id)}
                      />
                      <span>
                        #{b.boothNumber} – {b.name}
                      </span>
                    </label>
                  ))}
                  {booths.length === 0 && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-500">
                      No booths available yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-1 w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-medium py-1.5 shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create user"}
            </button>
          </motion.form>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 space-y-3"
          >
            <UserSection title="Admins" users={admins} />
            <UserSection title="Leaders" users={leaders} />
            <UserSection title="Workers" users={workers} />
          </motion.div>
        </section>
      </div>
    </AdminLayout>
  );
};

const UserSection = ({ title, users }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm p-3">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-sm font-semibold">{title}</h3>
      <span className="text-[11px] text-slate-500 dark:text-slate-400">
        {users.length}
      </span>
    </div>
    {users.length === 0 ? (
      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        None yet.
      </p>
    ) : (
      <div className="overflow-x-auto max-h-40">
        <table className="min-w-full text-[11px]">
          <thead>
            <tr className="bg-slate-100/80 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 uppercase">
              <th className="px-2 py-1 text-left">Name</th>
              <th className="px-2 py-1 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-b border-slate-100 dark:border-slate-800/70"
              >
                <td className="px-2 py-1">{u.name}</td>
                <td className="px-2 py-1">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default UserCRUD;
