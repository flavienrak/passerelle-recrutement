import React from 'react';
import classNames from 'classnames';
import Card from '../components/Card';
import Layout from '../components/Layout';
import axios from 'axios';

import { doc, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { Mic, StopCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { extractJson } from '../lib/function';
import {
  competenceAnonym,
  cvProcessing,
  diplomeAnonym,
  experienceAnonym,
  formationAnonym,
  presentationAnonym,
  responseAnonym,
} from '../lib/prompts';
import { interviewQuestions } from '../lib/constants';
import { CvInterface } from '../interfaces/Cv.interface';
import { updateUserReducer } from '../redux/slices/user.slice';
import { gpt3, gpt4 } from '../lib/openai';

function sanitizeOrder<T extends { content: string; order: any }[]>(
  array: T
): T {
  return array.map((item) => ({
    ...item,
    order: Number(item.order),
  })) as T;
}

export default function InterviewQuestionsPage() {
  const { cv, interviews } = useSelector((state: RootState) => state.user);
  const { userId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [loadingTranslation, setLoadingTranslation] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] =
    React.useState<MediaRecorder | null>(null);
  const [isLoadingResponse, setIsLoadingResponse] = React.useState(false);

  React.useEffect(() => {
    if (!cv) {
      navigate('/cv-upload');
    } else {
      if (
        !cv.completedSteps ||
        (cv.completedSteps && cv.completedSteps.interviewCompleted)
      ) {
        navigate(`/${userId}/test-landing`);
      } else {
        setCurrentQuestion(
          interviews.answers.length <= interviewQuestions.length
            ? interviews.answers.length
            : interviewQuestions.length
        );
      }

      if (
        cv.completedSteps &&
        cv.completedSteps.cvUploaded &&
        !cv.completedSteps.anonymisation
      ) {
        (async () => {
          // CV PROCESSING
          const openaiResponse = await gpt4([
            { role: 'system', content: cvProcessing.trim() },
            {
              role: 'user',
              content: `Contenu du CV : ${cv.cvContent}`.trim(),
            },
          ]);

          if (openaiResponse.content) {
            const itemData: {
              presentation: { content: string; order: number }[];
              diplomes: { content: string; order: number }[];
              formations: { content: string; order: number }[];
              competences: { content: string; order: number }[];
              experiences: { content: string; order: number }[];
            } = extractJson(openaiResponse.content);

            itemData.presentation = sanitizeOrder(itemData.presentation);
            itemData.diplomes = sanitizeOrder(itemData.diplomes);
            itemData.formations = sanitizeOrder(itemData.formations);
            itemData.competences = sanitizeOrder(itemData.competences);
            itemData.experiences = sanitizeOrder(itemData.experiences);

            await setDoc(
              doc(db, 'cvs', userId),
              {
                presentation: itemData.presentation[0].content ?? '',
                diplomes: itemData.diplomes,
                formations: itemData.formations,
                competences: itemData.competences,
                experiences: itemData.experiences,
              },
              { merge: true }
            );

            let messageContent = 'Contenu du CV :\n';

            if (itemData.presentation && itemData.presentation.length > 0) {
              messageContent += `\nPrésentation :\n${itemData.presentation[0].content}`;
            }

            if (itemData.diplomes && itemData.diplomes.length > 0) {
              messageContent += `\nDiplômes :\n${itemData.diplomes
                .map((c) => c.content)
                .join('\n')}`;
            }

            if (itemData.formations && itemData.formations.length > 0) {
              messageContent += `\nFormations :\n${itemData.formations
                .map((c) => c.content)
                .join('\n')}`;
            }

            if (itemData.competences && itemData.competences.length > 0) {
              messageContent += `\nCompétences :\n${itemData.competences
                .map((c) => c.content)
                .join('\n')}`;
            }

            if (itemData.experiences && itemData.experiences.length > 0) {
              messageContent += `\nExpériences :\n${itemData.experiences
                .map((c) => c.content)
                .join('\n')}`;
            }

            // PRESENTATION ANONYME
            if (itemData.presentation.length > 0) {
              const openaiItemResponse = await gpt3([
                { role: 'system', content: presentationAnonym.trim() },
                { role: 'user', content: messageContent.trim() },
              ]);

              if (openaiItemResponse.content) {
                const itemData: { content: string } = extractJson(
                  openaiItemResponse.content
                );

                await setDoc(
                  doc(db, 'cvs', userId),
                  { presentation_anonym: itemData.content },
                  { merge: true }
                );
              }
            }

            // DIPLOMES ANONYME
            if (itemData.diplomes.length > 0) {
              const openaiItemResponse = await gpt3([
                { role: 'system', content: diplomeAnonym.trim() },
                { role: 'user', content: messageContent.trim() },
              ]);

              if (openaiItemResponse.content) {
                const itemData: string[] = extractJson(
                  openaiItemResponse.content
                );

                await setDoc(
                  doc(db, 'cvs', userId),
                  { diplomes_anonym: itemData },
                  { merge: true }
                );
              }
            }

            // FORMATIONS ANONYME
            if (itemData.formations.length > 0) {
              const openaiItemResponse = await gpt3([
                { role: 'system', content: formationAnonym.trim() },
                { role: 'user', content: messageContent.trim() },
              ]);

              if (openaiItemResponse.content) {
                const itemData: { content: string }[] = extractJson(
                  openaiItemResponse.content
                );

                await setDoc(
                  doc(db, 'cvs', userId),
                  { formations_anonym: itemData },
                  { merge: true }
                );
              }
            }

            // COMPETENCES ANONYME
            if (itemData.competences.length > 0) {
              const openaiItemResponse = await gpt3([
                { role: 'system', content: competenceAnonym.trim() },
                { role: 'user', content: messageContent.trim() },
              ]);

              if (openaiItemResponse.content) {
                const itemData: { content: string } = extractJson(
                  openaiItemResponse.content
                );

                await setDoc(
                  doc(db, 'cvs', userId),
                  { competence_anonym: itemData.content },
                  { merge: true }
                );
              }
            }

            // EXPERIENCES ANONYME
            if (itemData.experiences.length > 0) {
              const openaiExperienceResponse = await gpt3([
                { role: 'system', content: experienceAnonym.trim() },
                { role: 'user', content: messageContent.trim() },
              ]);

              if (openaiExperienceResponse.content) {
                const itemData: {
                  title: string;
                  date: string;
                  company: string;
                  description: string;
                }[] = extractJson(openaiExperienceResponse.content);

                await setDoc(
                  doc(db, 'cvs', userId),
                  { experiences_anonym: itemData },
                  { merge: true }
                );
              }
            }

            await setDoc(
              doc(db, 'cvs', userId),
              { completedSteps: { anonymisation: true } },
              { merge: true }
            );
          }
        })();
      }
    }
  }, [userId, cv, interviews.answers]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.onstop = () => {};

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);

      mediaRecorder.ondataavailable = async (event) => {
        const audioBlob = new Blob([event.data], { type: 'audio/webm' }); // ou 'audio/mp3' si supporté
        const audioFile = new File([audioBlob], 'response.webm'); // nom du fichier obligatoire

        // Envoi à OpenAI pour transcription
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('model', 'whisper-1'); // modèle requis
        formData.append('language', 'fr'); // facultatif, pour forcer la langue

        try {
          setLoadingTranslation(true);
          const response = await axios.post(
            'https://api.openai.com/v1/audio/transcriptions',
            formData,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          handleSubmit({ audioAnswer: response.data.text });
        } catch (error) {
          console.error('Erreur transcription OpenAI:', error);
        }
      };
    }
  };

  const handleSubmit = async ({
    event,
    audioAnswer,
  }: {
    event?: React.FormEvent<HTMLFormElement>;
    audioAnswer?: string;
  }) => {
    if (event) {
      event.preventDefault();
    }

    if (
      answer.trim().length > 0 ||
      (audioAnswer && audioAnswer.trim().length > 0)
    ) {
      if (answer.trim().length > 0) {
        setIsLoadingResponse(true);
      }

      const openaiResponse = await gpt3([
        { role: 'system', content: responseAnonym.trim() },
        {
          role: 'user',
          content: `
            Question : ${interviewQuestions[currentQuestion].text}\n 
            Indication : ${interviewQuestions[currentQuestion].helper}\n
            Réponse : ${answer ? answer : audioAnswer}
          `.trim(),
        },
      ]);

      if (openaiResponse.content) {
        const itemData: { content: string } = extractJson(
          openaiResponse.content
        );

        await setDoc(
          doc(db, 'interviews', userId),
          {
            answers: arrayUnion({
              answer: audioAnswer ? audioAnswer.trim() : answer.trim(),
              answer_anonym: itemData.content,
              question: interviewQuestions[currentQuestion].text,
              questionNumber: currentQuestion,
            }),
          },
          { merge: true }
        );
      }

      if (currentQuestion < interviewQuestions.length - 1) {
        setAnswer('');
        setCurrentQuestion(currentQuestion + 1);
      } else {
        await setDoc(
          doc(db, 'cvs', userId),
          { completedSteps: { interviewCompleted: true } },
          { merge: true }
        );

        const cvDocSnap = await getDoc(doc(db, 'cvs', userId));

        if (cvDocSnap.exists()) {
          const data: CvInterface = cvDocSnap.data();
          dispatch(updateUserReducer({ cv: data }));
        }

        navigate(`/${userId}/test-landing`);
      }

      setIsLoadingResponse(false);
      setLoadingTranslation(false);
    }
  };

  return (
    <Layout currentStep={2}>
      <div className="flex flex-col items-center justify-center flex-1 px-4 h-[calc(100vh-theme(spacing.16))]">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-3">Votre expérience</h1>
            <p className="text-gray-300">
              Partagez votre parcours professionnel
            </p>
          </div>

          <Card className="flex flex-col bg-gradient-to-br from-[#1F2437] via-[#161A2A] to-[#0A0E17] backdrop-blur-lg border-[#FF6B00]/10 shadow-[0_0_30px_rgba(255,107,0,0.1)]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">
                    Q{currentQuestion + 1}
                  </span>
                  <span className="text-sm text-gray-400">sur 6</span>
                </div>
                <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF8124] transition-all duration-500 ease-out"
                    style={{
                      width: `${((currentQuestion + 1) / 6) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-medium text-white mb-3 leading-relaxed">
                  {interviewQuestions[currentQuestion].text}
                </h2>
                <p className="text-[#FF6B00] font-medium text-base bg-[#FF6B00]/5 rounded-lg px-4 py-2 inline-block">
                  {interviewQuestions[currentQuestion].helper}
                </p>

                <form
                  onSubmit={(event) => handleSubmit({ event })}
                  className="flex-1 flex flex-col gap-4"
                >
                  <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    className={`flex-1 min-h-40 bg-[#0A0E17]/80 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]/20 transition-all duration-300 resize-none ${
                      isRecording ? 'opacity-50' : ''
                    } hover:bg-[#0A0E17]/90`}
                    placeholder="Votre réponse..."
                    disabled={isRecording}
                  />

                  <div className="relative flex flex-col gap-2.5">
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        if (isRecording) {
                          stopRecording();
                        } else {
                          startRecording();
                        }
                      }}
                      className={`w-full rounded-lg flex items-center justify-center gap-2 py-3 text-lg font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all duration-300 ${
                        isRecording &&
                        'animate-[pulse_2s_ease-in-out_infinite] bg-[length:200%_200%] bg-[0%_0%]'
                      } ${isLoadingResponse ? 'pointer-events-none' : ''}`}
                    >
                      {isRecording ? (
                        <>
                          <StopCircle className="w-6 h-6" />
                          <span>Valider ma réponse</span>
                        </>
                      ) : loadingTranslation ? (
                        <p className="flex items-center justify-center gap-2 pointer-events-none">
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
                          <span>
                            Enregistrer et passer à la question suivante
                          </span>
                        </p>
                      ) : (
                        <>
                          <Mic className="w-6 h-6" />
                          <span>Cliquer ici pour répondre à l’oral</span>
                        </>
                      )}
                    </button>
                    <button
                      type="submit"
                      disabled={!answer.trim()}
                      className={classNames(
                        'w-full rounded-lg flex items-center justify-center gap-2 py-3 text-lg font-medium bg-gradient-to-r from-[#FF6B00] to-[#FF8124] text-white hover:from-[#FF8124] hover:to-[#FF9346] shadow-lg shadow-[#FF6B00]/20 transition-all duration-300',
                        !answer.trim() && 'opacity-50 cursor-not-allowed',
                        isRecording && 'opacity-0'
                      )}
                    >
                      {isLoadingResponse && (
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
                      <span>
                        Valider ma réponse à l’écrit et passer à la question
                        suivante
                      </span>
                    </button>
                  </div>
                </form>

                <div className="pt-2.5">
                  <p className="text-sm text-gray-200">
                    Vous pouvez répondre à l’oral ou à l’écrit. Nous ne gardons
                    pas les audios et les écrits brut, vos réponses sont
                    traitées par notre technologie avant d’être synthétisées et
                    transmises à l’entreprise.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
