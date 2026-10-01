import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import {
  resolveProductDemoSpec,
  type ProductDemoScene,
  type ProductDemoSpec
} from "./contracts/productDemo";

export interface ProductDemoVideoProps {
  spec: ProductDemoSpec;
}

function Scene({
  scene,
  spec,
  index,
  total
}: {
  scene: ProductDemoScene;
  spec: ReturnType<typeof resolveProductDemoSpec>;
  index: number;
  total: number;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spec.brand.palette;

  const enter = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 95, mass: 0.9}
  });
  const durationFrames = Math.round(scene.durationSeconds * fps);
  const exit = interpolate(
    frame,
    [Math.max(0, durationFrames - 18), durationFrames],
    [1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );
  const opacity = Math.min(enter, exit);
  const lift = interpolate(enter, [0, 1], [28, 0]);
  const screenshotScale = interpolate(
    frame,
    [0, durationFrames],
    [1.015, 1.055],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const isTextOnly = !scene.screenshot;

  return (
    <AbsoluteFill
      style={{
        background: p.background,
        color: p.text,
        fontFamily: spec.brand.typography.family,
        padding: 72,
        opacity
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 82% 16%, rgba(200,81,26,0.22), transparent 34%), radial-gradient(circle at 18% 90%, rgba(240,163,111,0.12), transparent 32%)"
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          gap: 56,
          transform: `translateY(${lift}px)`
        }}
      >
        <section style={{width: isTextOnly ? "78%" : "38%", zIndex: 2}}>
          <div
            style={{
              color: p.accent,
              fontSize: 22,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 2.4,
              marginBottom: 18
            }}
          >
            {scene.eyebrow ?? spec.audience.label}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: isTextOnly ? 82 : 66,
              lineHeight: 1.02,
              letterSpacing: -2.2,
              fontWeight: spec.brand.typography.headingWeight
            }}
          >
            {scene.title}
          </h1>

          <p
            style={{
              margin: "26px 0 0",
              fontSize: isTextOnly ? 34 : 28,
              lineHeight: 1.42,
              color: p.muted,
              maxWidth: 780
            }}
          >
            {scene.summary}
          </p>

          {scene.bullets && scene.bullets.length > 0 ? (
            <div style={{display: "grid", gap: 14, marginTop: 34}}>
              {scene.bullets.map((bullet, bulletIndex) => {
                const bulletStart = Math.round((1.1 + bulletIndex * 1.15) * fps);
                const bulletProgress = spring({
                  frame: Math.max(0, frame - bulletStart),
                  fps,
                  config: {damping: 20, stiffness: 100}
                });
                return (
                  <div
                    key={bullet}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      opacity: bulletProgress,
                      transform: `translateX(${interpolate(bulletProgress, [0, 1], [-18, 0])}px)`,
                      fontSize: 24,
                      lineHeight: 1.34
                    }}
                  >
                    <span
                      style={{
                        marginTop: 8,
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        flexShrink: 0,
                        background: p.primary,
                        boxShadow: `0 0 0 5px ${p.primary}22`
                      }}
                    />
                    <span>{bullet}</span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>

        {scene.screenshot ? (
          <section
            style={{
              width: "58%",
              alignSelf: "stretch",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                width: "100%",
                borderRadius: 28,
                padding: 12,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 34px 90px rgba(0,0,0,0.35)",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "0 12px"
                }}
              >
                <span style={{width: 10, height: 10, borderRadius: 999, background: "#ff6b61"}} />
                <span style={{width: 10, height: 10, borderRadius: 999, background: "#f4bd4f"}} />
                <span style={{width: 10, height: 10, borderRadius: 999, background: "#5ac05a"}} />
                <span
                  style={{
                    marginLeft: 12,
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 15,
                    fontWeight: 700
                  }}
                >
                  atelier.trigenys.com
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 10",
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "#f7f4ef"
                }}
              >
                <Img
                  src={scene.screenshot.src}
                  alt={scene.screenshot.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    transform: `scale(${screenshotScale})`
                  }}
                />
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <footer
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "rgba(255,255,255,0.55)",
          fontSize: 17,
          fontWeight: 700
        }}
      >
        <span>{spec.product.name} · {spec.audience.goal}</span>
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </footer>
    </AbsoluteFill>
  );
}

export function ProductDemoVideo({spec: rawSpec}: ProductDemoVideoProps) {
  const spec = resolveProductDemoSpec(rawSpec);
  const {fps} = useVideoConfig();

  let from = 0;

  return (
    <AbsoluteFill>
      {spec.scenes.map((scene, index) => {
        const duration = Math.round(scene.durationSeconds * fps);
        const start = from;
        from += duration;

        return (
          <Sequence key={scene.id} from={start} durationInFrames={duration}>
            <Scene scene={scene} spec={spec} index={index} total={spec.scenes.length} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
