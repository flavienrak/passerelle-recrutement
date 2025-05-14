import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Target,
  Shield,
  Users,
  ArrowRight,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useUser } from '../providers/User.provider';
import { testQuestions } from '../lib/constants';

const ResultsPage: React.FC = () => {
  const { tests } = useSelector((state: RootState) => state.user);
  const { email } = useSelector((state: RootState) => state.persistInfos);

  const [globalScore, setGlobalScore] = useState(0);

  const navigate = useNavigate();

  const { isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && tests) {
      if (tests.length < testQuestions.length) {
        navigate('/test');
      } else {
        const scores = tests.map((item) => item.score);

        const average =
          scores.length > 0
            ? scores.reduce((acc, val) => acc + val, 0) / scores.length
            : 0;

        setGlobalScore(average);
      }
    }
  }, [isLoading, tests]);

  const handleSendReport = () => {
    if (!email) return;
    // Simulate sending email
    setTimeout(() => {
      navigate('/formation');
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
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">
                Analyse cognitive et pragmatique de ton cerveau :
              </p>
              <ul className="text-gray-600 space-y-1 pl-6">
                <li>quels sont vos automatismes de pensées ?</li>
                <li>
                  quels sont vos réflexes de traitement d'une information ?
                </li>
                <li>où semblent ils efficace ?</li>
                <li>où pourrait elle vous faire évoluer ?</li>
              </ul>
            </div>
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
                    {Math.ceil(globalScore * 100)}%
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Force Principale
                </h3>
                <p className="text-gray-700">
                  Excellente capacité à arbitrer rapidement sous pression.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1">
                <ArrowRight className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Axe d'Amélioration
                </h3>
                <p className="text-gray-700">
                  Renforcer la stabilité émotionnelle face à l'urgence pour
                  fiabiliser les décisions critiques.
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
                    Priorisation rapide
                  </span>
                  <motion.span
                    className="font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    85%
                  </motion.span>
                </div>
                <motion.div className="h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite',
                    }}
                  ></motion.div>
                </motion.div>

                <div className="flex justify-between mt-6 mb-2">
                  <span className="font-medium text-gray-700">
                    Arbitrage humain
                  </span>
                  <motion.span
                    className="font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                  >
                    78%
                  </motion.span>
                </div>
                <motion.div className="h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
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
                  Votre capacité à prioriser rapidement (85%) démontre une
                  excellente gestion des urgences opérationnelles. L'arbitrage
                  humain (78%) révèle un bon équilibre entre efficacité et
                  facteur humain, avec un potentiel d'amélioration dans la
                  gestion des conflits d'équipe sous pression.
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
                    Point de non-retour
                  </span>
                  <motion.span
                    className="font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                  >
                    92%
                  </motion.span>
                </div>
                <motion.div className="h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    transition={{ duration: 1.5, delay: 0.9 }}
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite',
                    }}
                  ></motion.div>
                </motion.div>

                <div className="flex justify-between mt-6 mb-2">
                  <span className="font-medium text-gray-700">
                    Flexibilité outil
                  </span>
                  <motion.span
                    className="font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.9 }}
                  >
                    90%
                  </motion.span>
                </div>
                <motion.div className="h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '90%' }}
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
                  Excellence dans l'identification des points de non-retour
                  (92%), permettant des décisions cruciales au bon moment. La
                  flexibilité (90%) montre une adaptabilité remarquable aux
                  changements de contexte. Un léger biais de confirmation peut
                  parfois ralentir la prise de décision en situation complexe.
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
                  Lecture Adaptative
                </h3>
                <p className="text-sm text-gray-600">88%</p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Atouts :</strong> Excellente lecture des signaux
                  non-verbaux et adaptation naturelle au contexte. Facilité à
                  créer des relations de confiance et à désamorcer les tensions.{' '}
                  <strong>Axes d'évolution :</strong> Approfondir l'analyse des
                  dynamiques de groupe complexes et renforcer la transmission de
                  ces compétences à l'équipe.
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
                <h3 className="font-bold text-gray-900 mb-2">
                  Stabilité Sous Pression
                </h3>
                <p className="text-sm text-gray-600">76%</p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Atouts :</strong> Bonne gestion du stress quotidien et
                  maintien de la performance sous pression modérée.{' '}
                  <strong>Axes d'évolution :</strong> Renforcer la stabilité
                  émotionnelle dans les situations extrêmes et développer des
                  stratégies de régulation pour éviter les biais décisionnels
                  sous forte tension.
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
                  Lecture Intuitive
                </h3>
                <p className="text-sm text-gray-600">67%</p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Atouts :</strong> Solide approche analytique dans
                  l'évaluation des compétences directement observables.{' '}
                  <strong>Axes d'évolution :</strong> Développer la détection
                  des talents cachés et affiner la perception des potentiels
                  inexploités pour enrichir l'identification des opportunités de
                  développement.
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
            className="bg-[#FF6B00] hover:bg-[#FF8124] text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Recevoir mes résultats par e-mail
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
};

export default ResultsPage;
