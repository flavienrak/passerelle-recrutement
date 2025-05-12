import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Timer, Target } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import useTracking from '../hooks/useTracking';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();
  const { trackEvent, trackCTAClick } = useTracking();
  
  useEffect(() => {
    // Redirect if interview wasn't completed
    if (!userData.completedSteps.interviewCompleted) {
      navigate('/interview');
    }
  }, [userData, navigate]);
  
  const handleStartTest = () => {
    updateUserData({
      completedSteps: {
        testStarted: true
      }
    });
    
    trackCTAClick('start_test', '/test');
    navigate('/test');
  };
  
  return (
    <Layout currentStep={3} showBackButton onBack={() => navigate('/interview')}>
      <div className="flex flex-col items-center justify-center flex-1 px-4 h-[calc(100vh-theme(spacing.16))]">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-4">
            <div className="space-y-4 mb-4">
              <div className="flex items-center justify-center gap-3">
                <Brain className="w-8 h-8 text-[#FF6B00]/80" strokeWidth={1.5} />
                <h1 className="text-4xl font-bold whitespace-nowrap">Ton profil cognitif débloqué en 3 minutes</h1>
              </div>
            </div>
            
            <p className="text-[#FFF5E6] font-bold text-lg mb-2">
              Découvre l'analyse cognitive scientifique et professionnelle de ton profil.
            </p>
            
            <p className="text-base text-[#FFF5E6] font-bold mb-2">
              50% de chances en plus d'être recruté*
            </p>
            
            <img
              src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1745939927/SSSS_qrtybe.png"
              alt="Dashboard exemple"
              className="w-full max-w-xl mx-auto rounded-xl shadow-2xl mb-4 h-[40vh] object-cover"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <Button
              size="lg"
              onClick={handleStartTest}
              className="mb-3 py-3 px-8 text-xl font-semibold bg-gradient-to-r from-[#FF6B00] via-[#FF8124] to-[#FF6B00] bg-[length:200%_200%] hover:bg-[length:300%_300%] animate-[gradient_3s_ease-in-out_infinite] transition-all duration-300 shadow-lg shadow-[#FF6B00]/20"
            >
              Démarrer mon test
            </Button>
            
            <div className="bg-[#1A1E2E]/80 border border-[#FF6B00]/20 rounded-lg px-4 py-2 mb-2">
              <p className="text-gray-300 text-sm font-medium">
                Bonus Ai Training : prépa cognitive pour réussir tes entretiens.
              </p>
            </div>

            <p className="text-gray-400 text-sm italic">
              Source : Harvard Business Review, Hunter & Schmidt*
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;