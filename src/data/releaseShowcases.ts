export type ShowcaseFormat = "9:16" | "1:1" | "16:9";

export interface ReleaseShowcase {
  id: string;
  product: string;
  repository: string;
  repositoryUrl: string;
  releaseTag: string;
  releaseUrl: string;
  releaseTitle: string;
  summary: string;
  templateName: string;
  format: ShowcaseFormat;
  previewSrc: string;
  renderCompositionId: string;
  publicDemo: boolean;
}

export const releaseShowcases: ReleaseShowcase[] = [
  {
    id: "agenfetch-v031",
    product: "AgenFetch",
    repository: "EagleFox31/agenfetch-desktop",
    repositoryUrl: "https://github.com/EagleFox31/agenfetch-desktop",
    releaseTag: "0.3.1",
    releaseUrl: "https://github.com/EagleFox31/agenfetch-desktop",
    releaseTitle: "Multilingual subtitles",
    summary: "Seven languages, three subtitle catalogues and a local-first desktop workflow.",
    templateName: "Kinetic product",
    format: "9:16",
    previewSrc: "/showcases/agenfetch-v031-vertical.svg",
    renderCompositionId: "Showcase-AgenFetch-v031-vertical",
    publicDemo: true
  },
  {
    id: "remotion-v40529",
    product: "Remotion",
    repository: "remotion-dev/remotion",
    repositoryUrl: "https://github.com/remotion-dev/remotion",
    releaseTag: "v4.0.529",
    releaseUrl: "https://github.com/remotion-dev/remotion/releases/tag/v4.0.529",
    releaseTitle: "Motion blur, paths and media fixes",
    summary: "A public release featuring motion blur, interpolated paths and compositor/media improvements.",
    templateName: "Creator pulse",
    format: "1:1",
    previewSrc: "/showcases/remotion-v40529-square.svg",
    renderCompositionId: "Showcase-Remotion-v40529-square",
    publicDemo: true
  },
  {
    id: "vite-v831",
    product: "Vite",
    repository: "vitejs/vite",
    repositoryUrl: "https://github.com/vitejs/vite",
    releaseTag: "v8.3.1",
    releaseUrl: "https://github.com/vitejs/vite/releases/tag/v8.3.1",
    releaseTitle: "Dependency and config fixes",
    summary: "A public maintenance release covering dependency updates and merge/config bug fixes.",
    templateName: "Technical launch",
    format: "16:9",
    previewSrc: "/showcases/vite-v831-landscape.svg",
    renderCompositionId: "Showcase-Vite-v831-landscape",
    publicDemo: true
  }
];
