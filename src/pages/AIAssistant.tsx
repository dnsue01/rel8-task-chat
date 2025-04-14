
import React from 'react';
import AIAssistantComponent from '@/components/AIAssistant/AIAssistantComponent';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const AIAssistant: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const contactId = searchParams.get('contactId');

  return (
    <Layout>
      <AIAssistantComponent contactId={contactId} />
    </Layout>
  );
};

export default AIAssistant;
