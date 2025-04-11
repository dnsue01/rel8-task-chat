
import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ContactDetail from "../components/contacts/ContactDetail";
import ContactSidebar from "../components/sidebar/ContactSidebar";
import { Loader2, ArrowLeft } from "lucide-react";
import { useCrm } from "../context/CrmContext";
import { Toaster } from "@/components/ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useIntegrations } from "../context/IntegrationsContext";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Componente de carga
const LoadingState = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 animate-spin text-primary" />
      <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Cargando datos...</h2>
      <p className="text-sm text-muted-foreground">Por favor espera mientras cargamos tu información</p>
    </div>
  </div>
);

const CrmApp = () => {
  const { isLoading, isAuthenticated, activeContactId, setActiveContactId } = useCrm();
  const { isGoogleConnected } = useIntegrations();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Check for Google auth callback
  useEffect(() => {
    // Check if there's a Google auth callback in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const googleAuthCode = urlParams.get('code');
    const googleAuthState = urlParams.get('state');
    
    if (googleAuthCode && googleAuthState === 'google_auth') {
      toast({
        title: "Google Auth",
        description: "Procesando autenticación de Google...",
      });
      
      // Clear the URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  const handleBackToList = () => {
    setActiveContactId(null);
  };

  return (
    <Layout>
      <div className="flex h-full flex-col md:flex-row">
        {/* On mobile, we conditionally show either the sidebar or the contact detail */}
        {isMobile ? (
          activeContactId ? (
            <div className="flex-1 overflow-auto bg-gray-50">
              <div className="sticky top-0 z-10 bg-white p-2 border-b flex items-center">
                <Button 
                  variant="ghost" 
                  onClick={handleBackToList}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a lista
                </Button>
              </div>
              <div className="p-4">
                <ContactDetail />
              </div>
            </div>
          ) : (
            <ContactSidebar />
          )
        ) : (
          // On desktop, we show both side by side
          <>
            <ContactSidebar />
            <div className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50">
              <ContactDetail />
            </div>
          </>
        )}
      </div>
      <Toaster />
    </Layout>
  );
};

export default CrmApp;
