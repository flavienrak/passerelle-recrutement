import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import useTracking from '../hooks/useTracking';

const sectors = [
  'Technologie',
  'Finance',
  'Santé',
  'Éducation',
  'Marketing',
  'Ressources Humaines',
  'Autre'
];

const experienceLevels = [
  'Étudiant / Jeune diplômé',
  '1-3 ans',
  '4-7 ans',
  '8-12 ans',
  '12+ ans'
];

const positionTypes = [
  'Stage / Alternance',
  'Junior / Débutant',
  'Confirmé',
  'Senior / Expert',
  'Manager / Responsable'
];

const PrequalificationPage: React.FC = () => {
  const [sector, setSector] = useState('');
  const [experience, setExperience] = useState('');
  const [position, setPosition] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();
  const { trackEvent } = useTracking();
  
  useEffect(() => {
    // Redirect if CV wasn't uploaded
    if (!userData.completedSteps.cvUploaded) {
      navigate('/');
    }
  }, [userData, navigate]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!sector) {
      newErrors.sector = 'Veuillez sélectionner un secteur';
    }
    
    if (!experience) {
      newErrors.experience = 'Veuillez sélectionner votre niveau d\'expérience';
    }
    
    if (!position) {
      newErrors.position = 'Veuillez sélectionner un type de poste';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call/processing
    setTimeout(() => {
      updateUserData({
        sector,
        experience,
        position,
        completedSteps: {
          prequalificationCompleted: true
        }
      });
      
      trackEvent({
        name: 'prequalification_complete',
        properties: { sector, experience, position }
      });
      
      setIsSubmitting(false);
      navigate('/landing');
    }, 800);
  };
  
  return (
    <Layout currentStep={2} showBackButton onBack={() => navigate('/')}>
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Merci pour votre CV !</h1>
            <p className="text-gray-300">
              Afin de personnaliser votre expérience, merci de répondre à ces quelques questions.
            </p>
          </div>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="sector" className="block text-sm font-medium text-gray-200 mb-1">
                    Dans quel secteur travaillez-vous ou souhaitez-vous travailler ?
                  </label>
                  <select
                    id="sector"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 focus:border-transparent transition"
                  >
                    <option value="" disabled>Sélectionnez un secteur</option>
                    {sectors.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.sector && (
                    <p className="mt-1 text-sm text-red-500">{errors.sector}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-200 mb-1">
                    Quel est votre niveau d'expérience professionnelle ?
                  </label>
                  <select
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 focus:border-transparent transition"
                  >
                    <option value="" disabled>Sélectionnez votre expérience</option>
                    {experienceLevels.map((exp) => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-500">{errors.experience}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-200 mb-1">
                    Quel type de poste recherchez-vous ?
                  </label>
                  <select
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 focus:border-transparent transition"
                  >
                    <option value="" disabled>Sélectionnez un type de poste</option>
                    {positionTypes.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-500">{errors.position}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Commencer votre diagnostic Les recruteurs
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PrequalificationPage;