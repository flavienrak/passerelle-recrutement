import classNames from 'classnames';
import { doc, setDoc } from 'firebase/firestore';
import { Mic, StopCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';
import { db } from '../lib/firebase';

interface Question {
    text: string;
    helper: string;
}

const questions: Question[] = [
    {
        text: 'Quel est ton dernier (ou actuel) poste, que fais/faisais-tu au quotidien dans cette expérience ?',
        helper: 'Décrire les missions concrètes, tâches principales.',
    },
    {
        text: 'Quelles principales priorités ou urgences devais-tu gérer ?',
        helper: 'Mettre en lumière ce qui est important',
    },
    {
        text: 'Peux-tu citer une action précise que tu as menée et dont tu es fier(e) ?',
        helper: 'Faire ressortir un résultat concret, même petit.',
    },
    {
        text: 'Avec qui travaillais-tu principalement ? (clients, équipe, manager…)',
        helper: 'Clients, équipe, manager..➔ contexte relationnel réel',
    },
    {
        text: "Qu'as-tu appris de pratique ou de nouveau pendant cette expérience ?",
        helper: 'Des compétences que tu as développer ou consolider',
    },
    {
        text: 'As-tu un autre point important que tu aimerais partager au recruteur ?',
        helper: 'Tu peux raconter ton expérience précédente ou tout autre élément pertinent',
    },
];

const InterviewQuestionsPage: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [answers, setAnswers] = useState<{ answer: string; question: string }[]>([]);

    const navigate = useNavigate();
    const { userData, updateUserData } = useUser();

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const audioChunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => {
                audioChunks.push(e.data);
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                // Here you would typically upload the audio file
                console.log('Audio recording completed', audioBlob);
            };

            setMediaRecorder(recorder);
            recorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach((track) => track.stop());
            setIsRecording(false);
            handleNext();
        }
    };

    const handleNext = async () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setAnswers((prev) => [
                ...prev,
                {
                    answer,
                    question: questions[currentQuestion].text,
                    questionNumber: currentQuestion,
                },
            ]);
            setAnswer('');
        } else {
            // Last question completed, move to test
            updateUserData({
                completedSteps: {
                    interviewCompleted: true,
                },
            });

            const interviewsDocRef = doc(db, 'interviews', userData.email);
            await setDoc(interviewsDocRef, {
                answers: [
                    ...answers,
                    {
                        answer,
                        question: questions[currentQuestion].text,
                        questionNumber: currentQuestion,
                    },
                ],
                email: userData.email,
            });

            navigate('/test');
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
                                {questions[currentQuestion].text}
                            </h2>
                            <p className="text-[#FF6B00] font-medium text-base bg-[#FF6B00]/5 rounded-lg px-4 py-2 inline-block">
                                {questions[currentQuestion].helper}
                            </p>

                            <div className="flex-1 flex flex-col mt-6">
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className={`flex-1 min-h-[120px] bg-[#0A0E17]/80 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]/20 transition-all duration-300 resize-none ${isRecording ? 'opacity-50' : ''} hover:bg-[#0A0E17]/90`}
                                    placeholder="Votre réponse..."
                                    disabled={isRecording}
                                />
                                <div className="mt-4 relative h-[104px]">
                                    <div className="absolute inset-0 space-y-3">
                                        <button
                                            onClick={
                                                isRecording
                                                    ? stopRecording
                                                    : startRecording
                                            }
                                            className={`w-full rounded-lg flex items-center justify-center gap-2 py-3 text-lg font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all duration-300 ${
                                                isRecording &&
                                                'animate-[pulse_2s_ease-in-out_infinite] bg-[length:200%_200%] bg-[0%_0%]'
                                            }`}
                                        >
                                            {isRecording ? (
                                                <>
                                                    <StopCircle className="w-6 h-6" />
                                                    <span>Valider ma réponse</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Mic className="w-6 h-6" />
                                                    <span>Enregistrer ma réponse</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={!answer.trim()}
                                            className={classNames(
                                                'w-full rounded-lg flex items-center justify-center gap-2 py-3 text-lg font-medium bg-gradient-to-r from-[#FF6B00] to-[#FF8124] text-white hover:from-[#FF8124] hover:to-[#FF9346] shadow-lg shadow-[#FF6B00]/20 transition-all duration-300',
                                                !answer.trim() &&
                                                    'opacity-50 cursor-not-allowed',
                                                isRecording && 'opacity-0',
                                            )}
                                        >
                                            Question suivante
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default InterviewQuestionsPage;
