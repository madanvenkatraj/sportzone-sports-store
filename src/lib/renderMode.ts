/** Inputs describing what the current device can handle. Pure data, no DOM. */
export interface DeviceSignals {
  webgl: boolean;
  reducedMotion: boolean;
  /** navigator.hardwareConcurrency — undefined when the browser hides it */
  cores: number | undefined;
  /** navigator.deviceMemory in GB — undefined when unsupported */
  memoryGb: number | undefined;
  saveData: boolean;
}

export type RenderMode = "3d" | "static";

const MIN_CORES = 4;
const MIN_MEMORY_GB = 4;

/** Decides whether to mount the WebGL scene or show the lightweight static visual. */
export function decideRenderMode(s: DeviceSignals): RenderMode {
  if (!s.webgl || s.reducedMotion || s.saveData) return "static";
  if (s.cores !== undefined && s.cores < MIN_CORES) return "static";
  if (s.memoryGb !== undefined && s.memoryGb < MIN_MEMORY_GB) return "static";
  return "3d";
}
