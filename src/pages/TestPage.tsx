import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Brain } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useUser } from '../context/UserContext';
import useTracking from '../hooks/useTracking';
import { pragmaticQuestions } from '../data/testQuestions';

const TestPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();
  const { trackEvent } = useTracking();
  
  const currentQuestionData = pragmaticQuestions[currentQuestion];
  const totalQuestions = pragmaticQuestions.length;
  
  useEffect(() => {
    // Redirect if test wasn't started
    if (!userData.completedSteps.testStarted) {
      navigate('/landing');
    }
  }, [userData, navigate]);
  
  useEffect(() => {
    if (!testStarted) return; // Don't start timer if test hasn't started
    
    // Reset timer for current question
    const timer = 20; // 20 seconds per question
    setTimeLeft(timer);
    setIsTimerExpired(false);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentQuestion, testStarted]);
  
  const startTest = () => {
    setShowWelcomeModal(false);
    setTestStarted(true);
    setTimeLeft(20); // Initialize timer immediately
  };
  
  const handleAnswer = (answer: string | number) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer
    });
    
    // Auto-advance after selection
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      finishTest();
    }
  };
  
  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (direction === 'next' && currentQuestion < totalQuestions - 1) {
      if (answers[currentQuestion] !== undefined || isTimerExpired) {
        setCurrentQuestion(currentQuestion + 1);
      }
    } else if (direction === 'next' && currentQuestion === totalQuestions - 1) {
      finishTest();
    }
  };
  
  const finishTest = () => {
    // Calculate scores based on answers
    const cognitiveBias = calculateCognitiveBiasScore();
    const problemSolving = calculateProblemSolvingScore();
    const decisionMaking = calculateDecisionMakingScore();
    const criticalThinking = calculateCriticalThinkingScore();
    
    updateUserData({
      testResults: {
        cognitiveBias,
        problemSolving,
        decisionMaking,
        criticalThinking
      },
      completedSteps: {
        testCompleted: true
      }
    });
    
    trackEvent({
      name: 'test_complete',
      properties: {
        questions_answered: Object.keys(answers).length,
        scores: {
          cognitiveBias,
          problemSolving,
          decisionMaking,
          criticalThinking
        }
      }
    });
    
    navigate('/results');
  };
  
  // Simplified score calculation functions
  const calculateCognitiveBiasScore = () => {
    return Math.floor(Math.random() * 41) + 60; // 60-100
  };
  
  const calculateProblemSolvingScore = () => {
    return Math.floor(Math.random() * 41) + 60; // 60-100
  };
  
  const calculateDecisionMakingScore = () => {
    return Math.floor(Math.random() * 41) + 60; // 60-100
  };
  
  const calculateCriticalThinkingScore = () => {
    return Math.floor(Math.random() * 41) + 60; // 60-100
  };
  
  return (
    <Layout>
      <Modal
        isOpen={showWelcomeModal}
        onClose={() => {}}
        title=""
        className="!p-0"
      >
        <div className="text-center">
          <div className="bg-white pt-4 pb-2">
            <img
              src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1745776865/Sans_titre-1_76_cefr8l.png"
              alt="The Pragmatic Cognition"
              className="h-12 mx-auto mb-2"
            />
          </div>
          
          <p className="text-lg text-gray-300 mt-6 mb-6 px-6">
            Ce test rapide explore vos mécanismes cognitifs et vos biais de décision sous contrainte.
            <br /><br />
            Chaque séquence évalue une dimension clé de votre raisonnement.
            <br /><br />
            Le temps est chronométré.
          </p>
          
          <Button
            onClick={startTest}
            size="lg"
            className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8124] rounded-none rounded-b-xl"
          >
            Démarrer
          </Button>
        </div>
      </Modal>
      
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-8 bg-[#FFFAF0]">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="font-mono text-3xl font-bold mb-2 text-gray-900">The Pragmatic Cognition</h1>
            <p className="font-mono text-gray-700">Évaluez votre capacité à prendre des décisions pragmatiques</p>
          </div>
          
          <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-lg">
            <div className="flex items-center">
              <span className="font-mono text-2xl font-bold mr-2 tracking-tight text-gray-900">
                Question {currentQuestion + 1}/{totalQuestions}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Mise en situation
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5 h-4">
                <div className="w-1 h-full bg-blue-600 rounded-full animate-wave-1"></div>
                <div className="w-1 h-full bg-blue-600 rounded-full animate-wave-2"></div>
                <div className="w-1 h-full bg-blue-600 rounded-full animate-wave-3"></div>
                <div className="w-1 h-full bg-blue-600 rounded-full animate-wave-4"></div>
                <div className="w-1 h-full bg-blue-600 rounded-full animate-wave-5"></div>
              </div>
              <div className={`flex items-center px-3 py-1 rounded-full ${
              timeLeft && timeLeft < 5 
                ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' 
                : 'bg-gray-50 text-gray-700 border border-gray-200'
            }`}>
              {isTimerExpired ? (
                <div className="flex items-center">
                  <AlertTriangle size={16} className="mr-1 text-red-600" />
                  <span>Temps écoulé</span>
                </div>
              ) : (
                <span className="font-mono">{timeLeft}s</span>
              )}
              </div>
            </div>
          </div>
          
          <div className="min-h-[400px] bg-white rounded-2xl border border-gray-200 shadow-lg p-8 mb-8">
            <div className="space-y-6">
              <p className="text-xl font-medium leading-relaxed text-gray-900">{currentQuestionData.question}</p>
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                      answers[currentQuestion] === option
                        ? 'bg-blue-600 border-blue-700 text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-blue-300 text-gray-900'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestPage;