import { describe, it, expect } from "vitest";
import { availableTools } from "./index";

describe("availableTools", () => {
  it("should return activeFeatures when provided", () => {
    const result = availableTools({
      activeFeatures: ["feature-a", "feature-b"],
      detectedFeatures: ["feature-c"],
    });
    expect(result).toEqual(["feature-a", "feature-b"]);
  });

  it("should fallback to detected features if activeFeatures is empty", { timeout: 5000 }, () => {
    const result = availableTools({
      activeFeatures: [],
      detectedFeatures: ["feature-c", "feature-d"],
    });
    expect(result).toEqual(["feature-c", "feature-d"]);
  });

  it("should return empty array when both activeFeatures and detectedFeatures are empty", () => {
    const result = availableTools({
      activeFeatures: [],
      detectedFeatures: [],
    });
    expect(result).toEqual([]);
  });
});
