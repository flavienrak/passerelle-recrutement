import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  ExternalLink,
  ArrowRight,
  AlertTriangle,
  Presentation as PresentationChart,
  Zap,
} from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const MicroFormationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout currentStep={6} showBackButton onBack={() => navigate('/results')}>
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Micro Formation</h1>
            <p className="text-gray-300">
              3 astuces concrètes pour éviter les biais cognitifs en entretien
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="md:transform hover:translate-y-[-4px] transition-transform duration-300">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-[#FF6B00]/10 rounded-full p-3 mr-3">
                    <AlertTriangle size={24} className="text-[#FF6B00]" />
                  </div>
                  <h2 className="text-xl font-bold">Biais de confirmation</h2>
                </div>

                <p className="text-gray-300 mb-4">
                  Nous avons tendance à rechercher des informations qui
                  confirment nos croyances préexistantes.
                </p>

                <div className="p-3 bg-gray-800/40 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">
                    Comment éviter ce piège :
                  </h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li className="flex">
                      <ArrowRight
                        size={16}
                        className="text-[#FF6B00] mr-2 flex-shrink-0 mt-1"
                      />
                      <span>
                        Préparez des exemples concrets et chiffrés de vos
                        réalisations
                      </span>
                    </li>
                    <li className="flex">
                      <ArrowRight
                        size={16}
                        className="text-[#FF6B00] mr-2 flex-shrink-0 mt-1"
                      />
                      <span>
                        Restez factuel plutôt que de vous baser sur des
                        impressions
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="md:transform hover:translate-y-[-4px] transition-transform duration-300">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-[#FF6B00]/10 rounded-full p-3 mr-3">
                    <BrainCircuit size={24} className="text-[#FF6B00]" />
                  </div>
                  <h2 className="text-xl font-bold">Effet de récence</h2>
                </div>

                <p className="text-gray-300 mb-4">
                  Nous accordons plus d'importance aux informations reçues
                  récemment qu'à celles obtenues auparavant.
                </p>

                <div className="p-3 bg-gray-800/40 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">
                    Comment éviter ce piège :
                  </h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li className="flex">
                      <ArrowRight
                        size={16}
                        className="text-[#FF6B00] mr-2 flex-shrink-0 mt-1"
                      />
                      <span>
                        Terminez votre entretien par un résumé percutant de vos
                        points forts
                      </span>
                    </li>
                    <li className="flex">
                      <ArrowRight
                        size={16}
                        className="text-[#FF6B00] mr-2 flex-shrink-0 mt-1"
                      />
                      <span>
                        Envoyez un email de remerciement après l'entretien qui
                        rappelle vos atouts
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="md:transform hover:translate-y-[-4px] transition-transform duration-300">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-[#FF6B00]/10 rounded-full p-3 mr-3">
                    <PresentationChart size={24} className="text-[#FF6B00]" />
                  </div>
                  <h2 className="text-xl font-bold">Biais d'ancrage</h2>
                </div>

                <p className="text-gray-300 mb-4">
                  Nous nous appuyons trop sur la première information reçue lors
                  d'une prise de décision.
                </p>

                <div className="p-3 bg-gray-800/40 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">
                    Comment éviter ce piège :
                  </h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li className="flex">
                      <ArrowRight
                        size={16}
                        className="text-[#FF6B00] mr-2 flex-shrink-0 mt-1"
                      />
                      <span>
                        Faites une excellente première impression avec une
                        introduction soignée
                      </span>
                    </li>
                    <li className="flex">
                      <ArrowRight
                        size={16}
                        className="text-[#FF6B00] mr-2 flex-shrink-0 mt-1"
                      />
                      <span>
                        Évitez de partager des informations négatives en début
                        d'entretien
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <Card className="mb-8 bg-gradient-to-r from-[#1A1E2E] to-[#292E3E] border-[#FF6B00]/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-[#FF6B00]/10 rounded-full p-4">
                <Zap size={40} className="text-[#FF6B00]" />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">
                  Prêt à booster votre potentiel ?
                </h2>
                <p className="text-gray-300 mb-4">
                  Découvrez nos opportunités professionnelles adaptées à votre
                  profil cognitif. Nos employeurs partenaires valorisent la
                  diversité cognitive !
                </p>

                <Button
                  onClick={() => {
                    window.open('https://example.com/opportunities', '_blank');
                  }}
                  className="flex items-center"
                >
                  Découvrir nos opportunités
                  <ExternalLink size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <p className="text-lg text-gray-300 mb-6">
              Félicitations pour avoir complété le parcours La Passerelle
              Recrutement ! Vous disposez maintenant d'une meilleure
              compréhension de vos forces cognitives et d'outils pour les
              valoriser en entretien.
            </p>
            <Button
              onClick={() => {
                navigate('/results');
              }}
            >
              Revoir mes résultats
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MicroFormationPage;
