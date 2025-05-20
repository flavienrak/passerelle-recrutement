import React, { Suspense } from 'react';
import Loader from './components/Loader';
import ReduxProvider from './providers/Redux.provider';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const UserLayout = React.lazy(() => import('./layouts/UserLayout'));
const CvUploadPage = React.lazy(() => import('./pages/CvUploadPage'));
const InterviewQuestionsPage = React.lazy(
  () => import('./pages/InterviewQuestionsPage')
);
const TestLanding = React.lazy(() => import('./pages/TestLanding'));
const TestPage = React.lazy(() => import('./pages/TestPage'));
const ResultsPage = React.lazy(() => import('./pages/ResultsPage'));
const MicroFormationPage = React.lazy(
  () => import('./pages/MicroFormationPage')
);
const ReportingPage = React.lazy(() => import('./pages/ReportingPage'));
const PrevisualisationPage = React.lazy(
  () => import('./pages/PrevisualisationPage')
);
const ConditionsPage = React.lazy(() => import('./pages/ConditionsPage'));

export default function App() {
  return (
    <BrowserRouter>
      <ReduxProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loader />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/conditions"
            element={
              <Suspense fallback={<Loader />}>
                <ConditionsPage />
              </Suspense>
            }
          />

          <Route
            path="/cv-upload"
            element={
              <Suspense fallback={<Loader />}>
                <CvUploadPage />
              </Suspense>
            }
          />
          <Route
            path="/:userId"
            element={
              <Suspense fallback={<Loader />}>
                <UserLayout />
              </Suspense>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<Loader />}>
                  <PrevisualisationPage />
                </Suspense>
              }
            ></Route>
            <Route
              path="interview"
              element={
                <Suspense fallback={<Loader />}>
                  <InterviewQuestionsPage />
                </Suspense>
              }
            ></Route>
            <Route
              path="test-landing"
              element={
                <Suspense fallback={<Loader />}>
                  <TestLanding />
                </Suspense>
              }
            ></Route>
            <Route
              path="test"
              element={
                <Suspense fallback={<Loader />}>
                  <TestPage />
                </Suspense>
              }
            ></Route>
            <Route
              path="results"
              element={
                <Suspense fallback={<Loader />}>
                  <ResultsPage />
                </Suspense>
              }
            ></Route>
            <Route
              path="formation"
              element={
                <Suspense fallback={<Loader />}>
                  <MicroFormationPage />
                </Suspense>
              }
            ></Route>
            <Route
              path="reporting"
              element={
                <Suspense fallback={<Loader />}>
                  <ReportingPage />
                </Suspense>
              }
            ></Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ReduxProvider>
    </BrowserRouter>
  );
}
