
import React from 'react';
import AIAssistantComponent from '@/components/AIAssistant/AIAssistantComponent';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const AIAssistant: React.FC = () => {
  return (
    <Layout>
      <AIAssistantComponent />
    </Layout>
  );
};

export default AIAssistant;
