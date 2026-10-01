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
    const formElement = event.currentTarget;
    setStatus({kind: "submitting"});
    setFieldErrors({});

    const form = new FormData(formElement);
    const payload: EarlyAccessPayload = {
      email: String(form.get("email") ?? ""),
      repositoryUrl: String(form.get("repositoryUrl") ?? ""),
      releaseFrequency: String(form.get("releaseFrequency") ?? "") as ReleaseFrequency,
      ...attribution
    };

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as {ok?: boolean; fields?: Record<string, string>};
      if (!response.ok || !result.ok) {
        if (result.fields) setFieldErrors(result.fields);
        setStatus({
          kind: "error",
          message: response.status >= 500
            ? "We could not save your request. Try again in a moment."
            : "Check the highlighted fields and try again."
        });
        return;
      }
      formElement.reset();
      setStatus({kind: "success"});
    } catch {
      setStatus({kind: "error", message: "We could not reach the signup endpoint. Try again shortly."});
    }
  }

  return (
    <section className="stitch-early-section" id="contact">
      <span className="anchor-alias" id="early-access" aria-hidden="true"/>
      <div className="stitch-early-card">
        <div className="stitch-early-copy">
          <p className="stitch-section-label">Section 05 // Early Access Concierge</p>
          <h2>Bring us your next<br/><span>real release.</span></h2>
          <p>
            Share a public repository and how often you ship. We&apos;ll use a real
            release to prepare a launch-ready three-format sample while we validate
            the concierge workflow.
          </p>

          <ul className="early-checks">
            <li><span>✓</span><div><strong>Real release data</strong><small>No invented product claims.</small></div></li>
            <li><span>✓</span><div><strong>Your visual language</strong><small>Brand tokens stay separate from release facts.</small></div></li>
            <li><span>✓</span><div><strong>Three coordinated outputs</strong><small>9:16, 1:1 and 16:9.</small></div></li>
          </ul>

          <div className="turnaround-note">⚡ Concierge pilot · no self-serve access yet</div>
        </div>

        <div className="stitch-form-shell">
          {status.kind === "success" ? (
            <div className="stitch-form-success" role="status">
              <span>🎉</span>
              <h3>Got it! We&apos;re on it.</h3>
              <p>We&apos;ll use a real release from your repository for the next-step demo.</p>
            </div>
          ) : (
            <form className="early-access-form stitch-form" onSubmit={submit} noValidate>
              <label>
                <span>Work email</span>
                <input name="email" type="email" autoComplete="email" placeholder="founder@company.com" aria-invalid={Boolean(fieldErrors.email)} required />
                {fieldErrors.email && <small>{fieldErrors.email}</small>}
              </label>

              <label>
                <span>Public GitHub repository</span>
                <input name="repositoryUrl" type="url" inputMode="url" placeholder="https://github.com/org/repo" aria-invalid={Boolean(fieldErrors.repositoryUrl)} required />
                {fieldErrors.repositoryUrl && <small>{fieldErrors.repositoryUrl}</small>}
              </label>

              <label>
                <span>How often do you ship?</span>
                <select name="releaseFrequency" defaultValue="" aria-invalid={Boolean(fieldErrors.releaseFrequency)} required>
                  <option value="" disabled>Select a release cadence</option>
                  {releaseFrequencies.map((frequency) => <option value={frequency} key={frequency}>{labels[frequency]}</option>)}
                </select>
                {fieldErrors.releaseFrequency && <small>{fieldErrors.releaseFrequency}</small>}
              </label>

              <button className="button button-primary early-access-submit" type="submit" disabled={status.kind === "submitting"}>
                {status.kind === "submitting" ? "Saving…" : "Try it on my release"} <span>🚀</span>
              </button>

              <p className="form-privacy">No tracking pixels. We store only what you submit plus optional UTM attribution.</p>
              {status.kind === "error" && <div className="form-message form-message-error" role="alert">{status.message}</div>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
