import React from 'react';
import classNames from 'classnames';

import { Briefcase, GraduationCap, Star, User } from 'lucide-react';
import { CvInterface } from '../../interfaces/Cv.interface';

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ icon, title, children }) => (
  <div
    className={classNames(
      'bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20',
      classNames
    )}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
    <div className="prose prose-invert max-w-none">{children}</div>
  </div>
);

export default function CvAnonym({ cv }: { cv: CvInterface }) {
  return (
    <section className="flex flex-col gap-6">
      <Section
        icon={<User className="w-6 h-6 text-blue-400" />}
        title="Introduction du profil"
      >
        <div className="space-y-4">
          <p className="whitespace-pre-line">{cv.presentation}</p>
        </div>
      </Section>

      <Section
        icon={<GraduationCap className="w-6 h-6 text-blue-400" />}
        title="Diplômes"
      >
        <div className="flex flex-col gap-8">
          {cv.diplomes_anonym?.map((item, index) => (
            <p
              key={`diplome-${item}-index-${index}`}
              className="font-medium text-white leading-4 border-l-2 border-blue-500/30 pl-4 whitespace-pre-line"
            >
              {item}
            </p>
          ))}
          {cv.formations_anonym && cv.formations_anonym.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-white">Formations</h2>
              {cv.formations_anonym?.map((item, index) => (
                <p
                  key={`diplome-${item}-index-${index}`}
                  className="font-medium text-white leading-4 whitespace-pre-line"
                >
                  {item}
                </p>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section
        icon={<Star className="w-6 h-6 text-blue-400" />}
        title="Compétences clés"
      >
        <p className="whitespace-pre-line">{cv.competence_anonym}</p>
      </Section>

      {cv.experiences_anonym && cv.experiences_anonym.length > 0 && (
        <Section
          icon={<Briefcase className="w-6 h-6 text-blue-400" />}
          title="Expériences professionnelles"
        >
          <div className="space-y-6">
            {cv.experiences_anonym?.map((item, index) => (
              <div
                key={`experience-${item}-index-${index}`}
                className="border-l-2 border-blue-500/30 pl-4"
              >
                <h3 className="text-lg font-medium text-white">{item.title}</h3>
                <p className="text-gray-400 mb-2">Durée : {item.date}</p>
                <p className="text-gray-400 mb-3">{item.company}</p>
                <h4 className="text-white mb-2">Missions clés :</h4>

                <p className="text-gray-300 flex items-start whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </section>
  );
}
