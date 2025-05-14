import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CVUploadPage from './pages/CVUploadPage';
import InterviewQuestionsPage from './pages/InterviewQuestionsPage';
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import MicroFormationPage from './pages/MicroFormationPage';
import ReportingPage from './pages/ReportingPage';
import { UserProvider } from './providers/User.provider';
import ReduxProvider from './providers/Redux.provider';

function App() {
  return (
    <BrowserRouter>
      <ReduxProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cv-upload" element={<CVUploadPage />} />
            <Route path="/interview" element={<InterviewQuestionsPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/formation" element={<MicroFormationPage />} />
            <Route path="/reporting" element={<ReportingPage />} />
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
