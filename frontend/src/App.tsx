import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-medical-white">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
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

              {/* 404 */}
              <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;