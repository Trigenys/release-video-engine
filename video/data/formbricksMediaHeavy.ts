import {defineReleaseVideoSpec} from "../contracts/releaseVideo";
import {formbricksRelease} from "./formbricks";

export type BenchmarkLocale = "en" | "fr";

export interface BenchmarkCaptionCue {
  start: number;
  end: number;
  text: string;
}

export interface BenchmarkLocalizedCopy {
  eyebrow: string;
  headline: string;
  summary: string;
  changesKicker: string;
  changesTitle: string;
  highlights: Array<{value: string; label: string}>;
  cta: string;
  supportingText: string;
  captions: BenchmarkCaptionCue[];
}

export interface FormbricksMediaHeavyData {
  audio: {
    src: string;
    volume: number;
  };
  locales: Record<BenchmarkLocale, BenchmarkLocalizedCopy>;
}

const data: FormbricksMediaHeavyData = {
  audio: {
    src: "benchmark/formbricks-benchmark-bed.wav",
    volume: 0.12
  },
  locales: {
    en: {
      eyebrow: "Media-heavy renderer benchmark · 6.0.1",
      headline: "Safer upgrades. Tighter controls. Cleaner operations.",
      summary:
        "A media-rich release story built from the same Formbricks 6.0.1 public release data used by both renderers.",
      changesKicker: "What's changed",
      changesTitle: "A safer 6.0.1 for self-hosters",
      highlights: [
        {value: "Safer v6 upgrades", label: "Helm changes make upgrades safer for self-hosted teams."},
        {value: "RustFS CLI", label: "The MinIO client is replaced in the 6.0 maintenance line."},
        {value: "Manage access", label: "Changing survey custom head scripts now requires Manage access."},
        {value: "Release policy", label: "New documentation clarifies release and maintenance expectations."}
      ],
      cta: "Turn every release into launch content",
      supportingText: "Concept preview from public release notes. No customer, partnership or endorsement claim.",
      captions: [
        {start: 0.8, end: 4.8, text: "Formbricks 6.0.1 focuses on safer self-hosted upgrades."},
        {start: 6.0, end: 10.0, text: "The same release now becomes a visual story using a real product screenshot."},
        {start: 10.2, end: 14.5, text: "Access control, storage tooling and maintenance guidance are surfaced as release highlights."},
        {start: 18.2, end: 22.6, text: "One release spec. Two renderers. The same publish-ready story."}
      ]
    },
    fr: {
      eyebrow: "Benchmark média · version 6.0.1",
      headline: "Mises à niveau plus sûres. Contrôles renforcés. Exploitation plus propre.",
      summary:
        "Une narration enrichie construite avec les mêmes données publiques de Formbricks 6.0.1 pour comparer les deux moteurs.",
      changesKicker: "Ce qui change",
      changesTitle: "Une version 6.0.1 plus sûre pour l'auto-hébergement",
      highlights: [
        {value: "Mise à niveau v6", label: "Les changements Helm sécurisent davantage les mises à niveau auto-hébergées."},
        {value: "CLI RustFS", label: "Le client MinIO est remplacé dans la branche de maintenance 6.0."},
        {value: "Accès Manage", label: "La modification des scripts personnalisés d'un sondage exige désormais l'accès Manage."},
        {value: "Politique de version", label: "Une nouvelle documentation clarifie la maintenance et les versions."}
      ],
      cta: "Transformez chaque release en contenu de lancement",
      supportingText: "Aperçu conceptuel issu de notes publiques. Aucune relation client, partenariat ou recommandation n'est revendiquée.",
      captions: [
        {start: 0.8, end: 4.8, text: "Formbricks 6.0.1 met l'accent sur des mises à niveau auto-hébergées plus sûres."},
        {start: 6.0, end: 10.0, text: "La même release devient une histoire visuelle avec une vraie capture du produit."},
        {start: 10.2, end: 14.5, text: "Contrôle d'accès, stockage et maintenance deviennent des messages de lancement lisibles."},
        {start: 18.2, end: 22.6, text: "Une seule spec de release. Deux moteurs. La même histoire prête à publier."}
      ]
    }
  }
};

export const formbricksMediaHeavyRelease = defineReleaseVideoSpec<FormbricksMediaHeavyData>({
  ...formbricksRelease,
  id: "formbricks-6.0.1-media-heavy",
  brand: {
    ...formbricksRelease.brand,
    typography: {
      family: "Inter",
      headingWeight: 700,
      bodyWeight: 400
    }
  },
  content: {
    ...formbricksRelease.content,
    screenshots: [
      {
        src: "benchmark/formbricks-product.png",
        alt: "Public Formbricks product screenshot from the Formbricks repository README",
        fit: "cover",
        focalPoint: {
          x: 0.5,
          y: 0.43
        }
      }
    ]
  },
  template: {
    id: "media-heavy-release-v1",
    data
  }
});
