import React from 'react';
import classNames from 'classnames';
import Card from '../components/Card';
import Layout from '../components/Layout';
import axios from 'axios';

import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { Mic, StopCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { extractJson } from '../lib/function';
import { chat } from '../lib/openai';
import {
  competenceAnonym,
  cvProcessing,
  diplomeAnonym,
  experienceAnonym,
  formationAnonym,
  responseAnonym,
} from '../lib/prompts';
import { interviewQuestions } from '../lib/constants';
import { InterviewInterface } from '../interfaces/Interview.interface';
import { CvInterface } from '../interfaces/Cv.interface';

function sanitizeOrder<T extends { content: string; order: any }[]>(
  array: T
): T {
  return array.map((item) => ({
    ...item,
    order: Number(item.order),
  })) as T;
}

export default function InterviewQuestionsPage() {
  const { email } = useSelector((state: RootState) => state.persistInfos);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(true);
  const [interviews, setInterviews] = React.useState<InterviewInterface[]>([]);
  const [cvData, setCvData] = React.useState<CvInterface | null>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [loadingTranslation, setLoadingTranslation] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] =
    React.useState<MediaRecorder | null>(null);
  const [isLoadingResponse, setIsLoadingResponse] = React.useState(false);

  React.useEffect(() => {
    if (!email) {
      navigate('/');
    } else {
      (async () => {
        setIsLoading(true);
        const interviewsDocRef = doc(db, 'interviews', email);
        const interviewsDocSnap = await getDoc(interviewsDocRef);

        if (interviewsDocSnap.exists()) {
          const data: { answers: InterviewInterface[] } =
            interviewsDocSnap.data();

          if (Array.isArray(data.answers)) {
            setInterviews(data.answers);
          }
        }

        const cvDocRef = doc(db, 'cvs', email);
        const cvDocSnap = await getDoc(cvDocRef);

        if (cvDocSnap.exists()) {
          const data: CvInterface = cvDocSnap.data();
          setCvData(data);
        }

        setIsLoading(false);
      })();
    }
  }, [email]);

  React.useEffect(() => {
    if (!isLoading) {
      if (!cvData) {
        navigate('/cv-upload');
      } else if (cvData) {
        if (
          !cvData.completedSteps ||
          (cvData.completedSteps && cvData.completedSteps.interviewCompleted)
        ) {
          navigate('/test-landing');
        } else {
          setCurrentQuestion(interviews.length);
        }

        if (
          cvData.completedSteps &&
          cvData.completedSteps.cvUploaded &&
          !cvData.completedSteps.anonymisation
        ) {
          (async () => {
            // CV PROCESSING
            const openaiResponse = await chat([
              { role: 'system', content: cvProcessing.trim() },
              {
                role: 'user',
                content: `Contenu du CV : ${cvData.cvContent}`.trim(),
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
                doc(db, 'cvs', email),
                {
                  email,
                  presentation: itemData.presentation[0].content,
                  diplomes: itemData.diplomes,
                  formations: itemData.formations,
                  competences: itemData.competences,
                  experiences: itemData.experiences,
                },
                { merge: true }
              );

              let messageContent = 'Contenu du CV :\n';

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

              // DIPLOMES ANONYME
              if (itemData.diplomes.length > 0) {
                const openaiItemResponse = await chat([
                  { role: 'system', content: diplomeAnonym.trim() },
                  { role: 'user', content: messageContent.trim() },
                ]);

                if (openaiItemResponse.content) {
                  const itemData: string[] = extractJson(
                    openaiItemResponse.content
                  );

                  await setDoc(
                    doc(db, 'cvs', email),
                    { email, diplomes_anonym: itemData },
                    { merge: true }
                  );
                }
              }

              // FORMATION ANONYME
              if (itemData.formations.length > 0) {
                const openaiItemResponse = await chat([
                  { role: 'system', content: formationAnonym.trim() },
                  { role: 'user', content: messageContent.trim() },
                ]);

                if (openaiItemResponse.content) {
                  const itemData: { content: string } = extractJson(
                    openaiItemResponse.content
                  );

                  await setDoc(
                    doc(db, 'cvs', email),
                    { email, formation_anonym: itemData.content },
                    { merge: true }
                  );
                }
              }

              // COMPETENCES ANONYME
              if (itemData.competences.length > 0) {
                const openaiItemResponse = await chat([
                  { role: 'system', content: competenceAnonym.trim() },
                  { role: 'user', content: messageContent.trim() },
                ]);

                if (openaiItemResponse.content) {
                  const itemData: { content: string } = extractJson(
                    openaiItemResponse.content
                  );

                  await setDoc(
                    doc(db, 'cvs', email),
                    { email, competence_anonym: itemData.content },
                    { merge: true }
                  );
                }
              }

              // EXPERIENCES ANONYME
              if (itemData.experiences.length > 0) {
                const openaiExperienceResponse = await chat([
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
                    doc(db, 'cvs', email),
                    { email, experiences_anonym: itemData },
                    { merge: true }
                  );
                }
              }

              await setDoc(
                doc(db, 'cvs', email),
                { email, completedSteps: { anonymisation: true } },
                { merge: true }
              );
            }
          })();
        }
      }
    }
  }, [isLoading, cvData, interviews]);

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

      const interviewsDocRef = doc(db, 'interviews', email);
      const openaiResponse = await chat([
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
          interviewsDocRef,
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
          doc(db, 'cvs', email),
          { email, completedSteps: { interviewCompleted: true } },
          { merge: true }
        );

        navigate('/test-landing');
      }

      setIsLoadingResponse(false);
      setLoadingTranslation(false);
    }
  };

  return (
    <Layout currentStep={2}>
      <div className="flex flex-col items-center justify-center flex-1 px-4 h-[calc(100vh-theme(spacing.16))]">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-3">Votre expérience</h1>
            <p className="text-gray-300">
              Partagez votre parcours professionnel
            </p>
          </div>

          <Card className="bg-gradient-to-br from-[#1F2437] via-[#161A2A] to-[#0A0E17] backdrop-blur-lg border-[#FF6B00]/10 shadow-[0_0_30px_rgba(255,107,0,0.1)] h-[550px] flex flex-col">
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

              <h2 className="text-2xl font-medium text-white mb-3 leading-relaxed">
                {interviewQuestions[currentQuestion].text}
              </h2>
              <p className="text-[#FF6B00] font-medium text-base bg-[#FF6B00]/5 rounded-lg px-4 py-2 inline-block">
                {interviewQuestions[currentQuestion].helper}
              </p>

              <form
                onSubmit={(event) => handleSubmit({ event })}
                className="flex-1 flex flex-col mt-6"
              >
                <textarea
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  className={`flex-1 min-h-[120px] bg-[#0A0E17]/80 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]/20 transition-all duration-300 resize-none ${
                    isRecording ? 'opacity-50' : ''
                  } hover:bg-[#0A0E17]/90`}
                  placeholder="Votre réponse..."
                  disabled={isRecording}
                />
                <div className="mt-4 relative h-[104px]">
                  <div className="absolute inset-0 space-y-3">
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
                          <span>Traitement en cours...</span>
                        </p>
                      ) : (
                        <>
                          <Mic className="w-6 h-6" />
                          <span>Enregistrer ma réponse</span>
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
                      <span>Question suivante</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
