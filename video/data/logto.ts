import {defineReleaseVideoSpec} from "../contracts/releaseVideo";

export const logtoRelease = defineReleaseVideoSpec<Record<string, unknown>>({
  schemaVersion: "1",
  id: "logto-v1.44.0-pilot",
  product: {
    name: "Logto",
    version: "1.44.0",
    descriptor: "Authentication and authorization infrastructure",
    repository: "github.com/logto-io/logto",
    website: "logto.io"
  },
  release: {
    title: "More control, less sign-in friction",
    headline: "Trusted devices. Safer migrations. More flexible auth.",
    summary:
      "Logto v1.44.0 expands MFA, identity migration, bot protection and SAML controls while smoothing authentication flows for SaaS and AI apps.",
    eyebrow: "Tailored release preview · v1.44.0",
    publishedAt: "2026-09-30"
  },
  brand: {
    name: "Logto",
    logo: "pilot/logto/logo.png",
    palette: {
      background: "#0b0912",
      surface: "#181425",
      surfaceAlt: "#241d36",
      text: "#fbfaff",
      muted: "#b8b2c8",
      primary: "#5d34f2",
      accent: "#bd31ff",
      secondary: "#9b80f9"
    },
    typography: {
      family: "Inter",
      headingWeight: 700,
      bodyWeight: 400
    }
  },
  content: {
    highlights: [
      {
        value: "MFA trusted devices",
        label: "Users can trust a browser and skip repeated MFA prompts under tenant and organization policy."
      },
      {
        value: "Keep existing user IDs",
        label: "Self-hosted migrations can preserve IDs up to 128 characters, including identifiers from another IdP."
      },
      {
        value: "Self-hosted CAPTCHA",
        label: "Cap adds a self-hosted bot-protection option where hosted CAPTCHA providers are unreliable or unreachable."
      },
      {
        value: "SAML policy controls",
        label: "Applications can reuse sessions, require signed authentication requests and receive the actual authentication time."
      }
    ],
    screenshots: [
      {
        src: "pilot/logto/changelog.png",
        alt: "Public Logto v1.44.0 changelog artwork from the GitHub release",
        fit: "cover",
        focalPoint: {
          x: 0.5,
          y: 0.5
        }
      }
    ]
  },
  cta: {
    label: "Turn release notes into launch-ready video",
    url: "release-video-engine",
    supportingText:
      "Tailored concept generated from Logto v1.44.0 public release notes. Logto is not represented as a customer, partner or endorser."
  },
  motion: {
    profile: "energetic"
  },
  legal: {
    footer:
      "Concept preview only · based on public release notes · no customer relationship claimed."
  },
  template: {
    id: "prospect-release-v1",
    data: {}
  }
});
