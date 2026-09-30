import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import {
  releaseVideoFormats,
  resolveReleaseVideoSpec,
  type ReleaseVideoFormat,
  type ReleaseVideoSpec
} from "./contracts/releaseVideo";

export interface GenericReleaseVideoProps {
  spec: ReleaseVideoSpec<Record<string, unknown>>;
  format: ReleaseVideoFormat;
}

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

function fadeWindow(frame: number, start: number, enterEnd: number, exitStart: number, end: number) {
  return interpolate(frame, [start, enterEnd, exitStart, end], [0, 1, 1, 0], clamp);
}

export function GenericReleaseVideo({spec: rawSpec, format}: GenericReleaseVideoProps) {
  const spec = resolveReleaseVideoSpec(rawSpec);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = releaseVideoFormats[format];
  const isVertical = format === "vertical";
  const isSquare = format === "square";
  const pad = dimensions.safeInset;
  const heading = isVertical ? 92 : isSquare ? 74 : 82;
  const body = isVertical ? 36 : isSquare ? 31 : 32;
  const cardColumns = isVertical ? 1 : 2;
  const palette = spec.brand.palette;
  const introIn = spring({frame, fps, config: {damping: 18, stiffness: 95}});
  const highlightFrame = Math.max(0, frame - 170);

  const background = `radial-gradient(circle at 12% 8%, ${palette.primary}33 0, transparent 34%), radial-gradient(circle at 92% 88%, ${palette.accent}22 0, transparent 30%), ${palette.background}`;

  return (
    <AbsoluteFill
      style={{
        background,
        color: palette.text,
        fontFamily: spec.brand.typography.family,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: pad,
          border: `1px solid ${palette.muted}26`,
          borderRadius: 36,
          pointerEvents: "none"
        }}
      />

      <Sequence from={0} durationInFrames={190}>
        <AbsoluteFill
          style={{
            padding: pad * 1.45,
            justifyContent: "space-between",
            opacity: fadeWindow(frame, 0, 14, 160, 190)
          }}
        >
          <div
            style={{
              transform: `translateY(${interpolate(introIn, [0, 1], [48, 0])}px)`
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 18px",
                borderRadius: 999,
                background: `${palette.primary}18`,
                border: `1px solid ${palette.primary}55`,
                color: palette.primary,
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: ".12em",
                textTransform: "uppercase"
              }}
            >
              {spec.release.eyebrow ?? `Release ${spec.product.version}`}
            </div>

            <div
              style={{
                marginTop: isVertical ? 80 : 58,
                fontSize: isVertical ? 54 : 44,
                fontWeight: spec.brand.typography.headingWeight,
                letterSpacing: "-0.05em"
              }}
            >
              {spec.product.name}
            </div>

            <h1
              style={{
                margin: "24px 0 0",
                maxWidth: isVertical ? 900 : 1350,
                fontSize: heading,
                lineHeight: 0.98,
                letterSpacing: "-0.055em"
              }}
            >
              {spec.release.headline ?? spec.release.title}
            </h1>

            <p
              style={{
                margin: "34px 0 0",
                maxWidth: isVertical ? 850 : 1250,
                color: palette.muted,
                fontSize: body,
                lineHeight: 1.38
              }}
            >
              {spec.release.summary}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 30
            }}
          >
            <div style={{color: palette.muted, fontSize: 22}}>
              {spec.product.descriptor ?? "Product release"}
            </div>
            <div
              style={{
                color: palette.primary,
                fontSize: 22,
                fontWeight: 800
              }}
            >
              {spec.product.version}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={160} durationInFrames={400}>
        <AbsoluteFill
          style={{
            padding: pad * 1.35,
            opacity: fadeWindow(frame, 160, 185, 530, 560)
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: palette.primary,
              fontWeight: 850,
              letterSpacing: ".12em",
              textTransform: "uppercase"
            }}
          >
            What's changed
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: isVertical ? 68 : 54,
              fontWeight: spec.brand.typography.headingWeight,
              letterSpacing: "-0.045em"
            }}
          >
            {spec.release.title}
          </div>

          <div
            style={{
              marginTop: isVertical ? 68 : 42,
              display: "grid",
              gridTemplateColumns: `repeat(${cardColumns}, minmax(0, 1fr))`,
              gap: isVertical ? 22 : 24,
              flex: 1,
              alignContent: "center"
            }}
          >
            {spec.content.highlights.map((highlight, index) => {
              const local = spring({
                frame: Math.max(0, highlightFrame - index * 16),
                fps,
                config: {damping: 18, stiffness: 105}
              });
              return (
                <div
                  key={`${highlight.value}-${index}`}
                  style={{
                    padding: isVertical ? "34px 32px" : "30px 30px",
                    minHeight: isVertical ? 180 : 170,
                    borderRadius: 28,
                    background: palette.surface,
                    border: `1px solid ${palette.muted}28`,
                    boxShadow: "0 26px 70px rgba(0,0,0,.16)",
                    transform: `translateY(${interpolate(local, [0, 1], [32, 0])}px)`,
                    opacity: interpolate(local, [0, 1], [0, 1])
                  }}
                >
                  <div
                    style={{
                      color: palette.primary,
                      fontSize: isVertical ? 35 : 30,
                      fontWeight: 900,
                      letterSpacing: "-0.035em"
                    }}
                  >
                    {highlight.value}
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      color: palette.text,
                      fontSize: isVertical ? 28 : 25,
                      lineHeight: 1.35
                    }}
                  >
                    {highlight.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              color: palette.muted,
              fontSize: 20,
              marginTop: 22
            }}
          >
            Source: {spec.product.repository ?? "public release notes"}
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={520} durationInFrames={200}>
        <AbsoluteFill
          style={{
            padding: pad * 1.5,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            opacity: fadeWindow(frame, 520, 545, 700, 719)
          }}
        >
          <div
            style={{
              width: isVertical ? 150 : 120,
              height: isVertical ? 150 : 120,
              borderRadius: 32,
              display: "grid",
              placeItems: "center",
              background: palette.primary,
              color: palette.background,
              fontSize: isVertical ? 72 : 58,
              fontWeight: 950,
              boxShadow: `0 28px 80px ${palette.primary}35`
            }}
          >
            {spec.product.name.slice(0, 1).toUpperCase()}
          </div>
          <div
            style={{
              marginTop: 34,
              fontSize: isVertical ? 74 : 60,
              fontWeight: spec.brand.typography.headingWeight,
              letterSpacing: "-0.05em"
            }}
          >
            {spec.cta.label}
          </div>
          {spec.cta.supportingText ? (
            <div
              style={{
                marginTop: 18,
                maxWidth: 920,
                color: palette.muted,
                fontSize: isVertical ? 29 : 25,
                lineHeight: 1.4
              }}
            >
              {spec.cta.supportingText}
            </div>
          ) : null}
          {spec.cta.url ? (
            <div
              style={{
                marginTop: 32,
                padding: "16px 24px",
                borderRadius: 999,
                background: palette.surface,
                border: `1px solid ${palette.primary}55`,
                color: palette.primary,
                fontSize: 23,
                fontWeight: 800
              }}
            >
              {spec.cta.url}
            </div>
          ) : null}
          <div
            style={{
              position: "absolute",
              bottom: pad * 1.15,
              color: palette.muted,
              fontSize: 18
            }}
          >
            Tailored preview · public release data
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
