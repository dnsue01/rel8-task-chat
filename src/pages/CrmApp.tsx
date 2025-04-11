
import React from "react";
import Layout from "../components/layout/Layout";
import ContactDetail from "../components/contacts/ContactDetail";
import ContactSidebar from "../components/sidebar/ContactSidebar";
import { Loader2 } from "lucide-react";
import { useCrm } from "../context/CrmContext";
import { Toaster } from "@/components/ui/toaster";

// Componente de carga
const LoadingState = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="mx-auto h-12 w-12 mb-4 animate-spin text-primary" />
      <h2 className="text-xl font-semibold mb-2">Cargando datos...</h2>
      <p className="text-muted-foreground">Por favor espera mientras cargamos tu información</p>
    </div>
  </div>
);

const CrmApp = () => {
  const { isLoading } = useCrm();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Layout>
      <div className="flex h-full">
        <ContactSidebar />
        <div className="flex-1 p-6 overflow-auto bg-gray-50">
          <ContactDetail />
        </div>
      </div>
      <Toaster />
    </Layout>
  );
};

export default CrmApp;
