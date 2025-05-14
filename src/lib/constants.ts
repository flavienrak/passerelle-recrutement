const interviewQuestions = [
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
    helper:
      'Tu peux raconter ton expérience précédente ou tout autre élément pertinent',
  },
];

const testQuestions = [
  {
    id: 1,
    question:
      "Vous avez une charge de travail très importante aujourd'hui. Vous décidez :",
    options: [
      {
        value:
          'Avancer un peu sur toutes les tâches même si aucune n’est terminée.',
        score: 0.25,
      },
      {
        value: "Continuer dans l'ordre prévu, sans prioriser.",
        score: 0.5,
      },
      {
        value: 'Prioriser uniquement les tâches urgentes et critiques.',
        score: 1,
      },
      {
        value: 'Demander à votre responsable de décider pour vous.',
        score: 0,
      },
    ],
  },
  {
    id: 2,
    question:
      'Un collègue vient de demander votre aide sur son poste, alors que vous êtes déjà occupé. Vous choisissez :',
    options: [
      {
        value: "Vous refusez par principe car ce n'est pas votre rôle.",
        score: 0.25,
      },
      {
        value:
          'Vous aidez immédiatement, même si vos tâches principales attendent.',
        score: 0.25,
      },
      {
        value: 'Vous ignorez la demande et continuez ce que vous faites.',
        score: 0,
      },
      {
        value:
          "Vous assurez d'abord que vos propres priorités sont couvertes avant d'aider.",
        score: 1,
      },
    ],
  },
  {
    id: 3,
    question:
      "Votre mission principale est ralentie à cause d'un problème matériel imprévu. Vous décidez :",
    options: [
      {
        value: 'Prévenir immédiatement votre supérieur et proposer un plan B.',
        score: 1,
      },
      {
        value:
          "Continuer d'attendre sans prévenir en espérant que ça s'arrange.",
        score: 0,
      },
      {
        value:
          'Chercher seul une solution rapide, même si ce n’est pas parfait.',
        score: 0.75,
      },
      {
        value: 'Rester bloqué sans oser rien changer. ',
        score: 0.25,
      },
    ],
  },
  {
    id: 4,
    question:
      "Un client ou un usager se plaint injustement de votre travail devant d'autres. Vous réagissez :",
    options: [
      {
        value:
          'Vous vous excusez immédiatement même si vous n’êtes pas en tort.',
        score: 0.25,
      },
      {
        value: "Vous répondez sèchement sous l'émotion.",
        score: 0,
      },
      {
        value: 'Vous gardez votre calme et proposez poliment une solution.',
        score: 1,
      },
      {
        value: 'Vous laissez passer sans répondre.',
        score: 0.5,
      },
    ],
  },
  {
    id: 5,
    question:
      'Un collègue perturbe souvent l’organisation de l’équipe. Vous décidez :',
    options: [
      {
        value: 'Vous signalez discrètement le problème à votre supérieur.',
        score: 0.75,
      },
      {
        value:
          "Vous l'évitez sans rien dire et restez concentré sur votre travail.",
        score: 0.25,
      },
      {
        value: 'Vous laissez faire car ce n’est pas votre problème.',
        score: 0,
      },
      {
        value: 'Vous essayez de le recadrer de manière posée.',
        score: 1,
      },
    ],
  },
  {
    id: 6,
    question:
      "En période de réduction de coûts, votre manager propose de choisir une seule formation à suivre pour l'année. Vous :",
    options: [
      {
        value:
          'Choisissez une formation rapide et facile pour ne pas vous compliquer la tâche.',
        score: 0.25,
      },
      {
        value:
          'Sélectionnez celle qui apporte vraiment une compétence utile à votre poste.',
        score: 1,
      },
      {
        value: 'Laissez votre responsable décider à votre place.',
        score: 0.1,
      },
      {
        value:
          "Insistez pour essayer d'en suivre plusieurs, même si ce n'est pas prioritaire.",
        score: 0.4,
      },
    ],
  },
  {
    id: 7,
    question:
      "L'équipe est trop nombreuse et votre responsable vous demande votre avis discret sur qui garder. Vous :",
    options: [
      {
        value:
          "Suggérez de prioriser ceux qui obtiennent de vrais résultats, même si c'est délicat.",
        score: 1,
      },
      {
        value: 'Refusez de donner un avis pour rester neutre.',
        score: 0.5,
      },
      {
        value: 'Choisissez les collègues avec qui vous vous entendez le mieux.',
        score: 0.25,
      },
      {
        value: "Proposez de protéger d'abord les plus jeunes par solidarité.",
        score: 0.4,
      },
    ],
  },
  {
    id: 8,
    question:
      'Votre équipe travaille sur une nouvelle procédure, mais après plusieurs jours, aucun progrès réel n’est visible. Vous :',
    options: [
      {
        value:
          "Attendez encore un peu, ça va peut-être s'améliorer naturellement.",
        score: 0.1,
      },
      {
        value:
          'Fixez une ultime date limite rapide pour décider en connaissance de cause.',
        score: 1,
      },
      {
        value:
          'Continuez le projet à tout prix pour éviter de reconnaître un échec.',
        score: 0.25,
      },
      {
        value:
          "Proposez d'arrêter maintenant pour éviter de perdre plus de ressources.",
        score: 0.8,
      },
    ],
  },
  {
    id: 9,
    question:
      "Un nouveau collègue arrive avec un parcours très différent du reste de l'équipe. Vous :",
    options: [
      {
        value:
          'Attendez de voir s’il rentre dans le moule avant de vous faire une opinion.',
        score: 0.25,
      },
      {
        value:
          'Cherchez tout de suite ce qu’il pourrait apporter de complémentaire.',
        score: 1,
      },
      {
        value: 'Évitez de travailler avec lui au début.',
        score: 0.1,
      },
      {
        value: 'Jugez surtout sa capacité à appliquer les procédures standard.',
        score: 0.4,
      },
    ],
  },
  {
    id: 10,
    question:
      'Pendant une réunion, un client critique ouvertement votre travail sur un point exagéré. Vous :',
    options: [
      { value: 'Répondez sur le même ton pour vous défendre.', score: 0.2 },
      {
        value: 'Restez calme, écoutez, et préparez une réponse structurée.',
        score: 1,
      },
      {
        value: 'Vous excusez immédiatement, même sans vérifier les faits.',
        score: 0.4,
      },
      {
        value: 'Attendez la fin de la réunion pour faire un point privé.',
        score: 0.8,
      },
    ],
  },
  {
    id: 11,
    question:
      'Votre N+2 vous sollicite un peu tardivement pour finaliser une tâche urgente. Vous :',
    options: [
      {
        value: 'Acceptez sans discuter, même si vous êtes très fatigué.',
        score: 0.1,
      },
      {
        value: 'Refusez poliment en expliquant vos limites.',
        score: 1,
      },
      {
        value: 'Dites oui mais vous le faites à contre-cœur',
        score: 0.3,
      },
      {
        value:
          'Proposez une autre solution tout en refusant d’être disponible ce jour-là.',
        score: 0.8,
      },
    ],
  },
  {
    id: 12,
    question:
      'Votre entreprise impose un nouvel outil de travail moins pratique. Vous :',
    options: [
      {
        value: "Acceptez de l'utiliser tel quel sans rien proposer.",
        score: 0.25,
      },
      {
        value: 'Suggérez calmement des ajustements ou alternatives possibles.',
        score: 1,
      },
      {
        value: "Utilisez l’outil en râlant sans rien tenter d'améliorer.",
        score: 0.4,
      },
      {
        value:
          'Essayez de contourner discrètement le nouvel outil pour garder vos habitudes.',
        score: 0.3,
      },
    ],
  },
  {
    id: 13,
    question: 'Après 10 heures sur une mission qui tourne mal, vous :',
    options: [
      {
        value:
          'Posez un état des lieux réaliste avant de décider si vous continuez.',
        score: 1,
      },
      {
        value:
          "Vous entêtez par principe, en pensant qu'abandonner serait un échec.",
        score: 0.3,
      },
      {
        value: 'Vous stoppez sans émotion si les indicateurs sont mauvais.',
        score: 0.8,
      },
      {
        value: "Continuez doucement en espérant que ça s'arrange.",
        score: 0.25,
      },
    ],
  },
  {
    id: 14,
    question:
      'Un supérieur vous fait un feedback mitigé : du positif et quelques critiques. Vous :',
    options: [
      {
        value:
          'Vous focalisez uniquement sur les critiques et doutez de vos compétences.',
        score: 0.25,
      },
      {
        value:
          "Vous prenez note sérieusement des axes d'amélioration sans perdre votre calme.",
        score: 1,
      },
      {
        value:
          'Vous remettez tout votre travail en question sans discernement.',
        score: 0.3,
      },
      {
        value:
          'Vous analysez ce qui est réellement actionnable et laissez le reste.',
        score: 0.8,
      },
    ],
  },
  {
    id: 15,
    question:
      "La veille d'un événement important, un problème imprévu majeur apparaît. Vous :",
    options: [
      {
        value: "Tentez d'improviser sous pression sans plan clair.",
        score: 0.2,
      },
      {
        value: 'Basculez immédiatement sur une solution alternative préparée.',
        score: 1,
      },
      {
        value: 'Restez bloqué, en attendant des ordres supérieurs.',
        score: 0.1,
      },
      {
        value: 'Respirez, priorisez, et adaptez calmement votre plan.',
        score: 0.8,
      },
    ],
  },
];

const responseEvaluations = [
  {
    id: 1,
    title: 'Risque de terrain',
    options: [
      {
        max: 1,
        min: 0.75,
        value:
          'Évalue les risques avec justesse et agit sans précipitation. Profil pragmatique, utile en contexte opérationnel tendu.',
      },
      {
        max: 0.74,
        min: 0.4,
        value:
          'Bonne base d’analyse du risque, peut gagner en confiance ou clarté sur certaines situations opérationnelles.',
      },
      {
        max: 0.4,
        min: 0,
        value:
          "Besoin d’un cadre clair pour sécuriser ses choix face à l’incertitude. Un accompagnement au cadrage renforce l'efficacité.",
      },
    ],
  },
  {
    id: 2,
    title: 'Implication émotionnelle',
    options: [
      {
        max: 1,
        min: 0.75,
        value:
          'Implique sans débordement. Bon équilibre entre engagement et recul émotionnel, même sous tension.',
      },
      {
        max: 0.74,
        min: 0.4,
        value:
          'Capacité à s’investir présente, mais parfois inégale selon le contexte. Peut encore progresser pour être plus pertinent dans ces décisions au quotidien.',
      },
      {
        max: 0.4,
        min: 0,
        value:
          'Peut être très engagé ou réservé selon les situations. Un cadre soutenant l’aide à garder le bon niveau d’implication.',
      },
    ],
  },
  {
    id: 3,
    title: 'Force de décision',
    options: [
      {
        max: 1,
        min: 0.75,
        value:
          "Décide avec assurance, même dans l'urgence. Bon réflexe de priorisation, très efficace même en environnement instable.",
      },
      {
        max: 0.74,
        min: 0.4,
        value:
          'Tendance à cadrer avant d’agir. Une structure claire renforce sa prise de décision.',
      },
      {
        max: 0.4,
        min: 0,
        value:
          'Préfère un environnement structurant pour décider sereinement. Un appui managérial permettra de le faire monter en compétence rapidement.',
      },
    ],
  },
];

const syntheseEvaluation = [
  {
    max: 1,
    min: 0.7,
    value:
      'Profil équilibré, combinant prise de recul, engagement et réactivité. Forte fiabilité en environnement complexe.',
  },
  {
    max: 0.69,
    min: 0,
    value: [
      "Profil avec des atouts identifiés. L'accompagnement adapté permet d’ancrer durablement son potentiel décisionnel.",
      'Profil présentant des leviers solides. Avec le bon encadrement, il peut renforcer sa prise de décision de manière pérenne.',
      'Des bases fiables pour évoluer. Un accompagnement ciblé permettra de consolider ses réflexes décisionnels.',
      'Le potentiel est là. Un cadre structurant favorisera une montée en puissance stable pour aller vers une meilleur prise de décision.',
    ],
  },
];

export {
  interviewQuestions,
  testQuestions,
  responseEvaluations,
  syntheseEvaluation,
};
