import React from 'react';

import { X } from 'lucide-react';
import { MatriceValueInterface } from '../../interfaces/client-report/MatriceValue.interface';
import { percentage } from '../../lib/function';
import { colors } from '../../lib/colors';

export default function SkillsLegend({
  average,
  values,
  onClose,
}: {
  average: number;
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
  return (
    <div className="h-full p-4 overflow-y-auto flex flex-col gap-8">
      <div className="relative flex items-center">
        <h2 className="flex-1 text-center text-4xl font-bold text-white">
          Repères cognitifs
        </h2>
        <i
          onClick={() => onClose(false)}
          className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-white/10 cursor-pointer"
        >
          <X />
        </i>
      </div>
      <div className="flex flex-col gap-2">
        <p>
          Ce test évalue les dynamiques internes qui influencent la performance
          professionnelle. Il repose sur trois grandes familles cognitives :
        </p>
        <ul className="list-disc list-inside">
          <li>
            <strong>Pilotage Stratégique :</strong> capacité à structurer
            l’action, prioriser, viser un résultat.
          </li>
          <li>
            <strong>Résilience Décisionnelle :</strong> manière de réagir sous
            pression ou en contexte incertain.
          </li>
          <li>
            <strong>Lecture du Potentiel Humain :</strong> aptitude à comprendre
            les autres et à s’y ajuster.
          </li>
        </ul>
        <p>
          Chaque famille regroupe plusieurs matrices cognitives, analysées via
          des questions de mises en situation. Les résultats révèlent des
          tendances dans la façon de gérer des situations, ces tendances ne sont
          pas figées. En complément, le Niveau d’imprégnation métier mesure
          l’intensité avec laquelle le candidat s’engage émotionnellement dans
          sa mission. C’est un indicateur de motivation, de présence et de
          projection à long terme.
        </p>
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
      </div>
    </div>
  );
}
