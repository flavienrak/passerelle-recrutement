import React from 'react';

import { X } from 'lucide-react';
import { MatriceValueInterface } from '../../interfaces/client-report/MatriceValue.interface';
import { percentage } from '../../lib/function';

const colors = {
  orange: '#F97316',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  green: '#10B981',
  pink: '#EC4899',
  yellow: '#FBBF24',
  teal: '#14B8A6',
};

export default function SkillsLegend({
  average,
  result,
  values,
  onClose,
}: {
  average: number;
  result: number[];
  values: MatriceValueInterface;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const skills = [
    {
      id: 'lecture',
      title: 'Lecture du potentiel humain',
      value: percentage((values.m3 + values.m4 + values.m5) / 3),
      color: colors.pink,
      description:
        "Cette dimension évalue l'aptitude à comprendre les comportements, intentions et motivations d'autrui, ainsi qu'à adapter sa communication en conséquence.",
      contextDetails:
        'Sur le terrain, cela se manifeste par une intelligence relationnelle fine, une anticipation des réactions et une capacité à mobiliser les autres de manière subtile et efficace.',
      relatedSkills: [
        'Vision des problématiques',
        'Force créative',
        'Indépendance relationnelle',
      ],
    },
    {
      id: 'pilotage',
      title: 'Pilotage stratégique',
      value: percentage((values.m1 + values.m2) / 2),
      color: colors.blue,
      description:
        "Le pilotage stratégique désigne la capacité du candidat à structurer ses choix selon une logique d'action orientée résultats, en tenant compte des priorités, des contraintes et des opportunités.",
      contextDetails:
        'Sur le terrain, cela se traduit par une planification claire, une gestion rigoureuse des ressources et une vision opérationnelle alignée sur les objectifs.',
      relatedSkills: ["Sens de l'efficacité", 'Analyse des situations'],
    },
    {
      id: 'resilience',
      title: 'Résilience décisionnelle',
      value: percentage((values.m6 + values.m7) / 2),
      color: colors.purple,
      description:
        "La résilience décisionnelle reflète la capacité à prendre et assumer des décisions, même en contexte incertain, stressant ou conflictuel. Elle inclut le maintien de la lucidité sous pression, l'acceptation des erreurs et la capacité à rebondir.",
      contextDetails:
        "Sur le terrain, cela prend la forme d'un leadership adapté, une attitude constructive face à l'échec et une constance dans les choix.",
      relatedSkills: [
        'Remise en question constructive',
        "Agilité à piloter en s'adaptant",
      ],
    },
    {
      id: 'impregnation',
      title: "Niveau d'imprégnation métier (hors matrice cognitive)",
      value: percentage(average),
      color: colors.orange,
      description:
        "Ce niveau reflète l'intensité avec laquelle le candidat mobilise ses ressources cognitives et affectives pour s'engager dans l'action. Il ne s'agit pas d'émotivité, mais d'ancrage : un lien fort entre la mission et l'identité professionnelle.",
      contextDetails:
        "Sur le terrain, cela donne un collaborateur qui ne se contente pas d'exécuter, mais qui s'implique, assume, et fait corps avec les enjeux.",
      relatedSkills: [],
    },
  ];

  const metricsData = [
    {
      id: 'risque',
      title: 'Risque terrain',
      value: result[0],
      color: colors.blue,
      description:
        "Le candidat montre une bonne capacité à identifier les priorités opérationnelles dans un environnement structuré. Il peut gagner en impact lorsqu'il faut arbitrer rapidement entre des choix ambigus ou mal définis.",
      contextDetails:
        "Sur le terrain, c'est un profil sécurisant qui limite les erreurs, avec un bon potentiel d'adaptation à des enjeux plus flous s'il est bien cadré.",
    },
    {
      id: 'implication',
      title: 'Implication émotionnelle',
      value: result[1],
      color: colors.purple,
      description:
        "Le candidat investit ses ressources avec discernement, en s'appuyant sur des repères stables. Son implication est forte dans les environnements qu'il connaît. Il peut cependant temporiser face à des zones grises ou mal cadrées.",
      contextDetails:
        'Sur le terrain, cela donne un profil fiable, prudent, qui peut monter en puissance dans des contextes de plus en plus complexes.',
    },
    {
      id: 'decision',
      title: 'Force de décision',
      value: result[2],
      color: colors.green,
      description:
        "Le candidat dispose d'une bonne capacité d'analyse avec une attention fine aux nuances, ce qui lui permet d'éviter les décisions hâtives. Il montre un potentiel solide de renforcement si on l'accompagne vers plus de rapidité d'exécution.",
      contextDetails:
        "Sur le terrain, il s'agit d'un profil réfléchi, utile dans les décisions impliquant plusieurs parties ou des zones de tension.",
    },
  ];

  return (
    <div className="h-full p-4 overflow-y-auto flex flex-col gap-6">
      <div className="relative flex items-center">
        <h2 className="flex-1 text-center text-4xl font-bold text-white mb-2">
          Repères cognitifs
        </h2>
        <i
          onClick={() => onClose(false)}
          className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-white/10 cursor-pointer"
        >
          <X />
        </i>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-gray-800 rounded-lg p-5 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-16 h-16 min-w-16 min-h-16 rounded-full flex items-center justify-center bg-gray-700 border-4"
                style={{ borderColor: skill.color }}
              >
                <div className="text-center">
                  <div
                    className="text-lg font-bold"
                    style={{ color: skill.color }}
                  >
                    {skill.value}%
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold" style={{ color: skill.color }}>
                {skill.title}
              </h3>
            </div>

            <div className="text-[#F97316] font-medium mb-3">
              {skill.relatedSkills.join(' - ')}
            </div>

            <p className="mt-3 mb-4 text-white">{skill.description}</p>

            {skill.contextDetails && (
              <div className="mt-3 pt-3">
                <p className="text-gray-300">{skill.contextDetails}</p>
              </div>
            )}
          </div>
        ))}

        {metricsData.map((metric) => (
          <div
            key={metric.id}
            className="bg-gray-800 rounded-lg p-6 relative overflow-hidden"
          >
            {/* Background gradient effect */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, ${metric.color}22 0%, transparent 100%)`,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                {/* Circular progress indicator */}
                <div
                  className="min-w-16 min-h-16 rounded-full border-4 flex items-center justify-center relative"
                  style={{ borderColor: metric.color }}
                >
                  <span
                    className="text-xl font-bold"
                    style={{ color: metric.color }}
                  >
                    {metric.value}%
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{metric.title}</h3>
              </div>

              <p className="text-gray-300 mb-3">{metric.description}</p>

              <p className="text-gray-400 text-sm">{metric.contextDetails}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
