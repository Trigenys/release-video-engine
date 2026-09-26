export const releaseFrequencies = [
  "weekly",
  "monthly",
  "quarterly",
  "occasionally"
] as const;

export type ReleaseFrequency = (typeof releaseFrequencies)[number];

export interface EarlyAccessPayload {
  email: string;
  repositoryUrl: string;
  releaseFrequency: ReleaseFrequency;
  source?: string;
  campaign?: string;
}

export interface EarlyAccessValidationResult {
  ok: boolean;
  data?: EarlyAccessPayload;
  errors?: Partial<Record<keyof EarlyAccessPayload, string>>;
}

export function validateEarlyAccessPayload(
  input: unknown
): EarlyAccessValidationResult {
  if (!input || typeof input !== "object") {
    return {ok: false, errors: {email: "Invalid request."}};
  }

  const raw = input as Record<string, unknown>;
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const repositoryUrl =
    typeof raw.repositoryUrl === "string" ? raw.repositoryUrl.trim() : "";
  const releaseFrequency =
    typeof raw.releaseFrequency === "string" ? raw.releaseFrequency : "";
  const source = typeof raw.source === "string" ? raw.source.trim().slice(0, 80) : undefined;
  const campaign =
    typeof raw.campaign === "string" ? raw.campaign.trim().slice(0, 120) : undefined;

  const errors: EarlyAccessValidationResult["errors"] = {};

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid work email.";
  }

  try {
    const url = new URL(repositoryUrl);
    const segments = url.pathname.split("/").filter(Boolean);

    if (
      url.protocol !== "https:" ||
      url.hostname.toLowerCase() !== "github.com" ||
      segments.length < 2
    ) {
      errors.repositoryUrl = "Use a public GitHub repository URL.";
    }
  } catch {
    errors.repositoryUrl = "Use a public GitHub repository URL.";
  }

  if (!releaseFrequencies.includes(releaseFrequency as ReleaseFrequency)) {
    errors.releaseFrequency = "Select how often you ship.";
  }

  if (Object.keys(errors).length > 0) {
    return {ok: false, errors};
  }

  return {
    ok: true,
    data: {
      email,
      repositoryUrl,
      releaseFrequency: releaseFrequency as ReleaseFrequency,
      ...(source ? {source} : {}),
      ...(campaign ? {campaign} : {})
    }
  };
}

export function normalizedLeadKey(payload: EarlyAccessPayload): string {
  const repo = new URL(payload.repositoryUrl);
  const parts = repo.pathname.split("/").filter(Boolean);
  const canonicalRepo = `https://github.com/${parts[0]}/${parts[1].replace(/\.git$/i, "")}`;

  return `${payload.email}::${canonicalRepo.toLowerCase()}`;
}
