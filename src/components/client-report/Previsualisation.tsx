import React from 'react';
import classNames from 'classnames';
import Card from '../Card';
import Button from '../Button';
import EmotionalLevel from '../../components/client-report/EmotionalLevel';
import InterviewSynthese from '../../components/client-report/InterviewSynthese';
import CvAnonym from '../../components/client-report/CvAnonym';
import ResultatCognitif from '../../components/client-report/ResultatCognitif';
import SyntheseGlobale from '../../components/client-report/SyntheseGlobale';

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { MatriceValueInterface } from '../../interfaces/client-report/MatriceValue.interface';
import { initialMatrice } from '../../lib/constants';
import { X } from 'lucide-react';
import { cvLabels } from '../../lib/cv-anonym/cvLabels';
import { EditCvAnonymInterface } from '../../interfaces/client-report/EditCvAnonym.interface';
import { EditSyntheseAnonymInterface } from '../../interfaces/client-report/EditSyntheseAnonym.interface';
import { syntheseLabels } from '../../lib/cv-anonym/syntheseLabels';
import { db } from '../../lib/firebase';
import { CvInterface } from '../../interfaces/Cv.interface';
import { updateUserReducer } from '../../redux/slices/user.slice';
import { AnswerInterviewInterface } from '../../interfaces/AnswerInterview.interface';

const initialEditCvAnonym = {
  label: '',
  title: '',
  initialTitle: '',
  date: '',
  initialDate: '',
  value: '',
  initialValue: '',
};

const initialEditSyntheseAnonym = {
  value: '',
  initialValue: '',
};

export default function Previsualisation({
  showHeader = true,
}: {
  showHeader?: boolean;
}) {
  const { cv, interviews, tests } = useSelector(
    (state: RootState) => state.user
  );
  const { userId } = useParams();

  const dispatch = useDispatch();
  const persistInfos = useSelector((state: RootState) => state.persistInfos);

  const [editable, setEditable] = React.useState(false);
  const [editCvAnonym, setEditCvAnonym] =
    React.useState<EditCvAnonymInterface>(initialEditCvAnonym);
  const [editSyntheseAnonym, setEditSyntheseAnonym] =
    React.useState<EditSyntheseAnonymInterface>(initialEditSyntheseAnonym);
  const [editCvLoading, setEditCvLoading] = React.useState(false);
  const [editSyntheseLoading, setEditSyntheseLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [selectedFamily, setSelectedFamily] = React.useState<string | null>(
    null
  );
  const [average, setAverage] = React.useState<number | null>(null);
  const [cognitifResult, setCognitifResult] = React.useState([0, 0, 0]);
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
    if (persistInfos.userId && userId) {
      setEditable(persistInfos.userId === userId);
    }
  }, [persistInfos.userId, userId]);

  React.useEffect(() => {
    if (tests.answers && tests.answers.length > 0) {
      const scores = tests.answers
        .filter((item) => item.questionNumber >= 0 && item.questionNumber <= 4)
        .map((item) => item.score);

      setAverage(
        scores.length > 0
          ? scores.reduce((acc, val) => acc + val, 0) / scores.length
          : 0
      );

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
        finalValues[`m${item.id}` as keyof MatriceValueInterface] = Math.max(
          0,
          Math.min(1, r)
        );
      });

      // 3️⃣ On met tout à jour **une seule fois**
      setValues(finalValues);
    }
  }, [tests.answers]);

  React.useEffect(() => {
    if (typeof average === 'number') {
      let newAverage = Math.ceil(average * 100);

      // Étape 1 : si divisible par 5, on ajoute ou retire 3 aléatoirement
      if (newAverage % 5 === 0) {
        const variation = Math.random() < 0.5 ? -3 : 3;
        newAverage += variation;
      }

      // Étape 2 : on génère 3 valeurs différentes avec un écart de ±5
      const data = Array.from({ length: 3 }, () => {
        const delta = Math.floor(Math.random() * 11) - 5; // nombre aléatoire entre -5 et 5
        return newAverage + delta;
      });

      setCognitifResult(data);
    }
  }, [average]);

  React.useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, 3000);

      // Nettoyage si le composant se démonte ou si copied change rapidement
      return () => clearTimeout(timeoutId);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/${userId}`)
      .then(() => {
        setCopied(true);
      });
  };

  const handleEditCvAnonym = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (cv) {
      let updatedCv: CvInterface | null = null;

      if (
        editCvAnonym.label === 'presentation' &&
        cv.presentation !== editCvAnonym.value.trim()
      ) {
        updatedCv = { ...cv, presentation: editCvAnonym.value.trim() };
      } else if (editCvAnonym.label === 'diplomes' && cv.diplomes_anonym) {
        const actualDiplome = cv.diplomes_anonym.find(
          (item, index) => index === editCvAnonym.index
        );

        if (actualDiplome && actualDiplome !== editCvAnonym.value.trim()) {
          updatedCv = {
            ...cv,
            diplomes_anonym: cv.diplomes_anonym.map((item, index) =>
              index === editCvAnonym.index ? editCvAnonym.value.trim() : item
            ),
          };
        }
      } else if (editCvAnonym.label === 'formations' && cv.formations_anonym) {
        const actualFormation = cv.formations_anonym.find(
          (item, index) => index === editCvAnonym.index
        );

        if (actualFormation && actualFormation !== editCvAnonym.value.trim()) {
          updatedCv = {
            ...cv,
            formations_anonym: cv.formations_anonym.map((item, index) =>
              index === editCvAnonym.index ? editCvAnonym.value.trim() : item
            ),
          };
        }
      } else if (
        editCvAnonym.label === 'competence' &&
        cv.competence_anonym &&
        cv.competence_anonym !== editCvAnonym.value.trim()
      ) {
        updatedCv = { ...cv, competence_anonym: editCvAnonym.value.trim() };
      } else if (
        editCvAnonym.label === 'experiences' &&
        cv.experiences_anonym
      ) {
        const actualExperience = cv.experiences_anonym.find(
          (item, index) => index === editCvAnonym.index
        );

        if (
          actualExperience &&
          editCvAnonym.title &&
          editCvAnonym.date &&
          editCvAnonym.company &&
          editCvAnonym.value &&
          ((editCvAnonym.title.trim().length > 0 &&
            actualExperience.title !== editCvAnonym.title?.trim()) ||
            (editCvAnonym.date.trim().length > 0 &&
              actualExperience.date !== editCvAnonym.date?.trim()) ||
            (editCvAnonym.company.trim().length > 0 &&
              actualExperience.company !== editCvAnonym.company?.trim()) ||
            (editCvAnonym.value.trim().length > 0 &&
              actualExperience?.description !== editCvAnonym.value.trim()))
        ) {
          updatedCv = {
            ...cv,
            experiences_anonym: cv.experiences_anonym.map((item, index) =>
              index === editCvAnonym.index &&
              editCvAnonym.title &&
              editCvAnonym.date &&
              editCvAnonym.company &&
              editCvAnonym.value
                ? {
                    title: editCvAnonym.title.trim(),
                    date: editCvAnonym.date.trim(),
                    company: editCvAnonym.company.trim(),
                    description: editCvAnonym.value.trim(),
                  }
                : item
            ),
          };
        }
      }

      if (updatedCv) {
        setEditCvLoading(true);
        await setDoc(doc(db, 'cvs', userId), { ...updatedCv }, { merge: true });

        const cvDocSnap = await getDoc(doc(db, 'cvs', userId));
        if (cvDocSnap.exists()) {
          const data: CvInterface = cvDocSnap.data();
          dispatch(updateUserReducer({ cv: data }));
        }

        setEditCvLoading(false);
      }
      setEditCvAnonym(initialEditCvAnonym);
    }
  };

  const handleEditSyntheseAnonym = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (interviews) {
      let updatedInterviews: AnswerInterviewInterface[] | null = null;

      const actualResponse = interviews.answers.find(
        (item) => item.questionNumber === editSyntheseAnonym.questionNumber
      );

      if (
        actualResponse &&
        actualResponse.answer_anonym !== editSyntheseAnonym.value.trim()
      ) {
        setEditSyntheseLoading(true);

        updatedInterviews = interviews.answers.map((item) =>
          item.questionNumber === editSyntheseAnonym.questionNumber
            ? {
                answer_anonym: editSyntheseAnonym.value.trim(),
                questionNumber: item.questionNumber,
                answer: item.answer,
                question: item.question,
              }
            : item
        );

        await setDoc(
          doc(db, 'interviews', userId),
          { answers: updatedInterviews },
          { merge: true }
        );

        const interviewsDocSnap = await getDoc(doc(db, 'interviews', userId));

        if (interviewsDocSnap.exists()) {
          const data: { answers: AnswerInterviewInterface[] } =
            interviewsDocSnap.data();

          if (Array.isArray(data.answers)) {
            dispatch(updateUserReducer({ interviews: data }));
          }
        }
      }

      setEditSyntheseAnonym(initialEditSyntheseAnonym);
    }
  };

  if (cv && average)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0E17] to-[#1A1E2E] text-white flex flex-col">
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto relative flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <a
                    href={'#cv'}
                    className="font-medium rounded-lg transition-all duration-200 focus:outline-none flex items-center justify-center py-2.5 px-5 bg-gradient-to-r from-[#FF6B00] to-[#FF8124] text-white hover:opacity-80"
                  >
                    CV
                  </a>
                  <a
                    href={'#pre-qualification'}
                    className="font-medium rounded-lg transition-all duration-200 focus:outline-none flex items-center justify-center py-2.5 px-5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white hover:opacity-80"
                  >
                    Lire la pré-qualification
                  </a>
                  <a
                    href={'#contact'}
                    className="font-medium rounded-lg transition-all duration-200 focus:outline-none flex items-center justify-center py-2.5 px-5 bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white hover:opacity-80"
                  >
                    Rapport du test cognitif
                  </a>
                  {showHeader && (
                    <Button
                      onClick={handleCopy}
                      className="bg-gradient-to-r from-[#10B981] to-[#10b918] text-white hover:opacity-80"
                    >
                      {copied ? 'Lien copié' : 'Copier le lien'}
                    </Button>
                  )}
                </div>
              </div>
              <img
                src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1745781614/Sans_titre-1_77_jst63e.png"
                alt="Logo"
                className="h-12"
              />
            </div>

            <div className="flex flex-col gap-12">
              <h2
                id={'cv'}
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8124] text-transparent bg-clip-text text-5xl font-bold"
              >
                CV Anonyme
              </h2>
              <CvAnonym
                cv={cv}
                editable={editable}
                setEditCvAnonym={setEditCvAnonym}
              />

              <h2
                id={'pre-qualification'}
                className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-transparent bg-clip-text text-5xl font-bold"
              >
                Synthèse pré-qualification
              </h2>
              {interviews && (
                <InterviewSynthese
                  interviews={interviews}
                  editable={editable}
                  setEditSyntheseAnonym={setEditSyntheseAnonym}
                />
              )}
            </div>

            <div className="flex flex-col gap-12">
              <h2
                id={'contact'}
                className="bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-transparent bg-clip-text text-5xl font-bold"
              >
                Rapport du test cognitif
              </h2>
              <div className="flex flex-col gap-8">
                {tests.answers && typeof average === 'number' && (
                  <EmotionalLevel average={average} result={cognitifResult} />
                )}

                <ResultatCognitif
                  values={values}
                  selectedFamily={selectedFamily}
                  setSelectedFamily={setSelectedFamily}
                />

                <SyntheseGlobale values={values} average={average} />
              </div>
            </div>
          </div>
        </div>

        {showHeader && editCvAnonym.label && (
          <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center p-4 rounded-xl bg-black/70 backdrop-blur-sm">
            <div className="h-full w-full flex justify-center items-center">
              <Card className="flex flex-col bg-gradient-to-br from-[#1F2437] via-[#161A2A] to-[#0A0E17] backdrop-blur-lg border-[#FF6B00]/10 shadow-[0_0_30px_rgba(255,107,0,0.1)]">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-medium text-white leading-relaxed">
                      {
                        cvLabels.find((item) => item.key === editCvAnonym.label)
                          ?.sing
                      }
                    </h2>
                    <i
                      onClick={() => setEditCvAnonym(initialEditCvAnonym)}
                      className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-white/10 cursor-pointer"
                    >
                      <X />
                    </i>
                  </div>

                  <form
                    onSubmit={handleEditCvAnonym}
                    className="flex-1 flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      {editCvAnonym.initialTitle && (
                        <input
                          id="title"
                          value={editCvAnonym.title}
                          onChange={(event) =>
                            setEditCvAnonym((prev) => ({
                              ...prev,
                              title: event.target.value,
                            }))
                          }
                          className={`w-full bg-[#0A0E17]/80 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 focus:border-transparent transition-all duration-200 hover:bg-[#0A0E17] ${
                            editCvLoading ? 'pointer-events-none' : ''
                          }`}
                          placeholder={editCvAnonym.initialTitle}
                        />
                      )}

                      {editCvAnonym.initialDate && (
                        <input
                          id="date"
                          value={editCvAnonym.date}
                          onChange={(event) =>
                            setEditCvAnonym((prev) => ({
                              ...prev,
                              date: event.target.value,
                            }))
                          }
                          className={`w-full bg-[#0A0E17]/80 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 focus:border-transparent transition-all duration-200 hover:bg-[#0A0E17] ${
                            editCvLoading ? 'pointer-events-none' : ''
                          }`}
                          placeholder={editCvAnonym.initialDate}
                        />
                      )}

                      {editCvAnonym.initialCompany && (
                        <input
                          id="company"
                          value={editCvAnonym.company}
                          onChange={(event) =>
                            setEditCvAnonym((prev) => ({
                              ...prev,
                              company: event.target.value,
                            }))
                          }
                          className={`w-full bg-[#0A0E17]/80 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 focus:border-transparent transition-all duration-200 hover:bg-[#0A0E17] ${
                            editCvLoading ? 'pointer-events-none' : ''
                          }`}
                          placeholder={editCvAnonym.initialCompany}
                        />
                      )}

                      <textarea
                        value={editCvAnonym.value}
                        onChange={(event) =>
                          setEditCvAnonym((prev) => ({
                            ...prev,
                            value: event.target.value,
                          }))
                        }
                        className={`flex-1 min-h-[14rem] min-w-[32rem] bg-[#0A0E17]/80 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]/20 resize-none ${
                          editCvLoading
                            ? 'pointer-events-none'
                            : 'hover:bg-[#0A0E17]/90'
                        }`}
                        placeholder={editCvAnonym.initialValue}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={
                        editCvLoading ||
                        (editCvAnonym.value === editCvAnonym.initialValue &&
                          editCvAnonym.title === editCvAnonym.initialTitle &&
                          editCvAnonym.date === editCvAnonym.initialDate &&
                          editCvAnonym.company === editCvAnonym.initialCompany)
                      }
                      className={classNames(
                        'w-full rounded-lg flex items-center justify-center gap-2 py-3 text-lg font-medium bg-gradient-to-r from-[#FF6B00] to-[#FF8124] text-white hover:from-[#FF8124] hover:to-[#FF9346] shadow-lg shadow-[#FF6B00]/20',
                        editCvAnonym.value === editCvAnonym.initialValue &&
                          editCvAnonym.title === editCvAnonym.initialTitle &&
                          editCvAnonym.date === editCvAnonym.initialDate &&
                          editCvAnonym.company ===
                            editCvAnonym.initialCompany &&
                          'opacity-50 cursor-not-allowed',
                        editCvLoading && 'opacity-50'
                      )}
                    >
                      {editCvLoading && (
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline w-6 h-6 animate-spin"
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
                      )}
                      <span>Mettre à jour</span>
                    </button>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        )}

        {showHeader &&
          typeof editSyntheseAnonym.questionNumber === 'number' && (
            <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center p-4 rounded-xl bg-black/70 backdrop-blur-sm">
              <div className="h-full w-full flex justify-center items-center">
                <Card className="flex flex-col bg-gradient-to-br from-[#1F2437] via-[#161A2A] to-[#0A0E17] backdrop-blur-lg border-[#FF6B00]/10 shadow-[0_0_30px_rgba(255,107,0,0.1)]">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-medium text-white leading-relaxed">
                        {
                          syntheseLabels.find(
                            (item) =>
                              item.questionNumber ===
                              editSyntheseAnonym.questionNumber
                          )?.value
                        }
                      </h2>
                      <i
                        onClick={() =>
                          setEditSyntheseAnonym(initialEditSyntheseAnonym)
                        }
                        className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-white/10 cursor-pointer"
                      >
                        <X />
                      </i>
                    </div>

                    <form
                      onSubmit={handleEditSyntheseAnonym}
                      className="flex-1 flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editSyntheseAnonym.value}
                          onChange={(event) =>
                            setEditSyntheseAnonym((prev) => ({
                              ...prev,
                              value: event.target.value,
                            }))
                          }
                          className={`flex-1 min-h-[14rem] min-w-[32rem] bg-[#0A0E17]/80 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]/20 resize-none ${
                            editSyntheseLoading
                              ? 'opacity-50'
                              : 'hover:bg-[#0A0E17]/90'
                          }`}
                          placeholder={editSyntheseAnonym.initialValue}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={
                          editSyntheseLoading ||
                          editSyntheseAnonym.value.trim().length === 0 ||
                          editSyntheseAnonym.value ===
                            editSyntheseAnonym.initialValue
                        }
                        className={classNames(
                          'w-full rounded-lg flex items-center justify-center gap-2 py-3 text-lg font-medium bg-gradient-to-r from-[#FF6B00] to-[#FF8124] text-white hover:from-[#FF8124] hover:to-[#FF9346] shadow-lg shadow-[#FF6B00]/20',
                          editSyntheseAnonym.value ===
                            editSyntheseAnonym.initialValue &&
                            'opacity-50 cursor-not-allowed',
                          editSyntheseLoading && 'opacity-50'
                        )}
                      >
                        {editSyntheseLoading && (
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-6 h-6 animate-spin"
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
                        )}
                        <span>Mettre à jour</span>
                      </button>
                    </form>
                  </div>
                </Card>
              </div>
            </div>
          )}

        {!showHeader && (
          <footer className="py-4 px-6 text-center text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} La Passerelle Recrutement. Tous
              droits réservés.
            </p>
          </footer>
        )}
      </div>
    );
}
