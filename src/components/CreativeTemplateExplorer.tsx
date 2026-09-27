import {
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent
} from "react";
import {
  creativeTemplateRegistry,
  explorerRelease,
  type CreativeTemplateDirection,
  type CreativeTemplateId
} from "../data/templateDirections";

function TemplatePreview({
  template
}: {
  template: CreativeTemplateDirection;
}) {
  const style = {
    "--template-surface": template.presentation.surface,
    "--template-ink": template.presentation.ink,
    "--template-muted": template.presentation.muted,
    "--template-primary": template.presentation.primary,
    "--template-secondary": template.presentation.secondary
  } as CSSProperties;

  return (
    <div
      className={`template-preview template-preview-${template.id} template-type-${template.presentation.typeStyle} template-density-${template.presentation.density}`}
      style={style}
      aria-live="polite"
    >
      <div className="template-preview-grid" aria-hidden="true" />
      <div className="template-preview-orb template-preview-orb-a" aria-hidden="true" />
      <div className="template-preview-orb template-preview-orb-b" aria-hidden="true" />

      <div className="template-preview-topbar">
        <span>{explorerRelease.product}</span>
        <span>{explorerRelease.version}</span>
      </div>

      <div className="template-preview-content">
        <p className="template-preview-kicker">{template.name}</p>
        <h3>{explorerRelease.title}</h3>
        <p>{explorerRelease.summary}</p>
      </div>

      <div className="template-preview-facts">
        <span>{explorerRelease.repository}</span>
        <i />
        <span>same release data</span>
      </div>

      <div className="template-preview-art" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export function CreativeTemplateExplorer() {
  const [selectedId, setSelectedId] =
    useState<CreativeTemplateId>("kinetic-product");
  const tabsId = useId();

  const selected = useMemo(
    () =>
      creativeTemplateRegistry.find((template) => template.id === selectedId) ??
      creativeTemplateRegistry[0],
    [selectedId]
  );

  function moveSelection(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();

    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % creativeTemplateRegistry.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        (index - 1 + creativeTemplateRegistry.length) %
        creativeTemplateRegistry.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = creativeTemplateRegistry.length - 1;
    }

    const next = creativeTemplateRegistry[nextIndex];
    setSelectedId(next.id);

    requestAnimationFrame(() => {
      document.getElementById(`${tabsId}-${next.id}`)?.focus();
    });
  }

  return (
    <section className="content-section template-explorer-section" id="templates">
      <div className="template-explorer-heading">
        <div>
          <p className="eyebrow">Same release. Different art direction.</p>
          <h2>Deterministic doesn&apos;t have to mean identical.</h2>
        </div>
        <p>
          Switch the creative direction without changing a single release fact.
          The content stays fixed; only the presentation system changes.
        </p>
      </div>

      <div className="template-explorer-layout">
        <div
          className="template-tabs"
          role="tablist"
          aria-label="Creative template directions"
        >
          {creativeTemplateRegistry.map((template, index) => {
            const active = template.id === selected.id;

            return (
              <button
                id={`${tabsId}-${template.id}`}
                className={`template-tab ${active ? "is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`${tabsId}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelectedId(template.id)}
                onKeyDown={(event) => moveSelection(event, index)}
                key={template.id}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{template.shortLabel}</strong>
                  <small>{template.bestFor}</small>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="template-explorer-stage"
          id={`${tabsId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-${selected.id}`}
        >
          <TemplatePreview template={selected} />

          <div className="template-explorer-meta">
            <div>
              <span className="template-version">
                template/{selected.id}@{selected.version}
              </span>
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>
            </div>

            <div className="template-token-list" aria-label="Presentation tokens">
              <span style={{ background: selected.presentation.primary }} />
              <span style={{ background: selected.presentation.secondary }} />
              <dl>
                <div>
                  <dt>Type</dt>
                  <dd>{selected.presentation.typeStyle}</dd>
                </div>
                <div>
                  <dt>Density</dt>
                  <dd>{selected.presentation.density}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="template-explorer-proof">
        <span>Release content</span>
        <strong>locked</strong>
        <i />
        <span>Template direction</span>
        <strong>switchable</strong>
        <i />
        <span>Brand tokens</span>
        <strong>independent</strong>
      </div>
    </section>
  );
}
