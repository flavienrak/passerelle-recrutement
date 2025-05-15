import React from 'react';
import NeuroPulseLogo from './NeuroPulseLogo';
import ProgressIndicator from './ProgressIndicator';

import { useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  currentStep?: number;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showBackButton = false,
  onBack,
  currentStep = 0,
}) => {
  const location = useLocation();
  const isTestPage = location.pathname === '/test';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E17] to-[#1A1E2E] text-white flex flex-col">
      <header className="w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-800/50 transition-colors"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
          )}
          <NeuroPulseLogo />
        </div>

        {currentStep > 0 && !isTestPage && (
          <div className="hidden md:block w-64">
            <ProgressIndicator currentStep={currentStep} totalSteps={6} />
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="py-4 px-6 text-center text-gray-400 text-sm">
        <p>
          © {new Date().getFullYear()} La Passerelle Recrutement. Tous droits
          réservés.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
