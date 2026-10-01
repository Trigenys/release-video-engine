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

function TemplatePreview({template}: {template: CreativeTemplateDirection}) {
  const style = {
    "--template-surface": template.presentation.surface,
    "--template-ink": template.presentation.ink,
    "--template-muted": template.presentation.muted,
    "--template-primary": template.presentation.primary,
    "--template-secondary": template.presentation.secondary
  } as CSSProperties;

  return (
    <div className={"stitch-direction-stage direction-" + template.id} style={style} aria-live="polite">
      <div className="direction-top">
        <span>{explorerRelease.product}</span>
        <span>{explorerRelease.version}</span>
      </div>
      <div className="direction-copy">
        <p>{template.name}</p>
        <h3>{explorerRelease.title}</h3>
        <span>{explorerRelease.summary}</span>
      </div>
      <div className="direction-art" aria-hidden="true"><i/><i/><i/></div>
      <div className="direction-foot">
        <code>{explorerRelease.repository}</code>
        <span>same release data</span>
      </div>
    </div>
  );
}

export function CreativeTemplateExplorer() {
  const [selectedId, setSelectedId] = useState<CreativeTemplateId>("kinetic-product");
  const tabsId = useId();

  const selected = useMemo(
    () => creativeTemplateRegistry.find((template) => template.id === selectedId) ?? creativeTemplateRegistry[0],
    [selectedId]
  );

  function moveSelection(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % creativeTemplateRegistry.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + creativeTemplateRegistry.length) % creativeTemplateRegistry.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = creativeTemplateRegistry.length - 1;
    const next = creativeTemplateRegistry[nextIndex];
    setSelectedId(next.id);
    requestAnimationFrame(() => document.getElementById(`${tabsId}-${next.id}`)?.focus());
  }

  return (
    <section className="stitch-template-section" id="templates">
      <div className="stitch-section-head">
        <div>
          <p className="stitch-section-label">Section 03 // Creative Template Explorer</p>
          <h2>Same release facts.<br/><span>Pick the creative direction.</span></h2>
          <p>Switch presentation systems without changing the release story underneath.</p>
        </div>
      </div>

      <div className="template-tabs" role="tablist" aria-label="Creative template directions">
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

      <div className="stitch-template-stage" id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-${selected.id}`}>
        <div className="template-stage-bar">
          <span className="template-stage-badge">{selected.shortLabel}</span>
          <span>{selected.description}</span>
        </div>
        <TemplatePreview template={selected}/>
        <div className="template-stage-meta">
          <code>template/{selected.id}@{selected.version}</code>
          <span><i style={{background:selected.presentation.primary}}/><i style={{background:selected.presentation.secondary}}/></span>
          <b>{selected.presentation.typeStyle} · {selected.presentation.density}</b>
        </div>
      </div>
    </section>
  );
}
