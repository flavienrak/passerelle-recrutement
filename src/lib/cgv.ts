const cgv = {
  title: 'Conditions Générales de Vente',
  date: 'Date d’édition : 18 mai 2025',
  content: [
    {
      id: 1,
      name: 'Objet et cadre général',
      value: `
        Les présentes Conditions Générales de Vente (ci-après désignées « CGV ») 
        ont pour vocation de définir les modalités selon lesquelles un opérateur 
        indépendant, agissant dans le cadre d’une activité non salariée, 
        propose à ses clients professionnels un ensemble de prestations de services, 
        incluant sans que cela soit limitatif : la fourniture d’outils technologiques 
        liés au recrutement, la mise à disposition d’interfaces SaaS dédiées 
        à l’optimisation de processus RH, le développement de solutions algorithmiques 
        d’aide à la décision, le conseil stratégique, ou encore l’organisation 
        de prestations intellectuelles ou logicielles dans un environnement web propriétaire.
      `,
    },
    {
      id: 2,
      name: 'Processus de contractualisation',
      value: `
        La validation d’un devis, la signature d’un contrat, ou le démarrage 
        explicite d’une prestation à la demande du Client vaut acceptation 
        sans réserve des présentes CGV. Cette acceptation s’étend à toute 
        documentation contractuelle jointe ou référencée, y compris les avenants, 
        fiches techniques, ou documents complémentaires, indépendamment du support 
        utilisé pour formaliser l’échange. Aucune condition particulière 
        ou générale communiquée par le Client ne pourra, sauf acceptation 
        écrite du Prestataire, prévaloir sur les présentes dispositions.
      `,
    },
    {
      id: 3,
      name: 'Commandes et modifications',
      value: `
        Toute commande est considérée comme ferme dès confirmation explicite 
        par le Client, que cette confirmation soit verbale, écrite, 
        ou implicite par usage. Le Prestataire se réserve le droit de 
        refuser toute commande non conforme ou contraire à ses valeurs éthiques, 
        techniques ou contractuelles. Toute demande de modification, de report 
        ou d’extension de la prestation initiale devra faire l’objet d’un accord bilatéral formel.
      `,
    },
    {
      id: 4,
      name: 'Tarification, facturation et modalités de règlement',
      value: `
        Les prix sont exprimés hors taxes et établis au cas par cas selon la 
        nature de la mission, la complexité technique, la durée estimée, 
        les moyens déployés et le degré d'urgence. Les conditions tarifaires 
        sont détaillées dans les devis ou accords particuliers et ne font l’objet 
        d’aucune publication standard. Aucune grille tarifaire publique 
        n’est mise à disposition du public. Les factures sont émises au démarrage 
        ou à la fin de la mission selon accord et sont exigibles à réception 
        sauf stipulation contraire. Le paiement s’effectue exclusivement par virement bancaire.
      `,
    },
    {
      id: 5,
      name: 'Retard ou défaut de paiement',
      value: `
        Tout retard de règlement entraînera de plein droit des pénalités 
        calculées au taux d’intérêt légal majoré, ainsi qu’une indemnité 
        forfaitaire pour frais de recouvrement de 40 € minimum, conformément 
        à l’article L441-10 du Code de commerce. En cas de non-paiement partiel 
        ou total, le Prestataire se réserve le droit de suspendre immédiatement 
        toute prestation sans mise en demeure préalable.
      `,
    },
    {
      id: 6,
      name: 'Responsabilités',
      value: `
        Le Prestataire s’engage à réaliser ses prestations avec diligence, 
        dans la limite des moyens convenus contractuellement, 
        sans obligation de résultat. Le Client demeure seul responsable 
        de l’exploitation des livrables, outils ou recommandations. 
        La responsabilité du Prestataire ne saurait être engagée pour 
        les dommages indirects, les pertes d’opportunités commerciales 
        ou tout impact lié à une mauvaise utilisation des systèmes mis à disposition.
      `,
    },
    {
      id: 7,
      name: 'Confidentialité et propriété intellectuelle',
      value: `
        Tous les contenus produits, modèles, prompts, scripts, structures 
        de base de données, analyses, algorithmes ou composants logiciels 
        livrés au Client restent, sauf disposition contraire, 
        la propriété intégrale, exclusive, et inaliénable du Prestataire 
        ou de ses concédants de licence. Toute reproduction ou diffusion 
        sans autorisation est strictement interdite. Les parties s’engagent 
        mutuellement à garder confidentiels les échanges, données et 
        éléments transmis dans le cadre de la mission.
      `,
    },
    {
      id: 8,
      name: 'Durée, résiliation et cas de force majeure',
      value: `
        Sauf mention contraire, les contrats prennent effet à la date de confirmation 
        de commande et demeurent valables jusqu’à l’exécution complète de la prestation. 
        Chaque partie peut y mettre un terme de manière anticipée en cas de manquement grave, 
        après mise en demeure restée sans effet. Les cas de force majeure 
        (interruption réseau, pandémie, panne généralisée, conflit armé, ou tout événement extérieur imprévisible) 
        suspendent les obligations contractuelles sans indemnité.
      `,
    },
    {
      id: 9,
      name: 'Données personnelles',
      value: `
        Le Client est informé que certaines données professionnelles et, dans certains cas, 
        données à caractère personnel, peuvent être collectées, traitées ou stockées 
        dans le cadre de l’exécution de la prestation. Ces traitements sont réalisés 
        conformément à la réglementation applicable (RGPD). 
        La Politique de Confidentialité détaillée encadre les modalités techniques de gestion, 
        y compris l’usage de solutions tierces pour le traitement algorithmique, 
        certaines pouvant recourir à des modèles de langage ou à des outils d’aide 
        à la rédaction automatiques, sur la base de partenaires techniques dont la 
        liste est consultable dans les annexes internes au système, ou par lecture 
        complète des documents juridiques publiés sur le site de l’entreprise.
      `,
    },
    {
      id: 10,
      name: 'Droit applicable – Juridiction compétente',
      value: `
        Les présentes CGV sont régies par le droit français. 
        Tout litige découlant de l’interprétation ou de l’exécution des 
        présentes relèvera de la compétence exclusive du Tribunal de commerce de Bobigny, 
        nonobstant pluralité de défendeurs ou appel en garantie.
      `,
    },
    {
      id: 11,
      name: 'Mentions obligatoires – Identification de l’entité prestataire',
      value: [
        {
          type: 'string',
          act: `
            L’ensemble des prestations décrites ci-dessus est fourni par une structure non-salariée 
            opérant dans un cadre réglementaire conforme aux exigences de 
            l’article L123-1-1 du Code de commerce, sous statut de micro-entreprise. 
            Cette entité, dont la dénomination déclarée est Corporate Company, 
            est administrativement enregistrée à l’adresse suivante : 
            6 rue Ferragus, 93300 Aubervilliers, France. Le titulaire légal et exploitant unique 
            de ladite entité est M. Victorien Amarouche, exerçant à titre personnel. 
            Les échanges électroniques doivent être adressés à victorien@lapasserellerecrutement.com. (SIRET :  807 804 703). 
          `,
        },
        {
          type: 'string',
          act: `Le site Internet utilisé comme support contractuel est accessible via l’URL suivante : `,
        },
        {
          type: 'link',
          act: `https://lapasserellerecrutement.com`,
        },
        {
          type: 'string',
          act: `Lequel centralise les interfaces de commande, contact et documentation.`,
        },
      ],
    },
    {
      id: 12,
      name: 'DTolérance, renonciation et indivisibilité',
      value: `
        Le fait pour l’une ou l’autre des parties de ne pas se prévaloir, 
        à un moment donné, de l’une quelconque des stipulations des présentes CGV 
        ne saurait être interprété comme valant renonciation à s’en prévaloir ultérieurement. 
        La nullité éventuelle d’une clause contractuelle n’entraîne pas la nullité 
        de l’ensemble des CGV, les autres dispositions conservant leur plein effet. 
        Dans l’hypothèse où une clause devait être déclarée nulle, les parties 
        s’engagent à la remplacer par une clause équivalente, juridiquement valable, 
        correspondant à l’esprit du contrat initial.
      `,
    },
    {
      id: 13,
      name: 'Interopérabilité et compatibilité technique',
      value: `
        Le Client est informé que certains services peuvent nécessiter 
        l’usage de navigateurs récents, d’outils tiers, ou de configurations 
        techniques particulières, incluant mais non limitées à : 
        JavaScript activé, cookies fonctionnels, débit Internet suffisant, 
        ou systèmes d’exploitation compatibles avec les formats standards 
        (ex. : PDF, .csv, .json). Aucune garantie n’est offerte quant 
        à la compatibilité absolue des outils fournis avec les logiciels, 
        API, ou systèmes propriétaires du Client. L’Entreprise décline 
        toute responsabilité en cas de mauvaise intégration locale non supervisée.
      `,
    },
    {
      id: 14,
      name: 'Clause de sauvegarde numérique',
      value: `
        Il appartient au Client de procéder, à intervalles réguliers, 
        à la sauvegarde locale de l’ensemble des données, livrables ou fichiers 
        produits dans le cadre de la mission. Le Prestataire décline 
        toute responsabilité en cas de perte de données résultant d’un défaut de téléchargement, 
        d’un dépassement de quota, ou d’une déconnexion du service de manière intempestive. 
        Les services fournis n’ont pas vocation à servir de solution de stockage à long terme.
      `,
    },
    {
      id: 15,
      name: 'Archivage et conservation des preuves',
      value: `
        Conformément aux articles 1366 et suivants du Code civil, les enregistrements électroniques, 
        emails, fichiers horodatés, logs de serveur, ainsi que toute forme d’archivage 
        numérique réalisés dans le cadre de la prestation pourront être considérés 
        comme éléments probants à part entière. Les documents contractuels peuvent 
        être conservés sous forme numérique à des fins de preuve pendant une durée 
        maximale de 10 ans, sauf demande contraire formulée par le Client dans les 
        délais légaux applicables.
      `,
    },
    {
      id: 16,
      name: 'Mise à jour des présentes CGV',
      value: `
        Le Prestataire se réserve le droit de modifier les présentes CGV à tout moment, 
        sans notification préalable. La version applicable est celle en vigueur à la 
        date de signature du contrat ou, à défaut, à la date de démarrage effectif de 
        la prestation. Une copie de la dernière version peut être fournie sur simple 
        demande adressée à l’adresse professionnelle mentionnée au sein des présentes.
      `,
    },
    {
      id: 17,
      name: 'Déclarations relatives à la conformité réglementaire',
      value: `
        Dans le respect de l’environnement légal encadrant les prestations de service, 
        le Prestataire atteste être en conformité avec les obligations sociales, fiscales 
        et comptables afférentes à son statut. Cette déclaration vaut au jour de la 
        contractualisation et pourra être renouvelée à la demande du Client lors d’un 
        contrôle ou d’un audit interne. Toute demande de certification, attestation sur 
        l’honneur ou justificatif administratif devra être formulée par écrit et dans un délai raisonnable.
      `,
    },
    {
      id: 18,
      name: 'Clause linguistique',
      value: `
        Les présentes CGV sont rédigées en langue française. En cas de traduction dans une autre langue, 
        seul le texte français fera foi en cas de litige. L’utilisation de termes techniques 
        anglo-saxons ou sectoriels ne saurait être interprétée comme une modification du droit 
        applicable ou du régime juridique en vigueur.
      `,
    },
    {
      id: 19,
      name: 'Dérogation contractuelle sectorielle',
      value: `
        Certaines prestations exécutées dans des secteurs spécifiques 
        (finance, médical, éducation, collectivités, structures subventionnées) 
        peuvent faire l’objet d’aménagements particuliers, notamment en matière de confidentialité, 
        de documentation, ou de cycles de validation. Ces adaptations ne sauraient constituer 
        une modification globale des présentes CGV, mais s’inscrivent dans une logique d’ajustement 
        ponctuel par accord bilatéral.
      `,
    },
    {
      id: 20,
      name: 'Clause d’inexistence de lien de subordination',
      value: `
        Le Client reconnaît expressément que le Prestataire agit de manière totalement indépendante, 
        sans lien hiérarchique, sans temps de présence imposé, et sans aucune subordination juridique. 
        Il ne saurait être considéré comme un salarié, ni comme un mandataire social du Client. 
        Aucune demande de déclaration préalable à l’embauche ne saurait être recevable, 
        sauf dans le cas particulier d’un contrat de travail séparé, dûment signé.
      `,
    },
  ],
};

export { cgv };
