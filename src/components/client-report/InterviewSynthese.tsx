import React from 'react';

import {
  AlertTriangle,
  RotateCcw,
  Target,
  PenTool,
  Users,
  Zap,
  Pencil,
} from 'lucide-react';
import { AnswerInterviewInterface } from '../../interfaces/AnswerInterview.interface';
import { EditSyntheseAnonymInterface } from '../../interfaces/client-report/EditSyntheseAnonym.interface';
import { syntheseLabels } from '../../lib/cv-anonym/syntheseLabels';

export default function InterviewSynthese({
  interviews,
  editable,
  setEditSyntheseAnonym,
}: {
  interviews: { answers: AnswerInterviewInterface[] };
  editable: boolean;
  setEditSyntheseAnonym: React.Dispatch<
    React.SetStateAction<EditSyntheseAnonymInterface>
  >;
}) {
  const items = [
    {
      icon: PenTool,
      label: syntheseLabels.find((item) => item.questionNumber === 0),
      value: interviews.answers.find((item) => item.questionNumber === 0)
        ?.answer_anonym,
    },
    {
      icon: AlertTriangle,
      label: syntheseLabels.find((item) => item.questionNumber === 1),
      value: interviews.answers.find((item) => item.questionNumber === 1)
        ?.answer_anonym,
    },
    {
      icon: Zap,
      label: syntheseLabels.find((item) => item.questionNumber === 2),
      value: interviews.answers.find((item) => item.questionNumber === 2)
        ?.answer_anonym,
    },
    {
      icon: Users,
      label: syntheseLabels.find((item) => item.questionNumber === 3),
      value: interviews.answers.find((item) => item.questionNumber === 3)
        ?.answer_anonym,
    },
    {
      icon: Target,
      label: syntheseLabels.find((item) => item.questionNumber === 4),
      value: interviews.answers.find((item) => item.questionNumber === 4)
        ?.answer_anonym,
    },
    {
      icon: RotateCcw,
      label: syntheseLabels.find((item) => item.questionNumber === 5),
      value: interviews.answers.find((item) => item.questionNumber === 5)
        ?.answer_anonym,
    },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {items.map((item, index) => (
        <div
          key={`synthese-${index}`}
          className="flex flex-col gap-4 bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 group"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <item.icon className="w-6 h-6 text-[#FF6B00]" />
              <h3 className="text-lg font-semibold">{item.label?.value}</h3>
            </div>

            {editable && (
              <button
                onClick={() =>
                  setEditSyntheseAnonym({
                    questionNumber: item.label?.questionNumber,
                    initialValue: item.value ?? '',
                    value: item.value ?? '',
                  })
                }
                className="h-max flex justify-center items-center gap-2 py-1 px-3 text-sm rounded-md bg-blue-500/20 hover:bg-blue-500/30 opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <Pencil size={12} />
                <span>Editer</span>
              </button>
            )}
          </div>
          <p className="text-gray-300 text-sm whitespace-pre-line">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
