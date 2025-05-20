import React from 'react';
import Button from '../components/Button';

import { useNavigate, useParams } from 'react-router-dom';
import {
  Brain,
  Target,
  Shield,
  Users,
  ArrowRight,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { initialMatrice } from '../lib/constants';
import { MatriceValueInterface } from '../interfaces/client-report/MatriceValue.interface';
import {
  extractJson,
  getGlobalValueForScore,
  getValueForScore,
  percentage,
} from '../lib/function';
import { chat } from '../lib/openai';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { updateUserReducer } from '../redux/slices/user.slice';
import { highWeakSynthese } from '../lib/prompts';

export default function ResultsPage() {
  const { tests, cv } = useSelector((state: RootState) => state.user);
  const { userId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingSendReport, setLoadinSendReport] = React.useState(false);
  const [globalScore, setGlobalScore] = React.useState(0);
  const [values, setValues] = React.useState<MatriceValueInterface>({
    m1: 0,
    m2: 0,
    m3: 0,
    m4: 0,
    m5: 0,
    m6: 0,
    m7: 0,
  });

  React.useEffect(() => {
    if (userId && cv && tests.answers) {
      if (
        !cv.completedSteps ||
        (cv.completedSteps && !cv.completedSteps.testCompleted)
      ) {
        navigate(`/${userId}/test`);
      } else {
        (async () => {
          const finalValues = {} as MatriceValueInterface;

          // 1️⃣ On calcule d'abord la moyenne
          const withMoyennes = initialMatrice.map((item) => {
            const scores = item.value
              .map(
                (qn) =>
                  tests.answers?.find((a) => a.questionNumber === qn)?.score ??
                  null
              )
              .filter((s): s is number => s !== null);

            const moyenne =
              scores.length > 0
                ? scores.reduce((a, b) => a + b, 0) / scores.length
                : 0;

            return {
              ...item,
              result: parseFloat(moyenne.toFixed(2)),
            };
          });

          // 2️⃣ On applique sur ces moyennes tes règles (opt, bonus/malus, modulo 5)
          withMoyennes.map((item) => {
            const optResult =
              withMoyennes.find((x) => x.id === item.opt)?.result ?? 0;
            let r = item.result;

            if (optResult > 0.75) r += 0.02;
            else if (optResult < 0.4) r -= 0.03;

            // modulo 5 aléatoire
            if (Math.ceil(r * 100) % 5 === 0) {
              r += Math.random() < 0.5 ? -0.03 : 0.03;
            }

            r = parseFloat(r.toFixed(2));
            finalValues[`m${item.id}` as keyof MatriceValueInterface] =
              Math.max(0, Math.min(1, r));
          });

          // 3️⃣ On met tout à jour **une seule fois**
          setValues(finalValues);

          if (!tests.highContent || !tests.weakContent) {
            const messageContent = `
              Sens de l'efficacité : ${percentage(finalValues.m1)}%\n
              Analyse des situations : ${percentage(finalValues.m2)}%\n
              Vision des problématiques : ${percentage(finalValues.m3)}%\n
              Force créative : ${percentage(finalValues.m4)}%\n
              Indépendance relationnelle : ${percentage(finalValues.m5)}%\n
              Remise en question constructive : ${percentage(finalValues.m6)}%\n
              Agilité à piloter en s'adaptant : ${percentage(finalValues.m7)}%
            `;

            const openaiResponse = await chat([
              { role: 'system', content: highWeakSynthese.trim() },
              { role: 'user', content: messageContent.trim() },
            ]);

            if (openaiResponse.content) {
              const jsonData: { highContent: string; weakContent: string } =
                extractJson(openaiResponse.content);

              await setDoc(
                doc(db, 'tests', userId),
                {
                  highContent: jsonData.highContent,
                  weakContent: jsonData.weakContent,
                },
                { merge: true }
              );

              const testsDocSnap = await getDoc(doc(db, 'tests', userId));

              if (testsDocSnap.exists()) {
                const data = testsDocSnap.data();
                dispatch(updateUserReducer({ tests: data }));
              }
            }
          }
        })();
      }
    }
  }, [userId, cv, tests]);

  React.useEffect(() => {
    if (values) {
      const average = parseFloat(
        (
          Object.values(values).reduce((sum, val) => sum + val, 0) /
          Object.values(values).length
        ).toFixed(2)
      );

      // Générer un ajustement aléatoire entre +0 et +0.07 ou entre -0 et -0.05
      const random = Math.random(); // [0, 1)
      const adjustment =
        random < 0.5
          ? parseFloat((random * 0.07).toFixed(2)) // entre 0 et 0.07
          : -parseFloat((random * 0.05).toFixed(2)); // entre -0 et -0.05

      const adjustedAverage = parseFloat((average + adjustment).toFixed(2));
      setGlobalScore(adjustedAverage);
    }
  }, [values]);

  const handleSendReport = () => {
    // Simulate sending email
    setLoadinSendReport(true);
    setTimeout(() => {
      navigate(`/${userId}/formation`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-12">
          <img
            src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1745776865/Sans_titre-1_76_cefr8l.png"
            alt="The Pragmatic Cognition"
            className="h-12 mx-auto"
          />
        </div>

        {/* Header with Score and Text */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8 items-center mb-16">
          {/* Left side - Text */}
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-gray-800">
              Tendances observées de ton profil cognitif en situation
            </h2>
            <p className="text-[#FF6B00] font-medium">
              Découvrez vos tendances de réaction en situation terrain.
            </p>
          </div>

          {/* Right side - Score */}
          <div className="flex justify-center">
            <div className="w-48 h-48 relative">
              <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
              <motion.div
                className="absolute inset-0 rounded-full border-8 border-[#FF6B00] transition-all duration-1000 ease-out"
                style={{
                  clipPath: 'inset(0 0 0 0)',
                  transform: 'rotate(-90deg)',
                }}
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0 0 0)' }}
                transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
              ></motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.span
                    className="text-5xl font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.5 }}
                  >
                    {percentage(globalScore)}%
                  </motion.span>
                </div>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <p className="text-lg font-medium text-gray-600">
                  Score Global
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Forces et axes de progression */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Forces et Axes de Progression
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Force Principale
                </h3>
                <p className="text-gray-700 leading-5 whitespace-pre-line">
                  {tests.highContent}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1">
                <ArrowRight className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Axe d'Amélioration
                </h3>
                <p className="text-gray-700 leading-5 whitespace-pre-line">
                  {tests.weakContent}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats détaillés */}
        <div className="space-y-12 mb-16">
          {/* Pilotage Stratégique */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <Brain className="w-7 h-7 text-rose-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Pilotage Stratégique
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    Sens de l'efficacité
                  </span>
                  <motion.span
                    className="font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    {percentage(values.m1)}%
                  </motion.span>
                </div>
                <motion.div className="h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage(values.m1)}%` }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite',
                    }}
                  ></motion.div>
                </motion.div>

                <div className="flex justify-between mt-6 mb-2">
                  <span className="font-medium text-gray-700">
                    Analyse des situations
                  </span>
                  <motion.span
                    className="font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                  >
                    {percentage(values.m2)}%
                  </motion.span>
                </div>
                <motion.div className="h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage(values.m2)}%` }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite',
                    }}
                  ></motion.div>
                </motion.div>
              </div>

              <div className="bg-rose-50 rounded-lg p-6">
                <p className="text-gray-700">
                  {getGlobalValueForScore(1, (values.m1 + values.m2) / 2)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Résilience Décisionnelle */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Résilience Décisionnelle
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    Remise en question constructive
                  </span>
                  <motion.span
                    className="font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                  >
                    {percentage(values.m6)}%
                  </motion.span>
                </div>
                <motion.div className="h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage(values.m6)}%` }}
                    transition={{ duration: 1.5, delay: 0.9 }}
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite',
                    }}
                  ></motion.div>
                </motion.div>

                <div className="flex justify-between mt-6 mb-2">
                  <span className="font-medium text-gray-700">
                    Agilité à piloter en s'adaptant
                  </span>
                  <motion.span
                    className="font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.9 }}
                  >
                    {percentage(values.m7)}%
                  </motion.span>
                </div>
                <motion.div className="h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage(values.m7)}%` }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite',
                    }}
                  ></motion.div>
                </motion.div>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-gray-700">
                  {getGlobalValueForScore(2, (values.m6 + values.m7) / 2)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Lecture du Potentiel Humain */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Lecture du Potentiel Humain
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-cyan-50 rounded-lg p-6 text-center">
                <div className="w-24 h-24 mx-auto relative mb-4">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-cyan-500"
                    style={{
                      clipPath: 'inset(0 0 0 0)',
                      transform: 'rotate(-90deg)',
                      animation: 'progress 2s ease-out forwards',
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="w-8 h-8 text-cyan-600" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Vision des problématiques
                </h3>
                <p className="text-sm text-gray-600">
                  {percentage(values.m3)}%
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {getValueForScore(3, values.m3)}
                </p>
              </div>

              <div className="bg-cyan-50 rounded-lg p-6 text-center">
                <div className="w-24 h-24 mx-auto relative mb-4">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-cyan-500"
                    style={{
                      clipPath: 'inset(0 0 0 0)',
                      transform: 'rotate(-90deg)',
                      animation: 'progress 2s ease-out forwards',
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-cyan-600" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Force créative</h3>
                <p className="text-sm text-gray-600">
                  {percentage(values.m4)}%
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {getValueForScore(4, values.m4)}
                </p>
              </div>

              <div className="bg-cyan-50 rounded-lg p-6 text-center">
                <div className="w-24 h-24 mx-auto relative mb-4">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-cyan-500"
                    style={{
                      clipPath: 'inset(0 0 0 0)',
                      transform: 'rotate(-90deg)',
                      animation: 'progress 2s ease-out forwards',
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-8 h-8 text-cyan-600" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Indépendance relationnelle
                </h3>
                <p className="text-sm text-gray-600">
                  {percentage(values.m5)}%
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {getValueForScore(5, values.m5)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            onClick={handleSendReport}
            size="lg"
            className={`bg-[#FF6B00] text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              loadingSendReport
                ? 'opacity-80 pointer-events-none'
                : 'hover:opacity-90 cursor-pointer'
            }`}
          >
            {loadingSendReport ? (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-5 h-5 animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>Recevoir mes résultats par e-mail</span>
          </Button>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
