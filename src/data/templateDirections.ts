export type CreativeTemplateId =
  | "editorial"
  | "kinetic-product"
  | "minimal-launch"
  | "technical-devtool";

export interface CreativeTemplateDirection {
  id: CreativeTemplateId;
  version: "1";
  name: string;
  shortLabel: string;
  description: string;
  bestFor: string;
  presentation: {
    surface: string;
    ink: string;
    muted: string;
    primary: string;
    secondary: string;
    typeStyle: "editorial" | "geometric" | "minimal" | "mono";
    density: "airy" | "balanced" | "dense";
  };
}

export interface ExplorerRelease {
  product: string;
  repository: string;
  version: string;
  title: string;
  summary: string;
  sourceUrl: string;
}

export const explorerRelease: Readonly<ExplorerRelease> = Object.freeze({
  product: "AgenFetch",
  repository: "EagleFox31/agenfetch-desktop",
  version: "v0.3.1",
  title: "Multilingual subtitles",
  summary:
    "Seven languages, three subtitle catalogues and a local-first desktop workflow.",
  sourceUrl:
    "https://github.com/EagleFox31/agenfetch-desktop/releases/tag/v0.3.1"
});

export const creativeTemplateRegistry: ReadonlyArray<CreativeTemplateDirection> = [
  {
    id: "editorial",
    version: "1",
    name: "Editorial Signal",
    shortLabel: "Editorial",
    description:
      "Large type, restrained color and magazine-like hierarchy for product stories that deserve a more authored feel.",
    bestFor: "Major releases · founder-led products",
    presentation: {
      surface: "#f3eee4",
      ink: "#18130f",
      muted: "#74695f",
      primary: "#9b6c35",
      secondary: "#d7c2a3",
      typeStyle: "editorial",
      density: "airy"
    }
  },
  {
    id: "kinetic-product",
    version: "1",
    name: "Kinetic Product",
    shortLabel: "Kinetic",
    description:
      "High-energy product framing with layered cards, motion cues and punchy launch hierarchy.",
    bestFor: "Feature drops · social-first launches",
    presentation: {
      surface: "#14172b",
      ink: "#f7f8ff",
      muted: "#aab0c6",
      primary: "#35d6c9",
      secondary: "#ff7fa8",
      typeStyle: "geometric",
      density: "balanced"
    }
  },
  {
    id: "minimal-launch",
    version: "1",
    name: "Minimal Launch",
    shortLabel: "Minimal",
    description:
      "Quiet composition, bold negative space and one strong accent for teams that prefer restraint over spectacle.",
    bestFor: "Premium SaaS · design-led tools",
    presentation: {
      surface: "#f7f8f3",
      ink: "#10120f",
      muted: "#646a61",
      primary: "#b8ff3d",
      secondary: "#dce0d7",
      typeStyle: "minimal",
      density: "airy"
    }
  },
  {
    id: "technical-devtool",
    version: "1",
    name: "Technical Devtool",
    shortLabel: "Technical",
    description:
      "Structured, code-adjacent presentation for technical audiences without falling back to a generic terminal screenshot.",
    bestFor: "Devtools · infrastructure · OSS",
    presentation: {
      surface: "#0d1021",
      ink: "#f4f6ff",
      muted: "#9ba4bd",
      primary: "#8e90ff",
      secondary: "#ffd15c",
      typeStyle: "mono",
      density: "dense"
    }
  }
] as const;

export function getCreativeTemplate(
  id: CreativeTemplateId
): CreativeTemplateDirection {
  const template = creativeTemplateRegistry.find((candidate) => candidate.id === id);

  if (!template) {
    throw new Error(`Unknown creative template: ${id}`);
  }

  return template;
}
