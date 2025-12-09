import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth & Routing
import ProtectedRoute from "./components/Layout/ProtectedRoute.jsx";

// Pages
import LoginPage from "./pages/auth/LoginPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import WorkerDashboard from "./pages/worker/WorkerDashboard.jsx";
import LeaderDashboard from "./pages/leader/LeaderDashboard.jsx";
import ConstituencyCRUD from "./pages/admin/ConstituencyCRUD.jsx";
import BoothCRUD from "./pages/admin/BoothCRUD.jsx";
import PartyCRUD from "./pages/admin/PartyCRUD.jsx";
import UserCRUD from "./pages/admin/UserCRUD.jsx";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/constituencies"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ConstituencyCRUD />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/booths"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <BoothCRUD />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/parties"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <PartyCRUD />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <UserCRUD />
          </ProtectedRoute>
        }
      />

      {/* Worker Route */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={["WORKER"]}>
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Leader Route */}
      <Route
        path="/leader"
        element={
          <ProtectedRoute allowedRoles={["LEADER"]}>
            <LeaderDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirect any unknown route to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
