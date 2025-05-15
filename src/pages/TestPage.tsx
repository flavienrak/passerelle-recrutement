import React from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Modal from '../components/Modal';

import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { updatePersistReducer } from '../redux/slices/persist.slice';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { testQuestions } from '../lib/constants';
import { TestInterviewInterface } from '../interfaces/TestInterview.interface';
import { updateUserReducer } from '../redux/slices/user.slice';
import { CvInterface } from '../interfaces/Cv.interface';

export default function TestPage() {
  const duration = 30;
  const { email, timer, currentQuestion } = useSelector(
    (state: RootState) => state.persistInfos
  );
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(true);
  const [cvData, setCvData] = React.useState<CvInterface | null>(null);
  const [tests, setTests] = React.useState<TestInterviewInterface>({
    answers: [],
  });
  const [currentAnswer, setCurrentAnswer] = React.useState<{
    value: string;
    score: number;
    index: number;
  } | null>(null);

  const [timeLeft, setTimeLeft] = React.useState<number>(timer);
  const [timerExpired, setTimerExpired] = React.useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(true);
  const [testStarted, setTestStarted] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!email) {
      navigate('/');
    } else {
      (async () => {
        setIsLoading(true);

        const testsDocRef = doc(db, 'tests', email);
        const testsDocSnap = await getDoc(testsDocRef);

        if (testsDocSnap.exists()) {
          const data = testsDocSnap.data();
          dispatch(updateUserReducer({ tests: data }));
          setTests(data);
        }

        const cvDocRef = doc(db, 'cvs', email);
        const cvDocSnap = await getDoc(cvDocRef);

        if (cvDocSnap.exists()) {
          const data: CvInterface = cvDocSnap.data();
          setCvData(data);
        }

        setIsLoading(false);
      })();
    }
  }, [email]);

  React.useEffect(() => {
    if (!isLoading) {
      if (cvData?.completedSteps && cvData.completedSteps.testCompleted) {
        navigate('/results');
      } else {
        dispatch(
          updatePersistReducer({
            currentQuestion: tests.answers ? tests.answers.length : 0,
          })
        );
      }
    }
  }, [isLoading, cvData, tests.answers]);

  React.useEffect(() => {
    if (testStarted) {
      // Reset timer for current question
      setTimeLeft(timer);

      if (timer > 0) {
        const interval = setInterval(() => {
          dispatch(updatePersistReducer({ timer: timer - 1 }));
        }, 1000);

        return () => {
          clearInterval(interval);
        };
      } else {
        setTimerExpired(true);
      }
    }
  }, [testStarted, timer]);

  React.useEffect(() => {
    if (currentAnswer) {
      (async () => {
        const interviewsDocRef = doc(db, 'tests', email);

        await setDoc(
          interviewsDocRef,
          {
            answers: arrayUnion({
              answer: currentAnswer.value,
              score: currentAnswer.score,
              answerIndex: currentAnswer.index,
              timeLeft: timer,
              timeExpired: timerExpired,
              question: testQuestions[currentQuestion].question,
              questionNumber: currentQuestion,
            }),
          },
          { merge: true }
        );

        if (currentQuestion < testQuestions.length - 1) {
          dispatch(
            updatePersistReducer({
              timer: duration,
              currentQuestion: currentQuestion + 1,
            })
          );
        } else {
          await setDoc(
            doc(db, 'cvs', email),
            { email, completedSteps: { testCompleted: true } },
            { merge: true }
          );

          navigate('/results');
        }

        setCurrentAnswer(null);
      })();
    }
  }, [currentAnswer]);

  const startTest = () => {
    setShowWelcomeModal(false);
    setTestStarted(true);
  };

  if (currentQuestion < testQuestions.length)
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
              Ce test rapide explore vos mécanismes cognitifs et vos biais de
              décision sous contrainte.
              <br />
              <br />
              Chaque séquence évalue une dimension clé de votre raisonnement.
              <br />
              <br />
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
              <h1 className="font-mono text-3xl font-bold mb-2 text-gray-900">
                The Pragmatic Cognition
              </h1>
              <p className="font-mono text-gray-700">
                Évaluez votre capacité à prendre des décisions pragmatiques
              </p>
            </div>

            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-lg">
              <div className="flex items-center">
                <span className="font-mono text-2xl font-bold mr-2 tracking-tight text-gray-900">
                  Question {currentQuestion + 1}/{testQuestions.length}
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
                <div
                  className={`flex items-center px-3 py-1 rounded-full ${
                    timeLeft && timeLeft < 5
                      ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                      : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}
                >
                  {timerExpired ? (
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
                <p className="text-xl font-medium leading-relaxed text-gray-900">
                  {testQuestions[currentQuestion].question}
                </p>
                <div className="space-y-3">
                  {testQuestions[currentQuestion].options.map((item, index) => (
                    <button
                      key={`response-index-${index}`}
                      onClick={() => setCurrentAnswer({ ...item, index })}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                        currentAnswer?.value === item.value
                          ? 'bg-blue-600 border-blue-700 text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-blue-300 text-gray-900'
                      }`}
                    >
                      {item.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
}
