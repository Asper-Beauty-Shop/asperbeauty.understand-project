export interface ToolFeatures {
  activeFeatures: string[];
  detectedFeatures: string[];
}

/**
 * Returns the list of available tools based on active features.
 * Falls back to detected features if activeFeatures is empty.
 */
export function availableTools({
  activeFeatures,
  detectedFeatures,
}: ToolFeatures): string[] {
  if (!activeFeatures || activeFeatures.length === 0) {
    return detectedFeatures;
  }
  return activeFeatures;
}
