import {defineProductDemoSpec} from "../contracts/productDemo";

const atelierSourceRevision = "fc7735c3f459da89b5a2339bd82e2b503f077f09";
const asset = (name: string) =>
  `https://raw.githubusercontent.com/EagleFox31/atelier2026/${atelierSourceRevision}/public/features/${name}`;

const atelierBrand = {
  name: "Atelier Maître",
  palette: {
    background: "#17120f",
    surface: "#fffaf5",
    surfaceAlt: "#f6e9dd",
    text: "#fffaf5",
    muted: "#dfcec0",
    primary: "#c8511a",
    accent: "#f3ad7b",
    secondary: "#8b3210"
  },
  typography: {
    family: 'Inter, "Segoe UI", Arial, sans-serif',
    headingWeight: 800,
    bodyWeight: 500
  }
} as const;

export const atelierMaitreGeneralDemo = defineProductDemoSpec({
  schemaVersion: "1",
  id: "atelier-maitre-general-sales-demo-fr",
  locale: "fr",
  product: {
    name: "Atelier Maître",
    descriptor: "Gestion opérationnelle d'atelier automobile",
    website: "atelier.trigenys.com",
    sourceRepository: "EagleFox31/atelier2026",
    sourceRevision: atelierSourceRevision
  },
  audience: {
    label: "Démonstration générale",
    goal: "Comprendre le parcours atelier de bout en bout"
  },
  brand: atelierBrand,
  scenes: [
    {
      id: "intro",
      kind: "intro",
      eyebrow: "Atelier Maître",
      title: "Piloter l'atelier sans perdre le fil",
      summary:
        "Une vue cohérente des rendez-vous, ordres de travail, techniciens, pièces, devis, factures et indicateurs d'activité.",
      bullets: [
        "Pensé pour les opérations réelles d'un atelier automobile.",
        "Les actions atelier, stock et facturation restent reliées au même dossier.",
        "Interface en français, montants en XAF et paramètres de taxes configurables."
      ],
      durationSeconds: 20
    },
    {
      id: "dashboard",
      eyebrow: "01 · Vue d'ensemble",
      title: "Voir ce qui demande votre attention",
      summary:
        "Le tableau de bord rassemble les informations utiles au pilotage quotidien sans obliger l'équipe à recouper plusieurs fichiers.",
      screenshot: {src: asset("dashboard-desktop.png"), alt: "Tableau de bord Atelier Maître"},
      bullets: [
        "Accéder rapidement aux éléments opérationnels du jour.",
        "Repérer les dossiers qui avancent et ceux qui nécessitent une action.",
        "Garder une lecture commune entre réception, atelier et gestion."
      ],
      durationSeconds: 35
    },
    {
      id: "workshop",
      eyebrow: "02 · Ordres de travail",
      title: "Suivre chaque intervention du diagnostic à la clôture",
      summary:
        "Un ordre de travail centralise le véhicule, le client, le diagnostic, les travaux, les pièces, les devis, la facturation et l'historique de statut.",
      screenshot: {src: asset("workshop-detail-desktop.png"), alt: "Détail d'un ordre de travail Atelier Maître"},
      bullets: [
        "Transitions contrôlées : reçu, diagnostic, devis, travaux, contrôle qualité, prêt, facturé puis clôturé.",
        "Affectation d'un responsable ou technicien au dossier.",
        "Historique de statut pour comprendre où en est réellement le véhicule."
      ],
      durationSeconds: 50
    },
    {
      id: "planning",
      eyebrow: "03 · Planning",
      title: "Organiser les passages et l'occupation de l'atelier",
      summary:
        "Le planning permet de positionner les rendez-vous, visualiser la journée et convertir un rendez-vous en ordre de travail lorsque le véhicule arrive.",
      screenshot: {src: asset("planning-desktop.png"), alt: "Planning de l'atelier Atelier Maître"},
      bullets: [
        "Rendez-vous associés au client et au véhicule.",
        "Lecture de l'occupation des baies et des créneaux de la journée.",
        "Passage du rendez-vous à l'ordre de travail sans ressaisie inutile."
      ],
      durationSeconds: 45
    },
    {
      id: "stock",
      eyebrow: "04 · Pièces et stock",
      title: "Relier les pièces consommées au travail réalisé",
      summary:
        "Le stock n'est pas isolé : les mouvements de pièces accompagnent les interventions afin de garder une vision opérationnelle de la disponibilité.",
      screenshot: {src: asset("stock-desktop.png"), alt: "Gestion de stock Atelier Maître"},
      bullets: [
        "Consulter les pièces et leur disponibilité.",
        "Tracer les mouvements de stock.",
        "Rattacher la consommation de pièces au cycle de l'intervention."
      ],
      durationSeconds: 40
    },
    {
      id: "billing",
      eyebrow: "05 · Devis et facturation",
      title: "Passer du diagnostic au montant à facturer",
      summary:
        "Les devis et factures restent liés à l'ordre de travail, avec des montants en XAF et un taux de taxe configurable au niveau de l'atelier.",
      screenshot: {src: asset("billing-desktop.png"), alt: "Facturation Atelier Maître"},
      bullets: [
        "Créer et suivre les devis issus du travail à réaliser.",
        "Émettre les factures depuis le dossier atelier.",
        "Conserver une continuité entre opération, validation et encaissement."
      ],
      durationSeconds: 40
    },
    {
      id: "reporting",
      eyebrow: "06 · Pilotage",
      title: "Transformer l'activité en indicateurs lisibles",
      summary:
        "Les vues de reporting donnent au responsable une lecture synthétique de l'activité opérationnelle et financière.",
      screenshot: {src: asset("reports-desktop.png"), alt: "Reporting Atelier Maître"},
      bullets: [
        "Suivre l'activité sans retraitement manuel permanent.",
        "Croiser les informations issues des opérations et de la facturation.",
        "Appuyer les décisions quotidiennes avec une vue consolidée."
      ],
      durationSeconds: 30
    },
    {
      id: "notifications",
      eyebrow: "07 · Notifications",
      title: "Prévenir quand le véhicule est prêt",
      summary:
        "Lorsque l'ordre de travail passe au statut « Prêt », Atelier Maître déclenche le workflow de notification client et conserve un historique des communications SMS.",
      bullets: [
        "Modèle de message « véhicule prêt » disponible en français et en anglais.",
        "Détection des numéros Orange, MTN et Camtel dans le workflow SMS.",
        "Historique des notifications avec statut d'envoi pour le suivi opérationnel."
      ],
      durationSeconds: 25
    },
    {
      id: "outro",
      kind: "outro",
      eyebrow: "Atelier Maître · Trigenys",
      title: "Un même dossier, du rendez-vous à la clôture",
      summary:
        "Cette démonstration utilise de vraies vues du produit. La prochaine étape consiste à confronter le parcours à votre propre organisation d'atelier.",
      bullets: [
        "atelier.trigenys.com",
        "Démonstration adaptée à votre flux de travail sur demande."
      ],
      durationSeconds: 15
    }
  ],
  cta: {
    label: "Étudier Atelier Maître",
    supportingText: "Démonstration produit basée sur l'interface réelle."
  },
  legal: {
    footer: "Atelier Maître — démonstration commerciale Trigenys."
  }
});

export const atelierMaitreFleetDemo = defineProductDemoSpec({
  schemaVersion: "1",
  id: "atelier-maitre-fleet-sales-demo-fr",
  locale: "fr",
  product: {
    name: "Atelier Maître",
    descriptor: "Gestion d'atelier pour flotte et maintenance",
    website: "atelier.trigenys.com",
    sourceRepository: "EagleFox31/atelier2026",
    sourceRevision: atelierSourceRevision
  },
  audience: {
    label: "Flotte · Transport · Logistique",
    goal: "Limiter le temps d'immobilisation des véhicules"
  },
  brand: atelierBrand,
  scenes: [
    {
      id: "intro",
      kind: "intro",
      eyebrow: "Scénario flotte",
      title: "Un véhicule immobilisé doit redevenir disponible vite",
      summary:
        "Cette démonstration suit un véhicule depuis la planification de son passage jusqu'à sa remise à disposition, avec une priorité : garder chaque étape visible.",
      bullets: [
        "Planifier le passage avant l'arrivée du véhicule.",
        "Affecter le travail et suivre son état.",
        "Réduire les zones d'ombre qui prolongent l'immobilisation."
      ],
      durationSeconds: 20
    },
    {
      id: "fleet-visibility",
      eyebrow: "01 · File atelier",
      title: "Identifier immédiatement où se trouve chaque dossier",
      summary:
        "La vue atelier donne une lecture commune des ordres de travail et de leur statut, plutôt qu'une succession d'appels pour savoir où en est un véhicule.",
      screenshot: {src: asset("workshop-desktop.png"), alt: "Vue atelier Atelier Maître"},
      bullets: [
        "Repérer les véhicules reçus, en diagnostic ou en travaux.",
        "Prioriser les dossiers qui bloquent l'exploitation.",
        "Accéder au détail sans quitter le flux atelier."
      ],
      durationSeconds: 35
    },
    {
      id: "fleet-planning",
      eyebrow: "02 · Passage atelier",
      title: "Planifier le créneau et visualiser l'occupation des baies",
      summary:
        "Avant l'immobilisation, le rendez-vous positionne le véhicule dans le planning afin d'éviter qu'il arrive sans capacité de prise en charge.",
      screenshot: {src: asset("planning-desktop.png"), alt: "Planning et occupation des baies Atelier Maître"},
      bullets: [
        "Créneau associé au véhicule et au motif de passage.",
        "Lecture quotidienne des rendez-vous et de l'occupation de l'atelier.",
        "Création de l'ordre de travail directement depuis le rendez-vous."
      ],
      durationSeconds: 55
    },
    {
      id: "fleet-assignment",
      eyebrow: "03 · Affectation",
      title: "Donner un responsable clair à l'intervention",
      summary:
        "Le dossier permet d'affecter le travail et de rendre visible qui doit agir, avec des permissions adaptées aux rôles atelier.",
      screenshot: {src: asset("workshop-detail-desktop.png"), alt: "Affectation et détail d'intervention Atelier Maître"},
      bullets: [
        "Affecter un responsable ou technicien au dossier.",
        "Le technicien assigné retrouve les actions qui le concernent.",
        "Les changements de statut restent soumis aux rôles autorisés."
      ],
      durationSeconds: 45
    },
    {
      id: "fleet-progress",
      eyebrow: "04 · Intervention",
      title: "Faire progresser le véhicule avec des statuts explicites",
      summary:
        "Diagnostic, devis, travaux et contrôle qualité forment un chemin contrôlé. L'équipe sait ce qui est terminé et quelle action vient ensuite.",
      screenshot: {src: asset("workshop-detail-desktop.png"), alt: "Suivi des statuts d'une intervention Atelier Maître"},
      bullets: [
        "Constats techniques enregistrés dans le dossier.",
        "Démarrage des travaux après validation du devis.",
        "Contrôle qualité avant le passage au statut « Prêt »."
      ],
      durationSeconds: 50
    },
    {
      id: "fleet-parts",
      eyebrow: "05 · Pièces",
      title: "Éviter qu'une pièce manquante reste invisible",
      summary:
        "Le suivi du stock et des lignes de pièces rattache les besoins matériels au dossier d'intervention, ce qui aide à détecter plus tôt les blocages.",
      screenshot: {src: asset("stock-desktop.png"), alt: "Stock de pièces Atelier Maître"},
      bullets: [
        "Disponibilité et mouvements de stock visibles.",
        "Pièces rattachées au cycle de l'ordre de travail.",
        "Le passage au statut « Prêt » tient compte de l'état des pièces du dossier."
      ],
      durationSeconds: 40
    },
    {
      id: "fleet-ready-sms",
      eyebrow: "06 · Véhicule prêt",
      title: "Déclencher la notification dès que le véhicule est prêt",
      summary:
        "Quand le contrôle qualité est validé et que le véhicule passe au statut « Prêt », le workflow de notification peut informer le contact concerné sans attendre une relance manuelle.",
      bullets: [
        "Message « véhicule prêt » en français ou en anglais.",
        "Workflow SMS avec détection Orange, MTN et Camtel.",
        "Historique de communication consultable par l'équipe."
      ],
      durationSeconds: 35
    },
    {
      id: "fleet-reporting",
      eyebrow: "07 · Exploitation",
      title: "Reprendre de la hauteur sur l'activité",
      summary:
        "Le reporting consolide les informations de l'atelier afin que l'exploitation puisse suivre l'activité et identifier les points qui méritent une action.",
      screenshot: {src: asset("reports-desktop.png"), alt: "Reporting d'activité Atelier Maître"},
      bullets: [
        "Lecture consolidée plutôt qu'un suivi dispersé.",
        "Données opérationnelles et financières issues du même système.",
        "Base exploitable pour analyser les périodes d'immobilisation et les goulots d'étranglement."
      ],
      durationSeconds: 30
    },
    {
      id: "outro",
      kind: "outro",
      eyebrow: "Atelier Maître · Flotte",
      title: "Moins de flou entre l'arrivée et la remise en circulation",
      summary:
        "Pour SWYFT ou toute organisation gérant plusieurs véhicules, l'enjeu est de rendre le passage atelier prévisible, attribué et traçable.",
      bullets: [
        "Cette vidéo montre les fonctions actuellement disponibles dans Atelier Maître.",
        "Le scénario peut être approfondi à partir du fonctionnement réel de votre flotte."
      ],
      durationSeconds: 20
    }
  ],
  cta: {
    label: "Étudier le scénario flotte",
    supportingText: "Démonstration adaptée aux opérations de flotte et de maintenance."
  },
  legal: {
    footer: "Atelier Maître — démonstration commerciale Trigenys. SWYFT n'est pas présenté comme client."
  }
});
