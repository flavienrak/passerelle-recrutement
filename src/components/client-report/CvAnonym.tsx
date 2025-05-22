import React from 'react';

import { Briefcase, GraduationCap, Pencil, Star, User } from 'lucide-react';
import { CvInterface } from '../../interfaces/Cv.interface';
import { cvLabels } from '../../lib/cv-anonym/cvLabels';
import { EditCvAnonymInterface } from '../../interfaces/client-report/EditCvAnonym.interface';

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ icon, title, children }) => {
  return (
    <div className="flex flex-col gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="prose prose-invert max-w-none">{children}</div>
    </div>
  );
};

export default function CvAnonym({
  cv,
  editable,
  setEditCvAnonym,
}: {
  cv: CvInterface;
  editable: boolean;
  setEditCvAnonym: React.Dispatch<React.SetStateAction<EditCvAnonymInterface>>;
}) {
  return (
    <section className="flex flex-col gap-6">
      <Section
        icon={<User className="w-6 h-6 text-blue-400" />}
        title={
          cvLabels.find((item) => item.key === 'presentation')?.value ?? ''
        }
      >
        <div className="flex gap-2 group">
          <p className="whitespace-pre-line">{cv.presentation_anonym}</p>
          {editable && (
            <button
              onClick={() =>
                setEditCvAnonym({
                  label: 'presentation',
                  initialValue: cv.presentation_anonym,
                  value: cv.presentation_anonym,
                })
              }
              className="h-max flex justify-center items-center gap-2 py-1 px-3 text-sm rounded-md bg-blue-500/20 hover:bg-blue-500/30 opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <Pencil size={12} />
              <span>Editer</span>
            </button>
          )}
        </div>
      </Section>

      <Section
        icon={<GraduationCap className="w-6 h-6 text-blue-400" />}
        title={cvLabels.find((item) => item.key === 'diplomes')?.value ?? ''}
      >
        <div className="flex flex-col gap-8">
          {cv.diplomes_anonym?.map((item, index) => (
            <div
              key={`diplome-${item}-index-${index}`}
              className="flex gap-2 group"
            >
              <p className="font-medium text-white border-l-2 border-blue-500/30 pl-4 whitespace-pre-line">
                {item}
              </p>

              {editable && (
                <button
                  onClick={() =>
                    setEditCvAnonym({
                      index,
                      label: 'diplomes',
                      initialValue: item,
                      value: item,
                    })
                  }
                  className="h-max flex justify-center items-center gap-2 py-1 px-3 text-sm rounded-md bg-blue-500/20 hover:bg-blue-500/30 opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Pencil size={12} />
                  <span>Editer</span>
                </button>
              )}
            </div>
          ))}

          {cv.formations_anonym && cv.formations_anonym.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-white">Formations</h2>

              <div className="flex flex-col gap-2">
                {cv.formations_anonym?.map((item, index) => (
                  <div
                    key={`diplome-${item}-index-${index}`}
                    className="flex gap-2 group"
                  >
                    <p className="font-medium text-white whitespace-pre-line">
                      {item}
                    </p>

                    {editable && (
                      <button
                        onClick={() =>
                          setEditCvAnonym({
                            index,
                            label: 'formations',
                            initialValue: item,
                            value: item,
                          })
                        }
                        className="h-max flex justify-center items-center gap-2 py-1 px-3 text-sm rounded-md bg-blue-500/20 hover:bg-blue-500/30 opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Pencil size={12} />
                        <span>Editer</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {cv.competence_anonym && (
        <Section
          icon={<Star className="w-6 h-6 text-blue-400" />}
          title="Compétences clés"
        >
          <div className="flex gap-2 group">
            <p className="whitespace-pre-line">{cv.competence_anonym}</p>
            {editable && (
              <button
                onClick={() =>
                  setEditCvAnonym({
                    label: 'competence',
                    initialValue: cv.competence_anonym ?? '',
                    value: cv.competence_anonym ?? '',
                  })
                }
                className="h-max flex justify-center items-center gap-2 py-1 px-3 text-sm rounded-md bg-blue-500/20 hover:bg-blue-500/30 opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <Pencil size={12} />
                <span>Editer</span>
              </button>
            )}
          </div>
        </Section>
      )}

      {cv.experiences_anonym && cv.experiences_anonym.length > 0 && (
        <Section
          icon={<Briefcase className="w-6 h-6 text-blue-400" />}
          title="Expériences professionnelles"
        >
          <div className="space-y-6">
            {cv.experiences_anonym?.map((item, index) => (
              <div
                key={`experience-${item}-index-${index}`}
                className="flex gap-2 group"
              >
                <div className="border-l-2 border-blue-500/30 pl-4">
                  <h3 className="text-lg font-medium text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 mb-2">Durée : {item.date}</p>
                  <p className="text-gray-400 mb-3">{item.company}</p>
                  <h4 className="text-white mb-2">Missions clés :</h4>

                  <p className="text-gray-300 flex items-start whitespace-pre-line">
                    {item.description}
                  </p>
                </div>

                {editable && (
                  <button
                    onClick={() =>
                      setEditCvAnonym({
                        index,
                        label: 'experiences',
                        title: item.title,
                        initialTitle: item.title,
                        date: item.date,
                        initialDate: item.date,
                        company: item.company,
                        initialCompany: item.company,
                        initialValue: item.description,
                        value: item.description,
                      })
                    }
                    className="h-max flex justify-center items-center gap-2 py-1 px-3 text-sm rounded-md bg-blue-500/20 hover:bg-blue-500/30 opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Pencil size={12} />
                    <span>Editer</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </section>
  );
}
