import React from 'react';
import classNames from 'classnames';

import { Briefcase, GraduationCap, Star, User } from 'lucide-react';
import { UserInterface } from '../../interfaces/User.interface';

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

export default function CvAnonym({ user }: { user: UserInterface }) {
  return (
    <section className="flex flex-col gap-6">
      <Section
        icon={<User className="w-6 h-6 text-blue-400" />}
        title="Introduction du profil"
      >
        <div className="space-y-4">
          <p className="whitespace-pre-line">{user.presentation}</p>
        </div>
      </Section>

      <Section
        icon={<GraduationCap className="w-6 h-6 text-blue-400" />}
        title="Diplômes et Formation"
      >
        <div className="space-y-4">
          {user.formation_anonym && (
            <p className="font-medium text-white mb-2">
              {user?.formation_anonym}
            </p>
          )}
        </div>
        <div className="space-y-4">
          {user.diplomes_anonym?.map((item, index) => (
            <p
              key={`diplome-${item}-index-${index}`}
              className="font-medium text-white"
            >
              {item}
            </p>
          ))}
        </div>
      </Section>

      <Section
        icon={<Star className="w-6 h-6 text-blue-400" />}
        title="Compétences clés"
      >
        <p className="whitespace-pre-line">{user.competence_anonym}</p>
      </Section>

      <Section
        icon={<Briefcase className="w-6 h-6 text-blue-400" />}
        title="Expériences professionnelles"
      >
        <div className="space-y-6">
          {user.experiences_anonym?.map((item, index) => (
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
    </section>
  );
}
