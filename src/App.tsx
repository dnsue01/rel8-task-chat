
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CrmApp from "./pages/CrmApp";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import IntegrationsPage from "./pages/IntegrationsPage";
import { CrmProvider, useCrm } from "./context/CrmContext";
import { IntegrationsProvider } from "./context/IntegrationsContext";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useCrm();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CrmProvider>
        <IntegrationsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/app" 
                element={
                  <ProtectedRoute>
                    <CrmApp />
                  </ProtectedRoute>
                } 
              />
              <Route path="/integrations" element={
                <ProtectedRoute>
                  <IntegrationsPage />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </IntegrationsProvider>
      </CrmProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
