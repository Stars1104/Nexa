import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "./components/ThemeProvider";
import { store } from "./store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthStep from "./pages/auth/AuthStep";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Signup from "./pages/auth/CreatorSignUp";
import StudentVerify from "./pages/auth/StudentVerify";
import CreatorIndex from "./pages/creator/Index";
import BrandIndex from "./pages/brand/Index";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/student-verify" element={<StudentVerify />} />
              <Route path="/creator/:component" element={<CreatorIndex />} />
              <Route path="/brand/:component" element={<BrandIndex />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
