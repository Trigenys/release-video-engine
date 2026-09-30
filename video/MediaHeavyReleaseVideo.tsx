import {Audio} from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import {
  releaseVideoFormats,
  resolveReleaseVideoSpec,
  type ReleaseVideoFormat
} from "./contracts/releaseVideo";
import {
  type BenchmarkLocale,
  type FormbricksMediaHeavyData,
  formbricksMediaHeavyRelease
} from "./data/formbricksMediaHeavy";

export interface MediaHeavyReleaseVideoProps extends Record<string, unknown> {
  format: ReleaseVideoFormat;
  locale: BenchmarkLocale;
}

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export function MediaHeavyReleaseVideo({
  format,
  locale
}: MediaHeavyReleaseVideoProps) {
  const spec = resolveReleaseVideoSpec(formbricksMediaHeavyRelease);
  const data = spec.template.data as FormbricksMediaHeavyData;
  const copy = data.locales[locale];
  const screenshot = spec.content.screenshots?.[0];
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const dimensions = releaseVideoFormats[format];
  const vertical = format === "vertical";
  const square = format === "square";
  const palette = spec.brand.palette;
  const safe = dimensions.safeInset;
  const currentCaption = copy.captions.find(
    (cue) => seconds >= cue.start && seconds < cue.end
  );

  const screenshotEntry = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: {damping: 18, stiffness: 95}
  });

  const objectPosition = screenshot?.focalPoint
    ? `${Math.round(screenshot.focalPoint.x * 100)}% ${Math.round(
        screenshot.focalPoint.y * 100
      )}%`
    : "50% 50%";

  const regularFont = staticFile("benchmark/inter-latin-400-normal.woff2");
  const boldFont = staticFile("benchmark/inter-latin-700-normal.woff2");

  return (
    <AbsoluteFill
      style={{
        color: palette.text,
        background: `
          radial-gradient(circle at 12% 12%, ${palette.primary}30 0, transparent 34%),
          radial-gradient(circle at 90% 88%, ${palette.accent}20 0, transparent 30%),
          ${palette.background}
        `,
        fontFamily: "Inter, Arial, sans-serif",
        overflow: "hidden"
      }}
    >
      <style>{`
        @font-face {
          font-family: "Inter";
          src: url("${regularFont}") format("woff2");
          font-style: normal;
          font-weight: 400;
        }
        @font-face {
          font-family: "Inter";
          src: url("${boldFont}") format("woff2");
          font-style: normal;
          font-weight: 700;
        }
      `}</style>

      <Audio
        src={staticFile(data.audio.src)}
        volume={data.audio.volume}
      />

      <div
        style={{
          position: "absolute",
          inset: safe,
          border: `1px solid ${palette.muted}28`,
          borderRadius: 38,
          zIndex: 30,
          pointerEvents: "none"
        }}
      />

      <Sequence from={0} durationInFrames={180}>
        <AbsoluteFill
          style={{
            padding: safe * 1.35,
            opacity: interpolate(frame, [0, 14, 158, 180], [0, 1, 1, 0], clamp)
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              border: `1px solid ${palette.primary}66`,
              background: `${palette.primary}18`,
              color: palette.primary,
              borderRadius: 999,
              padding: "12px 18px",
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: ".11em",
              textTransform: "uppercase"
            }}
          >
            {copy.eyebrow}
          </div>

          <div
            style={{
              marginTop: vertical ? 92 : 56,
              color: palette.muted,
              fontSize: vertical ? 34 : 28
            }}
          >
            {spec.product.name} · {spec.product.version}
          </div>

          <h1
            style={{
              margin: "22px 0 0",
              maxWidth: vertical ? 870 : square ? 870 : 1420,
              fontSize: vertical ? 96 : square ? 76 : 86,
              lineHeight: 0.98,
              letterSpacing: "-0.055em",
              fontWeight: 700
            }}
          >
            {copy.headline}
          </h1>

          <p
            style={{
              margin: "34px 0 0",
              maxWidth: vertical ? 840 : 1180,
              color: palette.muted,
              fontSize: vertical ? 34 : 29,
              lineHeight: 1.4
            }}
          >
            {copy.summary}
          </p>

          <div
            style={{
              marginTop: "auto",
              color: palette.muted,
              fontSize: 19
            }}
          >
            {locale.toUpperCase()} · bundled Inter · deterministic audio
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={150} durationInFrames={390}>
        <AbsoluteFill
          style={{
            padding: safe * 1.25,
            opacity: interpolate(frame, [150, 170, 520, 540], [0, 1, 1, 0], clamp)
          }}
        >
          <div
            style={{
              color: palette.primary,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: ".11em",
              textTransform: "uppercase"
            }}
          >
            {copy.changesKicker}
          </div>

          <div
            style={{
              marginTop: 18,
              maxWidth: vertical ? 820 : 1180,
              fontSize: vertical ? 60 : 48,
              fontWeight: 700,
              letterSpacing: "-0.045em"
            }}
          >
            {copy.changesTitle}
          </div>

          <div
            style={{
              marginTop: vertical ? 42 : 32,
              display: "grid",
              gridTemplateColumns: vertical
                ? "1fr"
                : square
                  ? "1fr"
                  : "1.32fr .92fr",
              gap: 26,
              minHeight: 0,
              flex: 1
            }}
          >
            <div
              style={{
                position: "relative",
                minHeight: vertical ? 520 : 0,
                borderRadius: 30,
                overflow: "hidden",
                border: `1px solid ${palette.muted}33`,
                background: palette.surface,
                transform: `scale(${interpolate(screenshotEntry, [0, 1], [0.96, 1])})`,
                boxShadow: "0 35px 90px rgba(0,0,0,.28)"
              }}
            >
              {screenshot ? (
                <Img
                  src={staticFile(screenshot.src)}
                  alt={screenshot.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: screenshot.fit ?? "cover",
                    objectPosition
                  }}
                />
              ) : null}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 55%, rgba(7,17,31,.72) 100%)"
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  bottom: 18,
                  padding: "9px 13px",
                  borderRadius: 999,
                  background: "rgba(7,17,31,.78)",
                  color: "#f8fafc",
                  fontSize: 16
                }}
              >
                public product screenshot · focal point {objectPosition}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: vertical || square ? "1fr 1fr" : "1fr",
                gap: 16,
                alignContent: "center"
              }}
            >
              {copy.highlights.map((item, index) => {
                const local = spring({
                  frame: Math.max(0, frame - 200 - index * 12),
                  fps,
                  config: {damping: 18, stiffness: 100}
                });
                return (
                  <div
                    key={item.value}
                    style={{
                      padding: vertical ? "24px 22px" : "20px 22px",
                      borderRadius: 22,
                      border: `1px solid ${palette.muted}28`,
                      background: palette.surface,
                      opacity: interpolate(local, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(local, [0, 1], [22, 0])}px)`
                    }}
                  >
                    <div
                      style={{
                        color: palette.primary,
                        fontSize: vertical ? 25 : 23,
                        fontWeight: 700
                      }}
                    >
                      {item.value}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        color: palette.text,
                        fontSize: vertical ? 21 : 19,
                        lineHeight: 1.35
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={520} durationInFrames={200}>
        <AbsoluteFill
          style={{
            padding: safe * 1.4,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            opacity: interpolate(frame, [520, 545, 700, 719], [0, 1, 1, 0], clamp)
          }}
        >
          <div
            style={{
              width: vertical ? 146 : 116,
              height: vertical ? 146 : 116,
              borderRadius: 30,
              display: "grid",
              placeItems: "center",
              background: palette.primary,
              color: palette.background,
              fontSize: vertical ? 68 : 52,
              fontWeight: 700
            }}
          >
            F
          </div>

          <div
            style={{
              marginTop: 34,
              maxWidth: vertical ? 860 : 1220,
              fontSize: vertical ? 72 : 58,
              lineHeight: 1.03,
              letterSpacing: "-0.05em",
              fontWeight: 700
            }}
          >
            {copy.cta}
          </div>

          <div
            style={{
              marginTop: 18,
              maxWidth: 900,
              color: palette.muted,
              fontSize: vertical ? 27 : 23,
              lineHeight: 1.4
            }}
          >
            {copy.supportingText}
          </div>
        </AbsoluteFill>
      </Sequence>

      {currentCaption ? (
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            left: vertical ? 80 : "15%",
            right: vertical ? 80 : "15%",
            bottom: vertical ? 118 : 72,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              padding: vertical ? "18px 22px" : "14px 20px",
              borderRadius: 18,
              background: "rgba(7,17,31,.88)",
              border: "1px solid rgba(248,250,252,.16)",
              color: "#f8fafc",
              fontSize: vertical ? 27 : 23,
              fontWeight: 700,
              lineHeight: 1.3,
              textAlign: "center",
              boxShadow: "0 18px 50px rgba(0,0,0,.22)"
            }}
          >
            {currentCaption.text}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
