import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuthRehydration } from "./hooks/useAuthRehydration";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthStep from "./pages/auth/AuthStep";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Signup from "./pages/auth/CreatorSignUp";
import StudentVerify from "./pages/auth/StudentVerify";
import CreatorIndex from "./pages/creator/Index";
import BrandIndex from "./pages/brand/Index";
import AdminIndex from "./pages/admin";

const queryClient = new QueryClient();

const App = () => {
  // Initialize auth rehydration
  useAuthRehydration();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="nexa-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthStep />} />
              <Route path="/signup/:role" element={<Signup />} />
              <Route path="/auth/:loginType" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/student-verify" element={
                <ProtectedRoute allowedRoles={['creator', 'student']}>
                  <StudentVerify />
                </ProtectedRoute>
              } />
              <Route path="/creator" element={
                <ProtectedRoute allowedRoles={['creator', 'student']}>
                  <CreatorIndex />
                </ProtectedRoute>
              } />
              <Route path="/brand" element={
                <ProtectedRoute allowedRoles={['brand']}>
                  <BrandIndex />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminIndex />
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
