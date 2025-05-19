import React from 'react';
import Layout from '../components/Layout';
import Previsualisation from '../components/client-report/Previsualisation';

import { useNavigate } from 'react-router-dom';

export default function ClientReportPage() {
  const navigate = useNavigate();

  return (
    <Layout showBackButton onBack={() => navigate(-1)}>
      <Previsualisation />
    </Layout>
  );
}
