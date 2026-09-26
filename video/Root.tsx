import {Composition} from "remotion";
import {AgenFetchReleaseVideo} from "./AgenFetchReleaseVideo";
import {releaseVideoFormats} from "./contracts/releaseVideo";

const vertical = releaseVideoFormats.vertical;

export function RemotionRoot() {
  return (
    <Composition
      id="AgenFetchRelease-v031"
      component={AgenFetchReleaseVideo}
      durationInFrames={720}
      fps={30}
      width={vertical.width}
      height={vertical.height}
    />
  );
}
