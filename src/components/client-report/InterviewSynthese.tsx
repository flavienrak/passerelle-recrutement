import React from 'react';

import {
  AlertTriangle,
  RotateCcw,
  Target,
  PenTool,
  Users,
  Zap,
} from 'lucide-react';
import { InterviewInterface } from '../../interfaces/Interview.interface';

export default function InterviewSynthese({
  interviews,
}: {
  interviews: InterviewInterface[];
}) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <PenTool className="w-6 h-6 text-[#FF6B00]" />
          <h3 className="text-lg font-semibold">
            Activités réalisées récemment
          </h3>
        </div>
        <p className="text-gray-300 text-sm">
          {interviews.find((item) => item.questionNumber === 0)?.answer_anonym}
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
          {interviews.find((item) => item.questionNumber === 1)?.answer_anonym}
        </p>
      </div>

      <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-[#FF6B00]" />
          <h3 className="text-lg font-semibold">Action différenciante</h3>
        </div>
        <p className="text-gray-300 text-sm">
          {interviews.find((item) => item.questionNumber === 2)?.answer_anonym}
        </p>
      </div>

      <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-[#FF6B00]" />
          <h3 className="text-lg font-semibold">Interlocuteurs réguliers</h3>
        </div>
        <p className="text-gray-300 text-sm">
          {interviews.find((item) => item.questionNumber === 3)?.answer_anonym}
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
          {interviews.find((item) => item.questionNumber === 4)?.answer_anonym}
        </p>
      </div>

      <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <RotateCcw className="w-6 h-6 text-[#FF6B00]" />
          <h3 className="text-lg font-semibold">Le mot du candidat</h3>
        </div>
        <p className="text-gray-300 text-sm">
          {interviews.find((item) => item.questionNumber === 5)?.answer_anonym}
        </p>
      </div>
    </section>
  );
}
