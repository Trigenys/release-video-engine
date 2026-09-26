import {
  releaseVideoFormats,
  type ReleaseVideoFormat
} from "./contracts/releaseVideo";

export const RELEASE_VIDEO_FPS = 30;
export const RELEASE_VIDEO_DURATION_IN_FRAMES = 720;

export interface ReleaseCompositionDefinition {
  id: string;
  format: ReleaseVideoFormat;
  outputSuffix: string;
  width: number;
  height: number;
}

function composition(
  id: string,
  format: ReleaseVideoFormat,
  outputSuffix: string
): ReleaseCompositionDefinition {
  const dimensions = releaseVideoFormats[format];

  return {
    id,
    format,
    outputSuffix,
    width: dimensions.width,
    height: dimensions.height
  };
}

export const agenFetchCompositions = [
  composition("AgenFetchRelease-v031", "vertical", "vertical"),
  composition("AgenFetchRelease-v031-square", "square", "square"),
  composition("AgenFetchRelease-v031-landscape", "landscape", "landscape")
] as const;
