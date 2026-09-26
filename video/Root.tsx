import {Composition} from "remotion";
import {AgenFetchReleaseVideo} from "./AgenFetchReleaseVideo";
import {
  agenFetchCompositions,
  RELEASE_VIDEO_DURATION_IN_FRAMES,
  RELEASE_VIDEO_FPS
} from "./compositions";

export function RemotionRoot() {
  return (
    <>
      {agenFetchCompositions.map((composition) => (
        <Composition
          key={composition.id}
          id={composition.id}
          component={AgenFetchReleaseVideo}
          durationInFrames={RELEASE_VIDEO_DURATION_IN_FRAMES}
          fps={RELEASE_VIDEO_FPS}
          width={composition.width}
          height={composition.height}
          defaultProps={{format: composition.format}}
        />
      ))}
    </>
  );
}
