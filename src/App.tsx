import React from 'react';
import HomePage from './pages/HomePage';
import CvUploadPage from './pages/CvUploadPage';
import InterviewQuestionsPage from './pages/InterviewQuestionsPage';
import TestLanding from './pages/TestLanding';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import MicroFormationPage from './pages/MicroFormationPage';
import ReportingPage from './pages/ReportingPage';
import ReduxProvider from './providers/Redux.provider';
import UserProvider from './providers/User.provider';
import PrevisualisationPage from './pages/PrevisualisationPage';
import ConditionsPage from './pages/ConditionsPage';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ReduxProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/conditions" element={<ConditionsPage />} />
            <Route path="/cv-upload" element={<CvUploadPage />} />
            <Route path="/interview" element={<InterviewQuestionsPage />} />
            <Route path="/test-landing" element={<TestLanding />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/formation" element={<MicroFormationPage />} />
            <Route path="/reporting" element={<ReportingPage />} />
            <Route
              path="/previsualisation/:candidateEmail"
              element={<PrevisualisationPage />}
            />
            <Route
              path="/client-report/:candidateEmail"
              element={<ReportingPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UserProvider>
      </ReduxProvider>
    </BrowserRouter>
  );
}

export default App;
