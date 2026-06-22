import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { ROUTES } from "./constants";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Analyzer from "./pages/Analyzer";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import MedicineInfo from "./pages/MedicineInfo";
import HospitalFinder from "./pages/HospitalFinder";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Auth Guard
import { useAuthStore } from "./store/authStore";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import TimelinePage from "./pages/Timeline";
import Emergency from "./pages/Emergency";
import OCR from "./pages/OCR";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyNotice from "./pages/VerifyNotice";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminLayout from "./components/layout/AdminLayout";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  if (user && !user.isVerified) {
    return <Navigate to={ROUTES.VERIFY_NOTICE} replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return <>{children}</>;
};

const AdminRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || user?.role !== "admin" || !user.isVerified) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return <>{children}</>;
};

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-medical-white">
      {!isAdminPath && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route
              path={ROUTES.LOGIN}
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path={ROUTES.REGISTER}
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
        <Route path={ROUTES.VERIFY_NOTICE} element={<VerifyNotice />} />

            {/* Protected Routes */}
            <Route
              path={ROUTES.ANALYZER}
              element={
                <ProtectedRoute>
                  <Analyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CHAT}
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.MEDICINE}
              element={
                <ProtectedRoute>
                  <MedicineInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.HOSPITALS}
              element={
                <ProtectedRoute>
                  <HospitalFinder />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.TIMELINE}
              element={
                <ProtectedRoute>
                  <TimelinePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.REPORTS}
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.EMERGENCY}
              element={
                <ProtectedRoute>
                  <Emergency />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.OCR}
              element={
                <ProtectedRoute>
                  <OCR />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path={ROUTES.ADMIN_DASHBOARD}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN_USERS}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN_AI}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <div className="p-20 text-center space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-200">
                        <Activity size={32} />
                      </div>
                      <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.4em]">Extensive AI Analytics Sector Offline</p>
                    </div>
                  </AdminLayout>
                </AdminRoute>
              }
            />

            {/* 404 */}
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminPath && <Footer />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;