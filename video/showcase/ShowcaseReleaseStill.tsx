import {AbsoluteFill} from "remotion";
import type {ReleaseShowcase} from "../../src/data/releaseShowcases";

const themes = {
  "Kinetic product": {
    background: "linear-gradient(145deg, #11162a, #252b57 58%, #3b2f69)",
    primary: "#35d6c9",
    secondary: "#ff7fa8"
  },
  "Creator pulse": {
    background: "linear-gradient(145deg, #160f2c, #321b5a 52%, #172b48)",
    primary: "#8e7dff",
    secondary: "#35d6c9"
  },
  "Technical launch": {
    background: "linear-gradient(145deg, #0d1021, #202650 48%, #332557)",
    primary: "#a8a9ff",
    secondary: "#ffd15c"
  }
} as const;

function fontScale(format: ReleaseShowcase["format"]) {
  if (format === "9:16") return 1;
  if (format === "1:1") return 0.78;
  return 0.66;
}

export function ShowcaseReleaseStill({
  showcase
}: {
  showcase: ReleaseShowcase;
}) {
  const theme = themes[showcase.templateName as keyof typeof themes] ?? themes["Technical launch"];
  const scale = fontScale(showcase.format);
  const horizontal = showcase.format === "16:9";

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        padding: horizontal ? 92 : 72,
        color: "#fff",
        background: theme.background,
        fontFamily: 'Inter, "Segoe UI", Arial, sans-serif'
      }}
    >
      <div
        style={{
          position: "absolute",
          width: horizontal ? 760 : 520,
          height: horizontal ? 760 : 520,
          borderRadius: "50%",
          right: -180,
          top: -220,
          background: `radial-gradient(circle, ${theme.primary}66, transparent 68%)`
        }}
      />
      <div
        style={{
          position: "absolute",
          width: horizontal ? 620 : 460,
          height: horizontal ? 620 : 460,
          borderRadius: "50%",
          left: -180,
          bottom: -240,
          background: `radial-gradient(circle, ${theme.secondary}55, transparent 70%)`
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}
      >
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div
            style={{
              color: theme.primary,
              fontSize: 26 * scale,
              fontWeight: 850,
              textTransform: "uppercase",
              letterSpacing: ".14em"
            }}
          >
            Public release demo
          </div>
          <div style={{color: "rgba(255,255,255,.5)", fontSize: 24 * scale, fontWeight: 700}}>
            {showcase.format}
          </div>
        </div>

        <div style={{marginTop: horizontal ? 110 : 170}}>
          <div style={{color: "rgba(255,255,255,.62)", fontSize: 28 * scale, fontWeight: 700}}>
            {showcase.repository}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 64 * scale,
              fontWeight: 900,
              letterSpacing: "-0.045em"
            }}
          >
            {showcase.product} {showcase.releaseTag}
          </div>
          <div
            style={{
              marginTop: 54 * scale,
              maxWidth: horizontal ? 1180 : 860,
              fontSize: 112 * scale,
              lineHeight: .96,
              fontWeight: 900,
              letterSpacing: "-0.06em"
            }}
          >
            {showcase.releaseTitle}
          </div>
          <div
            style={{
              marginTop: 34 * scale,
              maxWidth: horizontal ? 1060 : 820,
              color: "rgba(255,255,255,.66)",
              fontSize: 34 * scale,
              lineHeight: 1.4
            }}
          >
            {showcase.summary}
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24
          }}
        >
          <div>
            <div style={{fontSize: 26 * scale, fontWeight: 850}}>{showcase.templateName}</div>
            <div style={{marginTop: 8, color: "rgba(255,255,255,.45)", fontSize: 20 * scale}}>
              release-aware · deterministic · brand-safe
            </div>
          </div>
          <div style={{display: "flex", gap: 8}}>
            {[theme.primary, theme.secondary, "#ffffff"].map((color) => (
              <div
                key={color}
                style={{
                  width: 18 * scale,
                  height: 18 * scale,
                  borderRadius: 99,
                  background: color,
                  opacity: .9
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
