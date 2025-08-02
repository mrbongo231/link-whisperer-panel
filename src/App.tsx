import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { LinksPage } from "./pages/LinksPage";
import { UsersPage } from "./pages/UsersPage";
import { StatusPage } from "./pages/StatusPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <div className="dark">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPageWrapper />} />
              <Route path="/dashboard/links" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <LinksPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/users" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <UsersPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/status" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <StatusPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard/links" replace />} />
              <Route path="/dashboard" element={<Navigate to="/dashboard/links" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const LoginPageWrapper = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
};

export default App;
