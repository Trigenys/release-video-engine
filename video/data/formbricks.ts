import {defineReleaseVideoSpec} from "../contracts/releaseVideo";

export const formbricksRelease = defineReleaseVideoSpec<Record<string, unknown>>({
  schemaVersion: "1",
  id: "formbricks-6.0.1-pilot",
  product: {
    name: "Formbricks",
    version: "6.0.1",
    descriptor: "Open source surveying platform",
    repository: "github.com/formbricks/formbricks",
    website: "formbricks.com"
  },
  release: {
    title: "A safer 6.0.1 for self-hosters",
    headline: "Safer upgrades. Tighter controls. Cleaner operations.",
    summary:
      "Formbricks 6.0.1 focuses on safer v6 upgrades, storage tooling, access control and clearer release maintenance guidance.",
    eyebrow: "Tailored release preview · 6.0.1",
    publishedAt: "2026-09-29"
  },
  brand: {
    name: "Formbricks",
    palette: {
      background: "#07111f",
      surface: "#0f172a",
      surfaceAlt: "#172033",
      text: "#f8fafc",
      muted: "#cbd5e1",
      primary: "#00c4b8",
      accent: "#00e6ca",
      secondary: "#94a3b8"
    }
  },
  content: {
    highlights: [
      {
        value: "Safer v6 upgrades",
        label: "Helm changes make upgrades safer for self-hosted teams."
      },
      {
        value: "RustFS CLI",
        label: "The MinIO client is replaced in the 6.0 maintenance line."
      },
      {
        value: "Manage access",
        label: "Changing survey custom head scripts now requires Manage access."
      },
      {
        value: "Release policy",
        label: "New documentation clarifies release and maintenance expectations."
      }
    ]
  },
  cta: {
    label: "Turn every release into launch content",
    url: "release-video-engine",
    supportingText:
      "Concept preview generated from Formbricks 6.0.1 public release notes. Not an endorsement or customer relationship."
  },
  motion: {
    profile: "standard"
  },
  legal: {
    footer: "Demonstration only. Formbricks is not represented as a customer or partner."
  },
  template: {
    id: "generic-release-v1",
    data: {}
  }
});
