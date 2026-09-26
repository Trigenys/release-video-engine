import { FormEvent, useMemo, useState } from "react";
import {
  releaseFrequencies,
  type EarlyAccessPayload,
  type ReleaseFrequency
} from "../../shared/earlyAccess";

type Status =
  | {kind: "idle"}
  | {kind: "submitting"}
  | {kind: "success"}
  | {kind: "error"; message: string};

const labels: Record<ReleaseFrequency, string> = {
  weekly: "Every week",
  monthly: "Every month",
  quarterly: "Every quarter",
  occasionally: "A few times a year"
};

export function EarlyAccessSection() {
  const [status, setStatus] = useState<Status>({kind: "idle"});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const attribution = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get("utm_source") ?? undefined,
      campaign: params.get("utm_campaign") ?? undefined
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({kind: "submitting"});
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const payload: EarlyAccessPayload = {
      email: String(form.get("email") ?? ""),
      repositoryUrl: String(form.get("repositoryUrl") ?? ""),
      releaseFrequency: String(
        form.get("releaseFrequency") ?? ""
      ) as ReleaseFrequency,
      ...attribution
    };

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as {
        ok?: boolean;
        fields?: Record<string, string>;
      };

      if (!response.ok || !result.ok) {
        if (result.fields) {
          setFieldErrors(result.fields);
        }
        setStatus({
          kind: "error",
          message:
            response.status >= 500
              ? "We could not save your request. Try again in a moment."
              : "Check the highlighted fields and try again."
        });
        return;
      }

      event.currentTarget.reset();
      setStatus({kind: "success"});
    } catch {
      setStatus({
        kind: "error",
        message: "We could not reach the signup endpoint. Try again shortly."
      });
    }
  }

  return (
    <section className="content-section contact-section" id="contact">
      <div className="early-access-panel">
        <div className="early-access-copy">
          <p className="eyebrow">Early access</p>
          <h2>Bring us your next release.</h2>
          <p>
            Share a public repository and how often you ship. We&apos;re
            refining the creative system with SaaS founders, devtool teams,
            indie makers and product marketers before opening self-serve access.
          </p>
          <div className="proof-note">
            <strong>No generic AI look.</strong>
            <span>
              The release provides the story. Your brand provides the visual
              language. The renderer keeps the result repeatable.
            </span>
          </div>
        </div>

        <form className="early-access-form" onSubmit={submit} noValidate>
          <label>
            <span>Work email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(fieldErrors.email)}
              required
            />
            {fieldErrors.email && <small>{fieldErrors.email}</small>}
          </label>

          <label>
            <span>Public GitHub repository</span>
            <input
              name="repositoryUrl"
              type="url"
              inputMode="url"
              placeholder="https://github.com/company/product"
              aria-invalid={Boolean(fieldErrors.repositoryUrl)}
              required
            />
            {fieldErrors.repositoryUrl && (
              <small>{fieldErrors.repositoryUrl}</small>
            )}
          </label>

          <label>
            <span>How often do you ship?</span>
            <select
              name="releaseFrequency"
              defaultValue=""
              aria-invalid={Boolean(fieldErrors.releaseFrequency)}
              required
            >
              <option value="" disabled>
                Select a release cadence
              </option>
              {releaseFrequencies.map((frequency) => (
                <option value={frequency} key={frequency}>
                  {labels[frequency]}
                </option>
              ))}
            </select>
            {fieldErrors.releaseFrequency && (
              <small>{fieldErrors.releaseFrequency}</small>
            )}
          </label>

          <button
            className="button button-primary early-access-submit"
            type="submit"
            disabled={status.kind === "submitting"}
          >
            {status.kind === "submitting"
              ? "Saving…"
              : "Try it on my release"}
          </button>

          <p className="form-privacy">
            No tracking pixels. We store only the information you submit plus
            optional UTM source/campaign values.
          </p>

          {status.kind === "success" && (
            <div className="form-message form-message-success" role="status">
              Got it. We&apos;ll use a real release from your repository for the
              next-step demo.
            </div>
          )}
          {status.kind === "error" && (
            <div className="form-message form-message-error" role="alert">
              {status.message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
