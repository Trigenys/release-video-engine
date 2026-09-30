import {Composition, Still} from "remotion";
import {AgenFetchReleaseVideo} from "./AgenFetchReleaseVideo";
import {GenericReleaseVideo, type GenericReleaseVideoProps} from "./GenericReleaseVideo";
import {
  agenFetchCompositions,
  formbricksCompositions,
  RELEASE_VIDEO_DURATION_IN_FRAMES,
  RELEASE_VIDEO_FPS
} from "./compositions";
import {formbricksRelease} from "./data/formbricks";
import {releaseShowcases} from "../src/data/releaseShowcases";
import {ShowcaseReleaseStill} from "./showcase/ShowcaseReleaseStill";

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

      {formbricksCompositions.map((composition) => (
        <Composition<any, GenericReleaseVideoProps>
          key={composition.id}
          id={composition.id}
          component={GenericReleaseVideo}
          durationInFrames={RELEASE_VIDEO_DURATION_IN_FRAMES}
          fps={RELEASE_VIDEO_FPS}
          width={composition.width}
          height={composition.height}
          defaultProps={{
            spec: formbricksRelease,
            format: composition.format
          }}
        />
      ))}

      {releaseShowcases.map((showcase) => {
        const dimensions =
          showcase.format === "9:16"
            ? {width: 1080, height: 1920}
            : showcase.format === "1:1"
              ? {width: 1080, height: 1080}
              : {width: 1920, height: 1080};

        return (
          <Still
            key={showcase.renderCompositionId}
            id={showcase.renderCompositionId}
            component={ShowcaseReleaseStill}
            width={dimensions.width}
            height={dimensions.height}
            defaultProps={{showcase}}
          />
        );
      })}
    </>
  );
}
