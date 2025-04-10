
import React from "react";
import Layout from "../components/layout/Layout";
import ContactDetail from "../components/contacts/ContactDetail";
import { CrmProvider } from "../context/CrmContext";

const CrmApp = () => {
  return (
    <CrmProvider>
      <Layout>
        <ContactDetail />
      </Layout>
    </CrmProvider>
  );
};

export default CrmApp;
