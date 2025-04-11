
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CrmApp from "./pages/CrmApp";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { CrmProvider, useCrm } from "./context/CrmContext";
import { IntegrationsProvider } from "./context/IntegrationsContext";
import IntegrationsPage from "./pages/IntegrationsPage";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";

// Protected route component to ensure authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useCrm();
  
  // While checking authentication status, show loading
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // If authenticated, render children
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <CrmProvider>
        <IntegrationsProvider>
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
            <Route 
              path="/integrations" 
              element={
                <ProtectedRoute>
                  <IntegrationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-assistant" 
              element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              } 
            />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </IntegrationsProvider>
      </CrmProvider>
    </Router>
  );
}

export default App;
