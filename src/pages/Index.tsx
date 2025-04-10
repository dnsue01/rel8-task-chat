
import React from "react";
import Layout from "../components/layout/Layout";
import ContactDetail from "../components/contacts/ContactDetail";
import { CrmProvider } from "../context/CrmContext";

const Index = () => {
  return (
    <CrmProvider>
      <Layout>
        <ContactDetail />
      </Layout>
    </CrmProvider>
  );
};

export default Index;
