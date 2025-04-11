
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CrmApp from "./pages/CrmApp";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { CrmProvider } from "./context/CrmContext";
import { IntegrationsProvider } from "./context/IntegrationsContext";
import IntegrationsPage from "./pages/IntegrationsPage";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";

function App() {
  return (
    <Router>
      <CrmProvider>
        <IntegrationsProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/app" element={<CrmApp />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
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
