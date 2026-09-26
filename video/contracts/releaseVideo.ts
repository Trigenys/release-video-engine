export const releaseVideoFormats = {
  vertical: {
    width: 1080,
    height: 1920,
    safeInset: 72
  },
  square: {
    width: 1080,
    height: 1080,
    safeInset: 64
  },
  landscape: {
    width: 1920,
    height: 1080,
    safeInset: 80
  }
} as const;

export type ReleaseVideoFormat = keyof typeof releaseVideoFormats;
export type MotionProfile = "reduced" | "calm" | "standard" | "energetic";
export type MediaFit = "contain" | "cover";

export interface BrandPalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  primary: string;
  accent: string;
  secondary?: string;
}

export interface BrandTokens {
  name: string;
  logo?: string;
  palette?: Partial<BrandPalette>;
  typography?: {
    family?: string;
    headingWeight?: number;
    bodyWeight?: number;
  };
}

export interface ReleaseHighlight {
  value: string;
  label: string;
}

export interface ReleaseScreenshot {
  src: string;
  alt: string;
  fit?: MediaFit;
  focalPoint?: {
    x: number;
    y: number;
  };
}

export interface ReleaseVideoSpec<TTemplateData = Record<string, unknown>> {
  schemaVersion: "1";
  id: string;
  product: {
    name: string;
    version: string;
    descriptor?: string;
    platform?: string;
    repository?: string;
    website?: string;
  };
  release: {
    title: string;
    headline?: string;
    summary: string;
    eyebrow?: string;
    publishedAt?: string;
  };
  brand: BrandTokens;
  content: {
    highlights: ReleaseHighlight[];
    screenshots?: ReleaseScreenshot[];
  };
  cta: {
    label: string;
    url?: string;
    supportingText?: string;
  };
  motion?: {
    profile?: MotionProfile;
  };
  legal?: {
    footer?: string;
  };
  template: {
    id: string;
    data: TTemplateData;
  };
}

export type ResolvedReleaseVideoSpec<TTemplateData = Record<string, unknown>> =
  Omit<ReleaseVideoSpec<TTemplateData>, "brand" | "motion"> & {
    brand: BrandTokens & {
      palette: BrandPalette;
      typography: {
        family: string;
        headingWeight: number;
        bodyWeight: number;
      };
    };
    motion: {
      profile: MotionProfile;
    };
  };

const defaultPalette: BrandPalette = {
  background: "#10131d",
  surface: "#1b2130",
  surfaceAlt: "#262d40",
  text: "#f7f8fb",
  muted: "#9da6b8",
  primary: "#6ee7d8",
  accent: "#f4b860",
  secondary: "#c06c84"
};

const defaultTypography = {
  family: 'Inter, "Segoe UI", Arial, sans-serif',
  headingWeight: 850,
  bodyWeight: 500
} as const;

export function defineReleaseVideoSpec<TTemplateData>(
  spec: ReleaseVideoSpec<TTemplateData>
): ReleaseVideoSpec<TTemplateData> {
  if (!spec.id.trim()) {
    throw new Error("release video spec requires a stable id");
  }

  if (!spec.product.name.trim() || !spec.product.version.trim()) {
    throw new Error("release video spec requires product name and version");
  }

  if (!spec.release.title.trim() || !spec.release.summary.trim()) {
    throw new Error("release video spec requires release title and summary");
  }

  if (spec.content.highlights.length === 0 || spec.content.highlights.length > 4) {
    throw new Error("release video spec requires between 1 and 4 highlights");
  }

  if (!spec.cta.label.trim()) {
    throw new Error("release video spec requires a CTA label");
  }

  for (const screenshot of spec.content.screenshots ?? []) {
    const point = screenshot.focalPoint;

    if (
      point &&
      (point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1)
    ) {
      throw new Error("screenshot focalPoint values must be between 0 and 1");
    }
  }

  return spec;
}

export function resolveReleaseVideoSpec<TTemplateData>(
  spec: ReleaseVideoSpec<TTemplateData>
): ResolvedReleaseVideoSpec<TTemplateData> {
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
    },
    motion: {
      profile: spec.motion?.profile ?? "standard"
    }
  };
}
