import React from 'react';
import Button from '../components/Button';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import EmotionalLevel from '../components/client-report/EmotionalLevel';
import InterviewSynthese from '../components/client-report/InterviewSynthese';
import CvAnonym from '../components/client-report/CvAnonym';
import ResultatCognitif from '../components/client-report/ResultatCognitif';
import SyntheseGlobale from '../components/client-report/SyntheseGlobale';

import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { InterviewInterface } from '../interfaces/Interview.interface';
import { UserInterface } from '../interfaces/User.interface';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { MatriceValueInterface } from '../interfaces/client-report/MatriceValue.interface';
import { initialMatrice } from '../lib/constants';

export default function ClientReportPage() {
  const { tests } = useSelector((state: RootState) => state.user);
  const { candidateEmail } = useParams();

  const navigate = useNavigate();

  const [userInfos, setUserInfos] = React.useState<UserInterface | null>(null);
  const [interviews, setInterviews] = React.useState<InterviewInterface[]>([]);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [selectedFamily, setSelectedFamily] = React.useState<string | null>(
    null
  );
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
    if (tests.answers && tests.answers.length > 0) {
      const finalValues = {} as MatriceValueInterface;

      // 1️⃣ On calcule d'abord la moyenne
      const withMoyennes = initialMatrice.map((item) => {
        const scores = item.value
          .map(
            (qn) =>
              tests.answers?.find((a) => a.questionNumber === qn)?.score ?? null
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
        finalValues[`m${item.id}` as keyof MatriceValueInterface] = r;
      });

      // 3️⃣ On met tout à jour **une seule fois**
      setValues(finalValues);
    }
  }, [tests.answers]);

  React.useEffect(() => {
    if (candidateEmail) {
      (async () => {
        const cvDocRef = doc(db, 'cvs', candidateEmail);
        const cvDocSnap = await getDoc(cvDocRef);

        if (cvDocSnap.exists()) {
          const data: UserInterface = cvDocSnap.data();

          setUserInfos(data);
        }

        const interviewsDocRef = doc(db, 'interviews', candidateEmail);
        const docSnap = await getDoc(interviewsDocRef);

        if (docSnap.exists()) {
          const data: { answers: InterviewInterface[] } = docSnap.data();
          setInterviews(data.answers);
        }
      })();
    }
  }, [candidateEmail]);

  if (userInfos)
    return (
      <Layout showBackButton onBack={() => navigate(-1)}>
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto relative flex flex-col gap-8">
            <div className="flex items-center justify-between">
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

            <div className="flex flex-col gap-12">
              <h2 className="text-5xl font-bold">CV Anonyme</h2>
              <CvAnonym user={userInfos} />

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

              <h2 className="text-5xl font-bold">Synthèse pré-qualification</h2>
              {interviews && <InterviewSynthese interviews={interviews} />}
            </div>

            <div className="flex flex-col gap-12">
              <h2 className="text-5xl font-bold">
                Résultats cognitifs professionnels
              </h2>
              <div className="flex flex-col gap-8">
                {tests.answers && (
                  <EmotionalLevel
                    tests={tests.answers.filter(
                      (item) =>
                        item.questionNumber >= 0 && item.questionNumber <= 4
                    )}
                  />
                )}

                <ResultatCognitif
                  values={values}
                  selectedFamily={selectedFamily}
                  setSelectedFamily={setSelectedFamily}
                />

                <SyntheseGlobale values={values} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
}
