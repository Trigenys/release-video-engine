import type {BrandPalette, BrandTokens} from "./releaseVideo";

export type ProductDemoSceneKind = "intro" | "feature" | "outro";

export interface ProductDemoScene {
  id: string;
  kind?: ProductDemoSceneKind;
  eyebrow?: string;
  title: string;
  summary: string;
  screenshot?: {
    src: string;
    alt: string;
  };
  bullets?: string[];
  durationSeconds: number;
}

export interface ProductDemoSpec {
  schemaVersion: "1";
  id: string;
  locale: "fr" | "en";
  product: {
    name: string;
    descriptor: string;
    website?: string;
    sourceRepository?: string;
    sourceRevision?: string;
  };
  audience: {
    label: string;
    goal: string;
  };
  brand: BrandTokens;
  scenes: ProductDemoScene[];
  cta: {
    label: string;
    supportingText?: string;
  };
  legal?: {
    footer?: string;
  };
}

export type ResolvedProductDemoSpec = Omit<ProductDemoSpec, "brand"> & {
  brand: BrandTokens & {
    palette: BrandPalette;
    typography: {
      family: string;
      headingWeight: number;
      bodyWeight: number;
    };
  };
};

const defaultPalette: BrandPalette = {
  background: "#1d1712",
  surface: "#fffaf5",
  surfaceAlt: "#f8eee5",
  text: "#241b16",
  muted: "#74665c",
  primary: "#c8511a",
  accent: "#f0a36f",
  secondary: "#8b3210"
};

const defaultTypography = {
  family: 'Inter, "Segoe UI", Arial, sans-serif',
  headingWeight: 800,
  bodyWeight: 500
} as const;

export function defineProductDemoSpec(spec: ProductDemoSpec): ProductDemoSpec {
  if (!spec.id.trim()) throw new Error("product demo spec requires a stable id");
  if (!spec.product.name.trim()) throw new Error("product demo spec requires a product name");
  if (!spec.audience.label.trim() || !spec.audience.goal.trim()) {
    throw new Error("product demo spec requires audience context");
  }
  if (spec.scenes.length < 3) throw new Error("product demo spec requires at least 3 scenes");

  for (const scene of spec.scenes) {
    if (!scene.id.trim() || !scene.title.trim() || !scene.summary.trim()) {
      throw new Error("every product demo scene requires id, title and summary");
    }
    if (!Number.isFinite(scene.durationSeconds) || scene.durationSeconds < 5) {
      throw new Error(`scene ${scene.id} must last at least 5 seconds`);
    }
  }

  return spec;
}

export function resolveProductDemoSpec(spec: ProductDemoSpec): ResolvedProductDemoSpec {
  return {
    ...spec,
    brand: {
      ...spec.brand,
      palette: {
        ...defaultPalette,
        ...spec.brand.palette
      },
      typography: {
        ...defaultTypography,
        ...spec.brand.typography
      }
    }
  };
}

export function productDemoDurationInFrames(spec: ProductDemoSpec, fps: number): number {
  return Math.round(spec.scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0) * fps);
}
