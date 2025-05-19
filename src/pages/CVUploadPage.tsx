import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import FileUpload from '../components/FileUpload';
import Layout from '../components/Layout';

import { useNavigate } from 'react-router-dom';
import { extractTextFromDocx, extractTextFromPDF } from '../lib/function';
import { updatePersistReducer } from '../redux/slices/persist.slice';
import { useDispatch, useSelector } from 'react-redux';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RootState } from '../redux/store';
import Conditions from '../components/cv-upload/Conditions';

export default function CvUploadPage() {
  const { acceptConditions } = useSelector(
    (state: RootState) => state.persistInfos
  );

  const dispatch = useDispatch();

  const [email, setEmail] = React.useState('');
  const [cv, setCv] = React.useState<File | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Veuillez entrer votre email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }

    if (!cv) {
      newErrors.cv = 'Veuillez déposer votre CV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (ext === 'pdf') return await extractTextFromPDF(file);
    if (ext === 'docx') return await extractTextFromDocx(file);
    return '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    if (cv && email) {
      dispatch(updatePersistReducer({ email }));
      const cvContent = await handleFile(cv);

      await setDoc(
        doc(db, 'cvs', email),
        {
          email,
          cvContent: cvContent.trim(),
          acceptConditions: true,
          completedSteps: {
            cvUploaded: true,
            anonymisation: false,
          },
        },
        { merge: true }
      );
    }

    setIsSubmitting(false);
    navigate('/interview');
  };

  return (
    <Layout currentStep={1}>
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Déposez votre CV</h1>
            <p className="text-gray-300"></p>
          </div>

          <Card className="bg-gradient-to-b from-[#1F2437] to-[#161A2A] backdrop-blur-lg border-gray-700/50 shadow-2xl">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0A0E17]/80 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 focus:border-transparent transition-all duration-200 hover:bg-[#0A0E17]"
                    placeholder="jean.dupont@exemple.fr"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <FileUpload
                    onFileSelected={(file) => setCv(file)}
                    accept=".pdf,.docx"
                    label="Déposez votre CV ici"
                  />
                  {errors.cv && (
                    <p className="mt-1 text-sm text-red-500">{errors.cv}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="mt-4 py-3 text-lg font-medium bg-gradient-to-r from-[#FF6B00] to-[#FF8124] hover:from-[#FF8124] hover:to-[#FF9346] transition-all duration-300 shadow-lg shadow-[#FF6B00]/20"
                >
                  Compléter mon profil en 2 minutes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {!acceptConditions && <Conditions />}
      </div>
    </Layout>
  );
}
