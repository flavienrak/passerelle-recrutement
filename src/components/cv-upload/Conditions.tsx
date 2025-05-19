import React from 'react';
import StepItem from './StepItem';
import Button from '../Button';

import { Mail, MessageCircle, Brain, GraduationCap } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updatePersistReducer } from '../../redux/slices/persist.slice';
import { Link } from 'react-router-dom';

export default function Conditions() {
  const dispatch = useDispatch();

  const [termsAccepted, setTermsAccepted] = React.useState(false);

  const steps = [
    {
      icon: <Mail size={24} />,
      text: 'Dépose ton CV et ton email',
    },
    {
      icon: <MessageCircle size={24} />,
      text: "Réponds à quelques questions, à l'écrit ou à l'oral",
    },
    {
      icon: <Brain size={24} />,
      text: 'Passe un test cognitif rapide',
    },
    {
      icon: <GraduationCap size={24} />,
      text: 'Découvre ton profil cognitif + obtiens une formation offerte pour améliorer ta préparation aux entretiens',
    },
  ];

  const handleAccept = () => {
    dispatch(updatePersistReducer({ acceptConditions: true }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#231818] text-white w-full max-w-md mx-4 rounded-lg overflow-hidden shadow-xl">
        <div className="p-6 flex flex-col items-center">
          {/* Logo and Title */}
          <div className="flex items-center mb-4">
            <img
              src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1747399186/BIG_LOGO_PNG_TRANSP-1_jrdtsu.png"
              alt="La Passerelle Logo"
              className="h-14 mr-3"
            />
            <div>
              <h2 className="text-xl font-bold">Bienvenue sur La Passerelle</h2>
              <h2 className="text-xl font-bold">Recrutement !</h2>
            </div>
          </div>

          {/* Process Steps */}
          <p className="text-gray-300 text-center mb-6">
            👋 Voici comment ça va se passer, en 4 étapes simples :
          </p>

          <div className="w-full space-y-5 mb-6">
            {steps.map((step, index) => (
              <StepItem key={index} icon={step.icon} text={step.text} />
            ))}
          </div>

          {/* Legal Text */}
          <div className="text-gray-400 text-sm text-center mb-4">
            <p className="mb-2">
              Pour te proposer une expérience personnalisée, ton profil sera
              analysé automatiquement par notre technologie et celles de nos
              partenaires.
            </p>
            <p>
              En validant, tu acceptes nos{' '}
              <Link to="/conditions" className="text-[#FF7A30] hover:underline">
                Conditions Générales
              </Link>{' '}
              et notre{' '}
              <Link to="/conditions" className="text-[#FF7A30] hover:underline">
                politique de confidentialité
              </Link>
              .
            </p>
          </div>

          <div className="w-full flex flex-col gap-6">
            {/* Checkbox */}
            <div className="flex items-center justify-center gap-2">
              <input
                type="checkbox"
                id="termsCheckbox"
                className="h-4 w-4 cursor-pointer"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label htmlFor="termsCheckbox" className="text-sm">
                J'ai lu et accepté les{' '}
                <Link
                  to="/conditions"
                  className="text-[#FF7A30] hover:underline"
                >
                  conditions d'utilisation
                </Link>
                .
              </label>
            </div>

            <Button
              disabled={!termsAccepted}
              onClick={handleAccept}
              className="w-full"
            >
              Je démarre
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
