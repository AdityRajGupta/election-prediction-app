import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Overview", path: "/admin" },
  { label: "Constituencies", path: "/admin/constituencies" },
  { label: "Booths", path: "/admin/booths" },
  { label: "Parties", path: "/admin/parties" },
  { label: "Users", path: "/admin/users" },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <div className="flex h-screen max-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
          <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                EP
              </div>
              <div>
                <p className="font-semibold text-sm">Election Predictor</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <p>Logged in as</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {user?.name || "Admin"}
            </p>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 md:hidden">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                EP
              </div>
              <span className="text-sm font-semibold">Admin Dashboard</span>
            </div>

            <div className="hidden md:block">
              <h1 className="text-lg font-semibold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monitor predictions, control access, and manage entities.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background:
                      theme === "dark"
                        ? "linear-gradient(to bottom right,#4ade80,#22c55e)"
                        : "linear-gradient(to bottom right,#3b82f6,#6366f1)",
                  }}
                ></span>
                {theme === "dark" ? "Dark" : "Light"} mode
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 shadow-sm"
              >
                Logout
              </button>
            </div>
          </header>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 bg-slate-50/70 dark:bg-slate-950/80">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
