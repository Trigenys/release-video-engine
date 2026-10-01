import {Composition, Still} from "remotion";
import {AgenFetchReleaseVideo} from "./AgenFetchReleaseVideo";
import {GenericReleaseVideo, type GenericReleaseVideoProps} from "./GenericReleaseVideo";
import {
  MediaHeavyReleaseVideo,
  type MediaHeavyReleaseVideoProps
} from "./MediaHeavyReleaseVideo";
import {
  agenFetchCompositions,
  formbricksCompositions,
  RELEASE_VIDEO_DURATION_IN_FRAMES,
  RELEASE_VIDEO_FPS
} from "./compositions";
import {formbricksRelease} from "./data/formbricks";
import {releaseShowcases} from "../src/data/releaseShowcases";
import {ShowcaseReleaseStill} from "./showcase/ShowcaseReleaseStill";
import {ProductDemoVideo, type ProductDemoVideoProps} from "./ProductDemoVideo";
import {productDemoDurationInFrames} from "./contracts/productDemo";
import {atelierMaitreFleetDemo, atelierMaitreGeneralDemo} from "./data/atelierMaitre";

const mediaHeavyCompositions = [
  {id: "FormbricksMediaHeavy-vertical-en", format: "vertical" as const, locale: "en" as const, width: 1080, height: 1920},
  {id: "FormbricksMediaHeavy-square-en", format: "square" as const, locale: "en" as const, width: 1080, height: 1080},
  {id: "FormbricksMediaHeavy-landscape-en", format: "landscape" as const, locale: "en" as const, width: 1920, height: 1080},
  {id: "FormbricksMediaHeavy-landscape-fr", format: "landscape" as const, locale: "fr" as const, width: 1920, height: 1080}
] as const;

const PRODUCT_DEMO_FPS = 30;

export function RemotionRoot() {
  return (
    <>
      <Composition<any, ProductDemoVideoProps>
        id="AtelierMaitre-General-FR"
        component={ProductDemoVideo}
        durationInFrames={productDemoDurationInFrames(atelierMaitreGeneralDemo, PRODUCT_DEMO_FPS)}
        fps={PRODUCT_DEMO_FPS}
        width={1920}
        height={1080}
        defaultProps={{spec: atelierMaitreGeneralDemo}}
      />

      <Composition<any, ProductDemoVideoProps>
        id="AtelierMaitre-Fleet-FR"
        component={ProductDemoVideo}
        durationInFrames={productDemoDurationInFrames(atelierMaitreFleetDemo, PRODUCT_DEMO_FPS)}
        fps={PRODUCT_DEMO_FPS}
        width={1920}
        height={1080}
        defaultProps={{spec: atelierMaitreFleetDemo}}
      />
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

      {mediaHeavyCompositions.map((composition) => (
        <Composition<any, MediaHeavyReleaseVideoProps>
          key={composition.id}
          id={composition.id}
          component={MediaHeavyReleaseVideo}
          durationInFrames={RELEASE_VIDEO_DURATION_IN_FRAMES}
          fps={RELEASE_VIDEO_FPS}
          width={composition.width}
          height={composition.height}
          defaultProps={{
            format: composition.format,
            locale: composition.locale
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
