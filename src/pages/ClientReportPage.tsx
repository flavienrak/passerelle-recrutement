import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import classNames from 'classnames';
import { DocumentData } from 'firebase/firestore';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
  MessageCircle,
  RotateCcw,
  Shield,
  Star,
  Target,
  PenTool as Tool,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Layout from '../components/Layout';
import Modal from '../components/Modal';

import { getCandidateFromFirestore } from '../lib/utils';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ icon, title, children }) => (
  <div
      className={classNames(
          'bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20',
          classNames,
      )}
  >
      <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              {icon}
          </div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="prose prose-invert max-w-none">{children}</div>
  </div>
);

const emotionalData = {
  labels: ['Risque terrain', 'Implication émotionnelle', 'Force de décision'],
  datasets: [
      {
          data: [75, 85, 90],
          backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return;

              const gradients = [
                  ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top),
                  ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top),
                  ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top),
              ];

              gradients[0].addColorStop(0, 'rgba(59, 130, 246, 0.2)');
              gradients[0].addColorStop(1, 'rgba(59, 130, 246, 0.8)');

              gradients[1].addColorStop(0, 'rgba(79, 70, 229, 0.2)');
              gradients[1].addColorStop(1, 'rgba(79, 70, 229, 0.8)');

              gradients[2].addColorStop(0, 'rgba(16, 185, 129, 0.2)');
              gradients[2].addColorStop(1, 'rgba(16, 185, 129, 0.8)');

              return gradients;
          },
          borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(79, 70, 229, 1)',
              'rgba(16, 185, 129, 1)',
          ],
          borderWidth: 2,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 10,
      },
  ],
};

const spiderData = {
  labels: [
      'Priorisation rapide',
      'Arbitrage humain',
      'Point de non-retour',
      'Lecture adaptative',
      'Stabilité sous pression',
      'Lecture intuitive',
      'Flexibilité outil',
  ],
  datasets: [
      {
          label: 'Compétences',
          data: [85, 78, 92, 88, 78, 67, 90],
          fill: true,
          backgroundColor: (context: { chart: any }) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return;

              const gradient = ctx.createConicGradient(
                  chartArea.width / 2,
                  chartArea.height / 2,
                  0,
                  chartArea.width / 2,
                  chartArea.height / 2,
              );
              gradient.addColorStop(0, 'rgba(255, 107, 0, 0.8)');
              gradient.addColorStop(0.25, 'rgba(255, 129, 36, 0.6)');
              gradient.addColorStop(0.5, 'rgba(255, 107, 0, 0.4)');
              gradient.addColorStop(0.75, 'rgba(255, 129, 36, 0.6)');
              gradient.addColorStop(1, 'rgba(255, 107, 0, 0.8)');

              return gradient;
          },
          borderColor: 'rgba(255, 107, 0, 1)',
          pointBackgroundColor: (context: { raw: number }) => {
              const value = context.raw as number;
              return value >= 85
                  ? '#FF6B00'
                  : value >= 75
                    ? '#FF8124'
                    : 'rgba(255, 107, 0, 0.6)';
          },
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255, 107, 0, 1)',
          borderWidth: 3,
          shadowColor: 'rgba(255, 107, 0, 0.2)',
          shadowBlur: 10,
      },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
      legend: {
          display: false,
      },
  },
  scales: {
      y: {
          beginAtZero: true,
          max: 100,
          grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false,
          },
          ticks: {
              color: 'rgba(255, 255, 255, 0.6)',
              font: {
                  size: 12,
              },
          },
      },
      x: {
          grid: {
              display: false,
          },
          ticks: {
              color: 'rgba(255, 255, 255, 0.6)',
              font: {
                  size: 12,
              },
          },
      },
  },
};

const spiderOptions = {
  scales: {
      r: {
          min: 0,
          max: 100,
          ticks: {
              stepSize: 20,
              callback: (value: string) => value + '%',
              color: 'rgba(255, 255, 255, 0.4)',
              backdropColor: 'transparent',
          },
          angleLines: {
              color: 'rgba(255, 255, 255, 0.1)',
              lineWidth: 1,
          },
          grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              circular: true,
          },
          pointLabels: {
              color: 'rgba(255, 255, 255, 0.6)',
              font: {
                  size: 14,
                  weight: '500',
              },
              padding: 20,
          },
          animate: true,
      },
  },
  plugins: {
      legend: {
          display: false,
      },
      tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
              size: 14,
              weight: 'bold',
          },
          bodyFont: {
              size: 13,
          },
          padding: 12,
          cornerRadius: 8,
      },
  },
};

const ClientReportPage: React.FC = () => {
  const navigate = useNavigate();
  const barChartRef = useRef<ChartJS | null>(null);
  const radarChartRef = useRef<ChartJS | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const { candidateEmail } = useParams();
  const [user, setUser] = useState<DocumentData>();

  const getData = async () => {
      if (candidateEmail) {
          const data = await getCandidateFromFirestore(candidateEmail);
          if (data.length > 0) {
              setUser(data[0]);
          }
      }
  };

  useEffect(() => {
      getData();

      return () => {
          if (barChartRef.current) {
              barChartRef.current.destroy();
          }
          if (radarChartRef.current) {
              radarChartRef.current.destroy();
          }
      };
  }, []);

  return (
      <Layout showBackButton onBack={() => navigate(-1)}>
          <div className="flex-1 p-8">
              <div className="max-w-7xl mx-auto relative">
                  <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                              <Button
                                  onClick={() => setShowProfileModal(true)}
                                  className="bg-gradient-to-r from-[#FF6B00] to-[#FF8124] text-white hover:from-[#FF8124] hover:to-[#FF9346] transition-all duration-300"
                              >
                                  Découvrir le profil
                              </Button>
                              <Button className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white hover:from-[#D97706] hover:to-[#B45309] transition-all duration-300">
                                  Lire la pré qualification
                              </Button>
                              <Button className="bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white hover:from-[#BE185D] hover:to-[#9D174D] transition-all duration-300">
                                  Contacter le candidat
                              </Button>
                          </div>
                      </div>
                      <img
                          src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1745781614/Sans_titre-1_77_jst63e.png"
                          alt="Logo"
                          className="h-12"
                      />
                  </div>

                  <Section
                      icon={<MessageCircle className="w-6 h-6 text-blue-400" />}
                      title="Phrase d'accroche professionnelle"
                  >
                      <p className="text-gray-300">
                          Consultant en transformation avec une expertise croissante en
                          stratégie digitale, marketing et analyse financière, au
                          service de projets à fort impact dans des environnements
                          variés.
                      </p>
                  </Section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <Section
                          icon={<GraduationCap className="w-6 h-6 text-blue-400" />}
                          title="Diplômes"
                      >
                          <div className="space-y-4">
                              {user?.parsedData?.certifications.map(
                                  (
                                      certification: {
                                          nom: string;
                                          date: string;
                                          organisme?: string;
                                      },
                                      k: number,
                                  ) => (
                                      <div key={k}>
                                          <h3 className="text-lg font-medium text-white mb-2">
                                              {certification.nom}
                                          </h3>
                                          {/* <ul className="list-none space-y-1 text-gray-300">
                                              <li>Niveau : Master</li>
                                              <li>
                                                  Type d'établissement : Université
                                                  historique
                                              </li>
                                              <li>
                                                  Reconnaissance : Référence académique
                                                  majeure
                                              </li>
                                              <li>
                                                  Réputation : ★★★★☆ – Expertise
                                                  sectorielle
                                              </li>
                                          </ul> */}
                                      </div>
                                  ),
                              )}
                          </div>
                      </Section>

                      <Section
                          icon={<BookOpen className="w-6 h-6 text-blue-400" />}
                          title="Formation"
                          className="flex flex-col gap-2"
                      >
                          {user?.parsedData?.formations.map(
                              (
                                  formation: {
                                      dates: string;
                                      diplome: string;
                                      ecole: string;
                                  },
                                  k: number,
                              ) => (
                                  <p key={k} className="text-gray-300">
                                      {formation.dates} – {formation.diplome} |{' '}
                                      {formation.ecole}
                                  </p>
                              ),
                          )}
                      </Section>
                  </div>

                  <div className="mt-6">
                      <Section
                          icon={<Briefcase className="w-6 h-6 text-blue-400" />}
                          title="Expériences professionnelles"
                      >
                          <div className="space-y-6">
                              {user?.parsedData?.experiences_professionnelles.map(
                                  (
                                      exp: {
                                          poste: string;
                                          dates: string;
                                          entreprise: string;
                                          missions: string[];
                                      },
                                      index: number,
                                  ) => (
                                      <div
                                          key={index}
                                          className="border-l-2 border-blue-500/30 pl-4"
                                      >
                                          <h3 className="text-lg font-medium text-white">
                                              {exp.poste}
                                          </h3>
                                          <p className="text-gray-400 mb-2">
                                              Durée : {exp.dates}
                                          </p>
                                          <p className="text-gray-400 mb-3">
                                              {exp.entreprise}
                                          </p>
                                          <h4 className="text-white mb-2">
                                              Missions clés :
                                          </h4>
                                          <ul className="list-none space-y-2">
                                              {exp.missions.map(
                                                  (mission: string, idx: number) => (
                                                      <li
                                                          key={idx}
                                                          className="text-gray-300 flex items-start"
                                                      >
                                                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 mr-2 flex-shrink-0" />
                                                          {mission}
                                                      </li>
                                                  ),
                                              )}
                                          </ul>
                                      </div>
                                  ),
                              )}
                          </div>
                      </Section>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <Section
                          icon={<Star className="w-6 h-6 text-blue-400" />}
                          title="Compétences clés"
                      >
                          <ul className="list-none space-y-2 text-gray-300">
                              {Object.entries(user?.parsedData?.competences || {})
                                  .filter(([key]) => key !== 'langues')
                                  .map(([key, competences]) =>
                                      (Array.isArray(competences)
                                          ? competences
                                          : []
                                      ).map((competence: string, idx: number) => (
                                          <li key={`${key}-${idx}`}>{competence}</li>
                                      )),
                                  )}

                              <li>
                                  Langues :{' '}
                                  {(
                                      user?.parsedData?.competences.langues ||
                                      user?.parsedData?.langues ||
                                      []
                                  ).map(
                                      (
                                          langue: { langue: string; niveau: string },
                                          k: number,
                                      ) =>
                                          `${langue.langue} (${langue.niveau}) ${
                                              k <
                                              (
                                                  user?.parsedData.competences
                                                      .langues ||
                                                  user?.parsedData.langues
                                              ).length -
                                                  1
                                                  ? '–'
                                                  : ''
                                          } `,
                                  )}
                              </li>
                          </ul>
                      </Section>

                      <Section
                          icon={<Award className="w-6 h-6 text-blue-400" />}
                          title="Certifications complémentaires"
                      >
                          <p className="text-gray-300">
                              Poids moyen – Analyse de données marketing digitale |
                              Google
                          </p>
                          <p className="text-gray-300 mt-2">
                              1 autre pertinente pour le domaine
                          </p>
                      </Section>
                  </div>

                  <div className="mt-6">
                      <Section
                          icon={<Heart className="w-6 h-6 text-blue-400" />}
                          title="Centres d'intérêt"
                      >
                          <ul className="list-none space-y-2 text-gray-300">
                              {user?.parsedData?.centres_interet.map(
                                  (data: string, k: number) => <li key={k}>{data}</li>,
                              )}
                          </ul>
                      </Section>
                  </div>

                  <Modal
                      isOpen={showProfileModal}
                      onClose={() => setShowProfileModal(false)}
                      title="Profil du candidat"
                  >
                      <div className="relative">
                          <img
                              src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1745331774/MODELE_DE_CV_yreipk.png"
                              alt="CV du candidat"
                              className="w-full h-auto rounded-lg"
                          />
                      </div>
                  </Modal>

                  {/* Interview Summaries */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                          <div className="flex items-center gap-3 mb-4">
                              <Tool className="w-6 h-6 text-[#FF6B00]" />
                              <h3 className="text-lg font-semibold">
                                  Activités réalisées récemment
                              </h3>
                          </div>
                          <p className="text-gray-300 text-sm">
                              En tant que Lead Developer chez Tech Solutions, le
                              candidat a dirigé une équipe de 5 développeurs sur un
                              projet critique de refonte d'architecture microservices.
                              Responsable de la planification sprint, code review et
                              mentoring. A mis en place des pratiques DevOps qui ont
                              réduit le temps de déploiement de 60%. • Leadership
                              technique confirmé avec résultats mesurables
                          </p>
                      </div>

                      <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                          <div className="flex items-center gap-3 mb-4">
                              <AlertTriangle className="w-6 h-6 text-[#FF6B00]" />
                              <h3 className="text-lg font-semibold">
                                  Focus quotidien et urgences gérées
                              </h3>
                          </div>
                          <p className="text-gray-300 text-sm">
                              Gestion quotidienne des incidents de production avec un
                              SLA de 99.9%. Coordination des déploiements critiques en
                              minimisant l'impact utilisateur. Arbitrage constant entre
                              dette technique et nouvelles fonctionnalités. Supervision
                              des performances et de la scalabilité de l'infrastructure.
                              • Excellence opérationnelle sous pression
                          </p>
                      </div>

                      <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                          <div className="flex items-center gap-3 mb-4">
                              <Zap className="w-6 h-6 text-[#FF6B00]" />
                              <h3 className="text-lg font-semibold">
                                  Action différenciante
                              </h3>
                          </div>
                          <p className="text-gray-300 text-sm">
                              A conçu et implémenté un système de monitoring prédictif
                              basé sur le ML qui a permis d'anticiper 85% des incidents
                              majeurs. Cette innovation a valu au candidat une
                              reconnaissance spéciale de la direction et a été déployée
                              sur l'ensemble des projets de l'entreprise. • Innovation
                              technique à fort impact business
                          </p>
                      </div>

                      <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                          <div className="flex items-center gap-3 mb-4">
                              <Users className="w-6 h-6 text-[#FF6B00]" />
                              <h3 className="text-lg font-semibold">
                                  Interlocuteurs réguliers
                              </h3>
                          </div>
                          <p className="text-gray-300 text-sm">
                              Interface directe avec le CTO et les Product Owners pour
                              l'alignement stratégique. Management d'une équipe
                              multiculturelle de développeurs. Collaboration étroite
                              avec les équipes QA et DevOps. Communication régulière
                              avec les clients majeurs pour les aspects techniques. •
                              Leadership transverse efficace
                          </p>
                      </div>

                      <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                          <div className="flex items-center gap-3 mb-4">
                              <Target className="w-6 h-6 text-[#FF6B00]" />
                              <h3 className="text-lg font-semibold">
                                  Compétences récemment utilisées
                              </h3>
                          </div>
                          <p className="text-gray-300 text-sm">
                              Expertise approfondie en architecture cloud native et
                              pratiques DevOps. Maîtrise des patterns de microservices
                              et de l'optimisation des performances. Développement de
                              compétences en IA/ML appliquées au monitoring.
                              Renforcement du leadership technique et de la gestion
                              d'équipe. • Profil technique senior polyvalent
                          </p>
                      </div>

                      <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                          <div className="flex items-center gap-3 mb-4">
                              <RotateCcw className="w-6 h-6 text-[#FF6B00]" />
                              <h3 className="text-lg font-semibold">
                                  Le mot du candidat
                              </h3>
                          </div>
                          <p className="text-gray-300 text-sm">
                              Passionné par l'innovation technique au service de la
                              performance business. Cherche un rôle où je pourrai
                              continuer à développer des solutions innovantes tout en
                              mentoring la prochaine génération de développeurs.
                              Particulièrement intéressé par les projets à fort impact
                              utilisant l'IA. • Vision claire de sa progression
                          </p>
                      </div>
                  </div>

                  {/* Emotional Level Section */}
                  <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
                      <h2 className="text-2xl font-bold mb-6">
                          Niveau d'imprégnation émotivo-professionnelle
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="h-[300px]">
                              <Bar
                                  ref={barChartRef}
                                  data={emotionalData}
                                  options={barOptions}
                              />
                          </div>
                          <div className="lg:col-span-2 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="bg-[#0A0E17]/50 rounded-lg p-4">
                                      <h3 className="font-semibold mb-2 text-[#FF6B00]">
                                          Risque terrain
                                      </h3>
                                      <p className="text-sm text-gray-300">
                                          Capacité à évaluer et gérer les risques
                                          opérationnels avec pragmatisme.
                                      </p>
                                  </div>
                                  <div className="bg-[#0A0E17]/50 rounded-lg p-4">
                                      <h3 className="font-semibold mb-2 text-[#FF6B00]">
                                          Implication émotionnelle
                                      </h3>
                                      <p className="text-sm text-gray-300">
                                          Équilibre entre engagement professionnel et
                                          distance émotionnelle.
                                      </p>
                                  </div>
                                  <div className="bg-[#0A0E17]/50 rounded-lg p-4">
                                      <h3 className="font-semibold mb-2 text-[#FF6B00]">
                                          Force de décision
                                      </h3>
                                      <p className="text-sm text-gray-300">
                                          Capacité à prendre des décisions rapides et
                                          pertinentes sous pression.
                                      </p>
                                  </div>
                              </div>
                              <div className="bg-[#0A0E17]/50 rounded-lg p-4">
                                  <h3 className="font-semibold mb-2 text-[#FF6B00]">
                                      Synthèse
                                  </h3>
                                  <p className="text-gray-300">
                                      Le candidat démontre une excellente capacité à
                                      maintenir l'équilibre entre prise de risque et
                                      prudence, avec une force de décision
                                      particulièrement développée dans les situations
                                      complexes.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Cognitive Matrices Section */}
                  <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
                      <h2 className="text-2xl font-bold mb-6">
                          Automatismes d'action en situation terrain
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <button
                              onClick={() => setSelectedFamily('pilotageStrategique')}
                              className="w-full bg-gradient-to-br from-[#1A1E2E] to-[#2A1E12] rounded-lg p-6 hover:bg-gradient-to-br hover:from-[#1F2437] hover:to-[#2F2315] transition-all duration-300 hover:scale-[1.02] relative group h-[420px] flex flex-col"
                          >
                              <div className="absolute inset-0 bg-gradient-radial from-[#FF6B00]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="flex items-center justify-center gap-3 mb-4 relative">
                                  <div className="h-48 w-3 bg-gray-800/50 rounded-full relative overflow-hidden animate-pulse">
                                      <div
                                          className="absolute bottom-0 w-full bg-gradient-to-t from-[#FF6B00] via-[#FF8124] to-[#3B82F6] animate-pulse"
                                          style={{ height: '82%' }}
                                      >
                                          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20">
                                              <div
                                                  className="absolute inset-0 animate-glow"
                                                  style={{ animationDuration: '2s' }}
                                              />
                                          </div>
                                      </div>
                                      <div
                                          className="absolute -left-3 top-0 w-9 h-full pointer-events-none animate-pulse"
                                          style={{ animationDuration: '3s' }}
                                      >
                                          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FF6B00]/10 to-transparent" />
                                      </div>
                                  </div>
                                  <div className="text-2xl font-bold text-white animate-pulse">
                                      84%
                                  </div>
                              </div>
                              <h3 className="text-xl font-bold mb-2">
                                  Pilotage Stratégique
                              </h3>
                              <p className="text-gray-300">
                                  Mesure la capacité à décider rapidement et
                                  efficacement en contexte humain et opérationnel tendu.
                              </p>
                              <div className="mt-auto pt-4">
                                  <div className="flex justify-between text-sm text-gray-400">
                                      <span>Priorisation rapide</span>
                                      <span className="font-semibold text-[#FF6B00]">
                                          85%
                                      </span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                                      <span>Arbitrage humain</span>
                                      <span className="font-semibold text-[#3B82F6]">
                                          78%
                                      </span>
                                  </div>
                              </div>
                          </button>

                          {/* Résilience Décisionnelle */}
                          <button
                              onClick={() =>
                                  setSelectedFamily('resilienceDecisionnelle')
                              }
                              className="w-full bg-gradient-to-br from-[#1A1E2E] to-[#1E122A] rounded-lg p-6 hover:bg-gradient-to-br hover:from-[#1F2437] hover:to-[#231531] transition-all duration-300 hover:scale-[1.02] relative group overflow-hidden h-[420px] flex flex-col"
                          >
                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50" />
                              <div className="w-48 h-48 mx-auto relative mb-4">
                                  <div
                                      className="absolute inset-0 bg-black/30 rounded-full backdrop-blur-[2px] animate-pulse"
                                      style={{ animationDuration: '3s' }}
                                  />
                                  <div className="absolute inset-2 bg-gradient-to-br from-[#1A1E2E]/80 to-black/80 rounded-full backdrop-blur-sm border border-white/5">
                                      <div
                                          className="absolute inset-0 rounded-full animate-glow"
                                          style={{ animationDuration: '2s' }}
                                      />
                                  </div>
                                  <Doughnut
                                      data={{
                                          datasets: [
                                              {
                                                  data: [88, 12],
                                                  backgroundColor: [
                                                      'rgba(255, 107, 0, 0.8)',
                                                      'rgba(255, 107, 0, 0.05)',
                                                  ],
                                                  borderColor: [
                                                      'rgba(255, 107, 0, 1)',
                                                      'transparent',
                                                  ],
                                                  borderWidth: 1,
                                                  circumference: 360,
                                                  rotation: -90,
                                              },
                                          ],
                                      }}
                                      options={{
                                          cutout: '85%',
                                          responsive: true,
                                          plugins: {
                                              legend: { display: false },
                                              tooltip: { enabled: false },
                                          },
                                      }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="text-center">
                                          <span
                                              className="text-4xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,107,0,0.3)] animate-pulse"
                                              style={{ animationDuration: '2s' }}
                                          >
                                              88%
                                          </span>
                                      </div>
                                  </div>
                                  <div className="absolute inset-[-1px] rounded-full border border-[#FF6B00]/20 shadow-[0_0_15px_rgba(255,107,0,0.2)] animate-glow" />
                              </div>
                              <h3 className="text-xl font-bold mb-2">
                                  Résilience Décisionnelle
                              </h3>
                              <p className="text-gray-300">
                                  Analyse l'aptitude à gérer l'irréversible, à rebondir
                                  et à s'adapter dans des situations critiques.
                              </p>
                              <div className="mt-auto pt-4">
                                  <div className="flex justify-between text-sm text-gray-400">
                                      <span>Point de non-retour</span>
                                      <span className="font-semibold text-[#FF6B00]">
                                          92%
                                      </span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                                      <span>Flexibilité outil</span>
                                      <span className="font-semibold text-[#10B981]">
                                          90%
                                      </span>
                                  </div>
                              </div>
                          </button>

                          {/* Lecture du Potentiel Humain */}
                          <button
                              onClick={() => setSelectedFamily('lecturePotentiel')}
                              className="w-full bg-gradient-to-br from-[#1A1E2E] to-[#122A1E] rounded-lg p-6 hover:bg-gradient-to-br hover:from-[#1F2437] hover:to-[#153123] transition-all duration-300 hover:scale-[1.02] relative group h-[420px] flex flex-col"
                          >
                              <div className="absolute inset-0 bg-gradient-radial from-[#FF6B00]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="w-48 h-48 mx-auto relative mb-4">
                                  <div
                                      className="absolute inset-0 flex items-center justify-center animate-pulse"
                                      style={{ animationDuration: '3s' }}
                                  >
                                      <div
                                          className="absolute w-40 h-40 rounded-full border border-[#FF6B00]/10 animate-ripple"
                                          style={{ animationDuration: '3s' }}
                                      />
                                      <div
                                          className="absolute w-40 h-40 rounded-full border border-[#FF6B00]/10 animate-ripple"
                                          style={{
                                              animationDuration: '3s',
                                              animationDelay: '1.5s',
                                          }}
                                      />
                                      <div className="w-32 h-32 rounded-full border-4 border-[#FF6B00]/20 flex items-center justify-center relative">
                                          <div
                                              className="absolute inset-0 rounded-full animate-glow"
                                              style={{ animationDuration: '2s' }}
                                          />
                                          <div className="w-24 h-24 rounded-full border-4 border-[#FF6B00]/40 flex items-center justify-center relative">
                                              <div
                                                  className="absolute inset-0 rounded-full animate-glow"
                                                  style={{
                                                      animationDuration: '2s',
                                                      animationDelay: '0.5s',
                                                  }}
                                              />
                                              <div className="w-16 h-16 rounded-full border-4 border-[#FF6B00]/60 flex items-center justify-center relative">
                                                  <div
                                                      className="absolute inset-0 rounded-full animate-glow"
                                                      style={{
                                                          animationDuration: '2s',
                                                          animationDelay: '1s',
                                                      }}
                                                  />
                                                  <span
                                                      className="text-xl font-bold animate-pulse"
                                                      style={{
                                                          animationDuration: '2s',
                                                      }}
                                                  >
                                                      82%
                                                  </span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <h3 className="text-xl font-bold mb-2">
                                  Lecture du Potentiel Humain
                              </h3>
                              <p className="text-gray-300">
                                  Évalue la capacité à détecter et exploiter les talents
                                  en environnement tendu ou public.
                              </p>
                              <div className="mt-auto pt-4">
                                  <div className="flex justify-between text-sm text-gray-400">
                                      <span>Lecture adaptative</span>
                                      <span className="font-semibold text-[#FF6B00]">
                                          88%
                                      </span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                                      <span>Stabilité sous pression</span>
                                      <span className="font-semibold text-[#3B82F6]">
                                          76%
                                      </span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                                      <span>Lecture intuitive</span>
                                      <span className="font-semibold text-[#10B981]">
                                          67%
                                      </span>
                                  </div>
                              </div>
                          </button>

                          {/* Modal for time series charts */}
                          {selectedFamily && (
                              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                                  <div className="bg-[#0A0E17] border border-gray-700/50 rounded-xl w-full max-w-4xl p-6">
                                      <div className="flex justify-between items-start">
                                          <div className="space-y-2">
                                              <h3 className="text-3xl font-bold text-[#FFF5E6]">
                                                  {selectedFamily ===
                                                      'pilotageStrategique' &&
                                                      'Pilotage Stratégique'}
                                                  {selectedFamily ===
                                                      'resilienceDecisionnelle' &&
                                                      'Résilience Décisionnelle'}
                                                  {selectedFamily ===
                                                      'lecturePotentiel' &&
                                                      'Lecture du Potentiel Humain'}
                                              </h3>
                                              {selectedFamily ===
                                                  'pilotageStrategique' && (
                                                  <p className="text-base font-medium text-[#FFF5E6] max-w-2xl">
                                                      Profil décisionnel pragmatique
                                                      avec excellente capacité de
                                                      priorisation (85%). L'arbitrage
                                                      humain (78%) montre un bon
                                                      équilibre entre efficacité et
                                                      considération des facteurs
                                                      humains.
                                                  </p>
                                              )}
                                          </div>
                                          <button
                                              onClick={() => setSelectedFamily(null)}
                                              className="p-2 hover:bg-gray-800/50 rounded-full transition-colors"
                                          >
                                              <X className="w-5 h-5" />
                                          </button>
                                      </div>
                                      <div className="space-y-6">
                                          {selectedFamily ===
                                              'resilienceDecisionnelle' && (
                                              <div className="mt-6">
                                                  <div className="flex gap-8">
                                                      <div className="bg-[#1A1E2E]/80 rounded-xl p-6 relative overflow-hidden group">
                                                          <div className="absolute inset-0">
                                                              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 via-[#F87171]/20 to-[#60A5FA]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20" />
                                                          </div>
                                                          <div className="w-48 h-48 mx-auto relative mb-4">
                                                              <div
                                                                  className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/30 via-[#F87171]/20 to-[#60A5FA]/30 rounded-full backdrop-blur-[2px] animate-pulse"
                                                                  style={{
                                                                      animationDuration:
                                                                          '3s',
                                                                  }}
                                                              />
                                                              <div className="absolute inset-2 bg-gradient-to-br from-[#1A1E2E]/60 via-[#8B5CF6]/20 to-[#1A1E2E]/60 rounded-full backdrop-blur-sm border border-white/10">
                                                                  <div
                                                                      className="absolute inset-0 rounded-full animate-glow"
                                                                      style={{
                                                                          animationDuration:
                                                                              '3s',
                                                                      }}
                                                                  />
                                                                  <div
                                                                      className="absolute inset-0 rounded-full border border-[#8B5CF6]/30 animate-ripple"
                                                                      style={{
                                                                          animationDuration:
                                                                              '4s',
                                                                      }}
                                                                  />
                                                                  <div
                                                                      className="absolute inset-0 rounded-full border border-[#F87171]/20 animate-ripple"
                                                                      style={{
                                                                          animationDuration:
                                                                              '4s',
                                                                          animationDelay:
                                                                              '2s',
                                                                      }}
                                                                  />
                                                                  <div
                                                                      className="absolute inset-0 rounded-full border border-[#60A5FA]/20 animate-ripple"
                                                                      style={{
                                                                          animationDuration:
                                                                              '4s',
                                                                          animationDelay:
                                                                              '3s',
                                                                      }}
                                                                  />
                                                              </div>
                                                              <Doughnut
                                                                  data={{
                                                                      datasets: [
                                                                          {
                                                                              data: [
                                                                                  92, 8,
                                                                              ],
                                                                              backgroundColor:
                                                                                  [
                                                                                      (
                                                                                          context,
                                                                                      ) => {
                                                                                          const ctx =
                                                                                              context
                                                                                                  .chart
                                                                                                  .ctx;
                                                                                          const gradient =
                                                                                              ctx.createLinearGradient(
                                                                                                  0,
                                                                                                  0,
                                                                                                  0,
                                                                                                  200,
                                                                                              );
                                                                                          gradient.addColorStop(
                                                                                              0,
                                                                                              'rgba(139, 92, 246, 0.95)',
                                                                                          );
                                                                                          gradient.addColorStop(
                                                                                              0.3,
                                                                                              'rgba(248, 113, 113, 0.9)',
                                                                                          );
                                                                                          gradient.addColorStop(
                                                                                              0.7,
                                                                                              'rgba(96, 165, 250, 0.9)',
                                                                                          );
                                                                                          gradient.addColorStop(
                                                                                              1,
                                                                                              'rgba(139, 92, 246, 0.95)',
                                                                                          );
                                                                                          return gradient;
                                                                                      },
                                                                                      'rgba(139, 92, 246, 0.1)',
                                                                                  ],
                                                                              borderColor:
                                                                                  [
                                                                                      'rgba(139, 92, 246, 1)',
                                                                                      'transparent',
                                                                                  ],
                                                                              borderWidth: 1,
                                                                              circumference: 360,
                                                                              rotation:
                                                                                  -90,
                                                                          },
                                                                      ],
                                                                  }}
                                                                  options={{
                                                                      cutout: '85%',
                                                                      responsive: true,
                                                                      plugins: {
                                                                          legend: {
                                                                              display:
                                                                                  false,
                                                                          },
                                                                          tooltip: {
                                                                              enabled:
                                                                                  false,
                                                                          },
                                                                      },
                                                                  }}
                                                              />
                                                              <div className="absolute inset-0 flex items-center justify-center">
                                                                  <div className="text-center">
                                                                      <span
                                                                          className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(124,58,237,0.3)] animate-pulse"
                                                                          style={{
                                                                              animationDuration:
                                                                                  '2s',
                                                                          }}
                                                                      >
                                                                          92%
                                                                      </span>
                                                                  </div>
                                                              </div>
                                                              <div className="absolute inset-[-1px] rounded-full border border-[#7C3AED]/20 shadow-[0_0_15px_rgba(124,58,237,0.2)] animate-glow" />
                                                          </div>
                                                          <h4 className="text-xl font-bold mb-3 text-center">
                                                              Point de non-retour
                                                          </h4>
                                                          <p className="text-gray-300 text-center">
                                                              En réunion stratégique,
                                                              vous identifiez avec
                                                              précision le moment où une
                                                              décision devient
                                                              irréversible et devez
                                                              trancher.
                                                          </p>
                                                      </div>

                                                      <div className="bg-[#1A1E2E]/80 rounded-xl p-6 relative overflow-hidden group">
                                                          <div className="absolute inset-0">
                                                              <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 via-[#60A5FA]/20 to-[#F59E0B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20" />
                                                          </div>
                                                          <div className="w-48 h-48 mx-auto relative mb-4">
                                                              <div
                                                                  className="absolute inset-0 bg-gradient-to-br from-[#10B981]/30 via-[#60A5FA]/20 to-[#F59E0B]/30 rounded-full backdrop-blur-[2px] animate-pulse"
                                                                  style={{
                                                                      animationDuration:
                                                                          '3s',
                                                                  }}
                                                              />
                                                              <div className="absolute inset-2 bg-gradient-to-br from-[#1A1E2E]/60 via-[#10B981]/20 to-[#1A1E2E]/60 rounded-full backdrop-blur-sm border border-white/10">
                                                                  <div
                                                                      className="absolute inset-0 rounded-full animate-glow"
                                                                      style={{
                                                                          animationDuration:
                                                                              '3s',
                                                                      }}
                                                                  />
                                                                  <div
                                                                      className="absolute inset-0 rounded-full border border-[#10B981]/30 animate-ripple"
                                                                      style={{
                                                                          animationDuration:
                                                                              '4s',
                                                                      }}
                                                                  />
                                                                  <div
                                                                      className="absolute inset-0 rounded-full border border-[#60A5FA]/20 animate-ripple"
                                                                      style={{
                                                                          animationDuration:
                                                                              '4s',
                                                                          animationDelay:
                                                                              '2s',
                                                                      }}
                                                                  />
                                                                  <div
                                                                      className="absolute inset-0 rounded-full border border-[#F59E0B]/20 animate-ripple"
                                                                      style={{
                                                                          animationDuration:
                                                                              '4s',
                                                                          animationDelay:
                                                                              '3s',
                                                                      }}
                                                                  />
                                                              </div>
                                                              <Doughnut
                                                                  data={{
                                                                      datasets: [
                                                                          {
                                                                              data: [
                                                                                  85,
                                                                                  15,
                                                                              ],
                                                                              backgroundColor:
                                                                                  [
                                                                                      (
                                                                                          context,
                                                                                      ) => {
                                                                                          const ctx =
                                                                                              context
                                                                                                  .chart
                                                                                                  .ctx;
                                                                                          const gradient =
                                                                                              ctx.createLinearGradient(
                                                                                                  0,
                                                                                                  0,
                                                                                                  0,
                                                                                                  200,
                                                                                              );
                                                                                          gradient.addColorStop(
                                                                                              0,
                                                                                              'rgba(16, 185, 129, 0.95)',
                                                                                          );
                                                                                          gradient.addColorStop(
                                                                                              0.3,
                                                                                              'rgba(96, 165, 250, 0.9)',
                                                                                          );
                                                                                          gradient.addColorStop(
                                                                                              0.7,
                                                                                              'rgba(245, 158, 11, 0.9)',
                                                                                          );
                                                                                          gradient.addColorStop(
                                                                                              1,
                                                                                              'rgba(16, 185, 129, 0.95)',
                                                                                          );
                                                                                          return gradient;
                                                                                      },
                                                                                      'rgba(16, 185, 129, 0.1)',
                                                                                  ],
                                                                              borderColor:
                                                                                  [
                                                                                      'rgba(16, 185, 129, 1)',
                                                                                      'transparent',
                                                                                  ],
                                                                              borderWidth: 1,
                                                                              circumference: 360,
                                                                              rotation:
                                                                                  -90,
                                                                          },
                                                                      ],
                                                                  }}
                                                                  options={{
                                                                      cutout: '85%',
                                                                      responsive: true,
                                                                      plugins: {
                                                                          legend: {
                                                                              display:
                                                                                  false,
                                                                          },
                                                                          tooltip: {
                                                                              enabled:
                                                                                  false,
                                                                          },
                                                                      },
                                                                  }}
                                                              />
                                                              <div className="absolute inset-0 flex items-center justify-center">
                                                                  <div className="text-center">
                                                                      <span
                                                                          className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(5,150,105,0.3)] animate-pulse"
                                                                          style={{
                                                                              animationDuration:
                                                                                  '2s',
                                                                          }}
                                                                      >
                                                                          85%
                                                                      </span>
                                                                  </div>
                                                              </div>
                                                              <div className="absolute inset-[-1px] rounded-full border border-[#059669]/20 shadow-[0_0_15px_rgba(5,150,105,0.2)] animate-glow" />
                                                          </div>
                                                          <h4 className="text-xl font-bold mb-3 text-center">
                                                              Réalisme post-échec
                                                          </h4>
                                                          <p className="text-gray-300 text-center">
                                                              Suite à un projet non
                                                              abouti, vous analysez
                                                              objectivement la situation
                                                              pour en tirer des
                                                              apprentissages
                                                              constructifs.
                                                          </p>
                                                      </div>
                                                  </div>
                                              </div>
                                          )}
                                          {selectedFamily === 'lecturePotentiel' && (
                                              <div className="mt-6">
                                                  <div className="grid grid-cols-3 gap-6">
                                                      <div className="bg-[#1A1E2E]/80 rounded-xl p-6 relative overflow-hidden group">
                                                          <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                          <div className="flex items-center gap-4 mb-4">
                                                              <div className="w-48 h-48 relative">
                                                                  <div
                                                                      className="absolute inset-0 flex items-center justify-center animate-pulse"
                                                                      style={{
                                                                          animationDuration:
                                                                              '3s',
                                                                      }}
                                                                  >
                                                                      <div
                                                                          className="absolute w-40 h-40 rounded-full border border-[#DC2626]/10 animate-ripple"
                                                                          style={{
                                                                              animationDuration:
                                                                                  '3s',
                                                                          }}
                                                                      />
                                                                      <div
                                                                          className="absolute w-40 h-40 rounded-full border border-[#DC2626]/10 animate-ripple"
                                                                          style={{
                                                                              animationDuration:
                                                                                  '3s',
                                                                              animationDelay:
                                                                                  '1.5s',
                                                                          }}
                                                                      />
                                                                      <div className="w-32 h-32 rounded-full border-4 border-[#DC2626]/20 flex items-center justify-center relative">
                                                                          <div
                                                                              className="absolute inset-0 rounded-full animate-glow"
                                                                              style={{
                                                                                  animationDuration:
                                                                                      '2s',
                                                                              }}
                                                                          />
                                                                          <div className="w-24 h-24 rounded-full border-4 border-[#DC2626]/40 flex items-center justify-center relative">
                                                                              <div
                                                                                  className="absolute inset-0 rounded-full animate-glow"
                                                                                  style={{
                                                                                      animationDuration:
                                                                                          '2s',
                                                                                      animationDelay:
                                                                                          '0.5s',
                                                                                  }}
                                                                              />
                                                                              <div className="w-16 h-16 rounded-full border-4 border-[#DC2626]/60 flex items-center justify-center relative">
                                                                                  <div
                                                                                      className="absolute inset-0 rounded-full animate-glow"
                                                                                      style={{
                                                                                          animationDuration:
                                                                                              '2s',
                                                                                          animationDelay:
                                                                                              '1s',
                                                                                      }}
                                                                                  />
                                                                                  <Target
                                                                                      className="w-8 h-8 text-[#DC2626] animate-pulse"
                                                                                      style={{
                                                                                          animationDuration:
                                                                                              '2s',
                                                                                      }}
                                                                                  />
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                              <div className="text-right">
                                                                  <span
                                                                      className="text-5xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(220,38,38,0.3)] animate-pulse"
                                                                      style={{
                                                                          animationDuration:
                                                                              '2s',
                                                                      }}
                                                                  >
                                                                      88%
                                                                  </span>
                                                              </div>
                                                          </div>
                                                          <h4 className="text-xl font-bold mb-3 text-center">
                                                              Lecture adaptative
                                                          </h4>
                                                          <p className="text-gray-300 text-center">
                                                              Capacité à adapter son
                                                              approche managériale en
                                                              temps réel selon les
                                                              signaux terrain détectés.
                                                          </p>
                                                      </div>

                                                      <div className="bg-[#1A1E2E]/80 rounded-xl p-6 relative overflow-hidden group">
                                                          <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                          <div className="flex items-center gap-4 mb-4">
                                                              <div className="w-48 h-48 relative">
                                                                  <div
                                                                      className="absolute inset-0 flex items-center justify-center animate-pulse"
                                                                      style={{
                                                                          animationDuration:
                                                                              '3s',
                                                                      }}
                                                                  >
                                                                      <div
                                                                          className="absolute w-40 h-40 rounded-full border border-[#4F46E5]/10 animate-ripple"
                                                                          style={{
                                                                              animationDuration:
                                                                                  '3s',
                                                                          }}
                                                                      />
                                                                      <div
                                                                          className="absolute w-40 h-40 rounded-full border border-[#4F46E5]/10 animate-ripple"
                                                                          style={{
                                                                              animationDuration:
                                                                                  '3s',
                                                                              animationDelay:
                                                                                  '1.5s',
                                                                          }}
                                                                      />
                                                                      <div className="w-32 h-32 rounded-full border-4 border-[#4F46E5]/20 flex items-center justify-center relative">
                                                                          <div
                                                                              className="absolute inset-0 rounded-full animate-glow"
                                                                              style={{
                                                                                  animationDuration:
                                                                                      '2s',
                                                                              }}
                                                                          />
                                                                          <div className="w-24 h-24 rounded-full border-4 border-[#4F46E5]/40 flex items-center justify-center relative">
                                                                              <div
                                                                                  className="absolute inset-0 rounded-full animate-glow"
                                                                                  style={{
                                                                                      animationDuration:
                                                                                          '2s',
                                                                                      animationDelay:
                                                                                          '0.5s',
                                                                                  }}
                                                                              />
                                                                              <div className="w-16 h-16 rounded-full border-4 border-[#4F46E5]/60 flex items-center justify-center relative">
                                                                                  <div
                                                                                      className="absolute inset-0 rounded-full animate-glow"
                                                                                      style={{
                                                                                          animationDuration:
                                                                                              '2s',
                                                                                          animationDelay:
                                                                                              '1s',
                                                                                      }}
                                                                                  />
                                                                                  <Shield
                                                                                      className="w-8 h-8 text-[#4F46E5] animate-pulse"
                                                                                      style={{
                                                                                          animationDuration:
                                                                                              '2s',
                                                                                      }}
                                                                                  />
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                              <div className="text-right">
                                                                  <span
                                                                      className="text-5xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(79,70,229,0.3)] animate-pulse"
                                                                      style={{
                                                                          animationDuration:
                                                                              '2s',
                                                                      }}
                                                                  >
                                                                      76%
                                                                  </span>
                                                              </div>
                                                          </div>
                                                          <h4 className="text-xl font-bold mb-3 text-center">
                                                              Stabilité sous pression
                                                          </h4>
                                                          <p className="text-gray-300 text-center">
                                                              Maintien d'une analyse
                                                              objective des compétences
                                                              même en contexte de forte
                                                              pression opérationnelle.
                                                          </p>
                                                      </div>

                                                      <div className="bg-[#1A1E2E]/80 rounded-xl p-6 relative overflow-hidden group">
                                                          <div className="absolute inset-0 bg-gradient-to-br from-[#059669]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                          <div className="flex items-center gap-4 mb-4">
                                                              <div className="w-48 h-48 relative">
                                                                  <div
                                                                      className="absolute inset-0 flex items-center justify-center animate-pulse"
                                                                      style={{
                                                                          animationDuration:
                                                                              '3s',
                                                                      }}
                                                                  >
                                                                      <div
                                                                          className="absolute w-40 h-40 rounded-full border border-[#059669]/10 animate-ripple"
                                                                          style={{
                                                                              animationDuration:
                                                                                  '3s',
                                                                          }}
                                                                      />
                                                                      <div
                                                                          className="absolute w-40 h-40 rounded-full border border-[#059669]/10 animate-ripple"
                                                                          style={{
                                                                              animationDuration:
                                                                                  '3s',
                                                                              animationDelay:
                                                                                  '1.5s',
                                                                          }}
                                                                      />
                                                                      <div className="w-32 h-32 rounded-full border-4 border-[#059669]/20 flex items-center justify-center relative">
                                                                          <div
                                                                              className="absolute inset-0 rounded-full animate-glow"
                                                                              style={{
                                                                                  animationDuration:
                                                                                      '2s',
                                                                              }}
                                                                          />
                                                                          <div className="w-24 h-24 rounded-full border-4 border-[#059669]/40 flex items-center justify-center relative">
                                                                              <div
                                                                                  className="absolute inset-0 rounded-full animate-glow"
                                                                                  style={{
                                                                                      animationDuration:
                                                                                          '2s',
                                                                                      animationDelay:
                                                                                          '0.5s',
                                                                                  }}
                                                                              />
                                                                              <div className="w-16 h-16 rounded-full border-4 border-[#059669]/60 flex items-center justify-center relative">
                                                                                  <div
                                                                                      className="absolute inset-0 rounded-full animate-glow"
                                                                                      style={{
                                                                                          animationDuration:
                                                                                              '2s',
                                                                                          animationDelay:
                                                                                              '1s',
                                                                                      }}
                                                                                  />
                                                                                  <Users
                                                                                      className="w-8 h-8 text-[#059669] animate-pulse"
                                                                                      style={{
                                                                                          animationDuration:
                                                                                              '2s',
                                                                                      }}
                                                                                  />
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                              <div className="text-right">
                                                                  <span
                                                                      className="text-5xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(5,150,105,0.3)] animate-pulse"
                                                                      style={{
                                                                          animationDuration:
                                                                              '2s',
                                                                      }}
                                                                  >
                                                                      67%
                                                                  </span>
                                                              </div>
                                                          </div>
                                                          <h4 className="text-xl font-bold mb-3 text-center">
                                                              Lecture intuitive
                                                          </h4>
                                                          <p className="text-gray-300 text-center">
                                                              Détection naturelle des
                                                              talents cachés et du
                                                              potentiel inexploité dans
                                                              l'équipe.
                                                          </p>
                                                      </div>
                                                  </div>
                                              </div>
                                          )}
                                          {selectedFamily === 'pilotageStrategique' && (
                                              <>
                                                  <div>
                                                      <div className="flex justify-between mb-2">
                                                          <span className="font-medium">
                                                              Priorisation rapide
                                                          </span>
                                                          <span className="font-bold text-[#FF6B00]">
                                                              85%
                                                          </span>
                                                      </div>
                                                      <div className="h-4 bg-gray-700/50 rounded-full overflow-hidden">
                                                          <div
                                                              className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF8124] bg-[length:200%_200%] animate-shimmer relative"
                                                              style={{ width: '85%' }}
                                                          >
                                                              <div
                                                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"
                                                                  style={{
                                                                      animationDuration:
                                                                          '2s',
                                                                  }}
                                                              />
                                                          </div>
                                                      </div>
                                                      <p className="mt-2 font-bold text-[#FF6B00]">
                                                          Sur le terrain : Capacité
                                                          exceptionnelle à identifier et
                                                          traiter les urgences sans se
                                                          disperser. Efficacité maximale
                                                          sous pression.
                                                      </p>
                                                  </div>
                                                  <div>
                                                      <div className="flex justify-between mb-2">
                                                          <span className="font-medium">
                                                              Arbitrage humain
                                                          </span>
                                                          <span className="font-bold text-[#3B82F6]">
                                                              78%
                                                          </span>
                                                      </div>
                                                      <div className="h-4 bg-gray-700/50 rounded-full overflow-hidden">
                                                          <div
                                                              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-[length:200%_200%] animate-shimmer relative"
                                                              style={{ width: '78%' }}
                                                          >
                                                              <div
                                                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10  to-transparent animate-pulse"
                                                                  style={{
                                                                      animationDuration:
                                                                          '2s',
                                                                  }}
                                                              />
                                                          </div>
                                                      </div>
                                                      <p className="mt-2 font-bold text-[#3B82F6]">
                                                          Sur le terrain : Bon équilibre
                                                          entre performance et facteur
                                                          humain. Sait prendre des
                                                          décisions difficiles sans
                                                          créer de tensions.
                                                      </p>
                                                  </div>
                                              </>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Global Synthesis Section */}
                  <div className="bg-gradient-to-br from-[#1A1E2E]/90 via-[#1F2437]/80 to-[#141824]/90 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20" />
                      <h2 className="text-2xl font-bold mb-6">Synthèse Globale</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="h-[400px] relative group">
                              <div className="absolute inset-0 bg-gradient-radial from-[#FF6B00]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                              <div className="absolute inset-[-1px] rounded-xl border border-[#FF6B00]/10 shadow-[0_0_30px_rgba(255,107,0,0.1)] animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                              <Radar
                                  ref={radarChartRef}
                                  data={spiderData}
                                  options={spiderOptions}
                              />
                          </div>
                          <div className="space-y-6">
                              <div className="bg-[#0A0E17]/50 rounded-lg p-6">
                                  <div className="flex items-center justify-between mb-4">
                                      <h3 className="text-xl font-bold">
                                          Score Global
                                      </h3>
                                      <div className="text-4xl font-bold text-[#FF6B00]">
                                          84%
                                      </div>
                                  </div>
                                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                      <div className="h-full w-[84%] bg-gradient-to-r from-[#FF6B00] to-[#FF8124]" />
                                  </div>
                              </div>
                              <div className="bg-[#0A0E17]/50 rounded-lg p-6">
                                  <h3 className="font-semibold mb-3 text-[#FF6B00]">
                                      Synthèse
                                  </h3>
                                  <p className="text-gray-300">
                                      Le candidat démontre une excellente maîtrise des
                                      points de non-retour (92%) et une forte capacité
                                      de priorisation (85%). Sa flexibilité (90%) et sa
                                      lecture adaptative (88%) sont remarquables,
                                      complétées par un bon arbitrage humain (78%). Les
                                      axes de progression concernent la stabilité sous
                                      pression (76%) et la lecture intuitive (67%). Son
                                      score global de 84% reflète un profil senior
                                      équilibré.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </Layout>
  );
};

export default ClientReportPage;
