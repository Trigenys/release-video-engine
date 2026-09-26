import {defineReleaseVideoSpec} from "../contracts/releaseVideo";

export interface AgenFetchTemplateData {
  languages: string[];
  providers: string[];
  securityNote: string;
}

export const agenFetchRelease = defineReleaseVideoSpec<AgenFetchTemplateData>({
  schemaVersion: "1",
  id: "agenfetch-v0.3.1",
  product: {
    name: "AgenFetch",
    version: "0.3.1",
    descriptor: "Desktop · beta",
    platform: "Windows 10/11 · x64",
    repository: "github.com/EagleFox31/agenfetch-desktop",
    website: "agenfetch-desktop.lawrynnjennifer.workers.dev"
  },
  release: {
    title: "Sous-titres multilingues",
    headline: "La vidéo reste locale. Les sous-titres vont plus loin.",
    summary:
      "AgenFetch 0.3.1 ajoute la recherche multilingue de sous-titres pour YouTube, les films et les séries.",
    eyebrow: "Nouveau dans 0.3.1"
  },
  brand: {
    name: "AgenFetch",
    logo: "agenfetch-mark.svg",
    palette: {
      background: "#121727",
      surface: "#252b43",
      surfaceAlt: "#303750",
      text: "#f7f2e8",
      muted: "#9aa4bc",
      primary: "#35d6c9",
      accent: "#eab14a",
      secondary: "#b33e68"
    }
  },
  content: {
    highlights: [
      {
        value: "7 langues",
        label: "dans une même recherche"
      },
      {
        value: "3 catalogues",
        label: "interrogés puis classés"
      },
      {
        value: "Local-first",
        label: "historique et file restent sur le PC"
      }
    ]
  },
  cta: {
    label: "Télécharger pour Windows",
    url: "agenfetch-desktop.lawrynnjennifer.workers.dev"
  },
  motion: {
    profile: "standard"
  },
  legal: {
    footer:
      "Pour tes contenus, les contenus libres de droits ou ceux pour lesquels tu disposes d’une autorisation."
  },
  template: {
    id: "agenfetch-release-v1",
    data: {
      languages: ["FR", "EN", "ES", "DE", "PT", "AR", "IT"],
      providers: ["Podnapisi", "SubDL", "OpenSubtitles"],
      securityNote:
        "Les clés SubDL et OpenSubtitles sont chiffrées par le stockage sécurisé Windows."
    }
  }
});
