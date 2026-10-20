import {join} from "node:path";
import {buildProspectHyperframes} from "./lib/build-hyperframes-prospect.mts";
import {logtoRelease} from "../video/data/logto";

buildProspectHyperframes({
  spec: logtoRelease,
  outputRoot: "hyperframes/pilot/logto-v1.44.0",
  fontRegularSrc: join("public", "pilot", "logto", "inter-400.woff2"),
  fontBoldSrc: join("public", "pilot", "logto", "inter-700.woff2"),
  gsapSrc: join("public", "pilot", "logto", "gsap.min.js"),
  audioSrc: join("public", "pilot", "logto", "bed.wav"),
  benchmarkLabel: "CONCEPT PREVIEW"
});
