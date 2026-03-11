import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CinematicHero from "../CinematicHero";

// Mock framer-motion to render plain elements
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock LanguageContext
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ locale: "en" }),
}));

function renderHero() {
  return render(
    <MemoryRouter>
      <CinematicHero />
    </MemoryRouter>
  );
}

describe("CinematicHero", () => {
  it("renders the CTA button with min-h-[48px] for tap target compliance", () => {
    renderHero();
    const cta = screen.getByRole("button", { name: /discover the elixir/i });
    expect(cta).toBeInTheDocument();
    // Verify the class includes the 48px min-height
    expect(cta.className).toMatch(/min-h-\[48px\]/);
  });

  it("renders the CTA button with min-w-[200px]", () => {
    renderHero();
    const cta = screen.getByRole("button", { name: /discover the elixir/i });
    expect(cta.className).toMatch(/min-w-\[200px\]/);
  });

  it("renders a video element with object-cover for focal-point cropping", () => {
    renderHero();
    const video = document.querySelector("video");
    expect(video).not.toBeNull();
    expect(video!.className).toMatch(/object-cover/);
  });

  it("video has autoPlay, loop, muted, and playsInline attributes", () => {
    renderHero();
    const video = document.querySelector("video") as HTMLVideoElement;
    expect(video.autoplay).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.muted).toBe(true);
    expect(video.playsInline).toBe(true);
  });

  it("renders the correct mp4 source", () => {
    renderHero();
    const source = document.querySelector("video source");
    expect(source).not.toBeNull();
    expect(source!.getAttribute("src")).toBe("/videos/cinematic-hero.mp4");
  });

  it("CTA links to /shop", () => {
    renderHero();
    const link = screen.getByRole("link", { name: /discover the elixir/i });
    expect(link).toHaveAttribute("href", "/shop");
  });

  it("has a single H1 element", () => {
    renderHero();
    const headings = document.querySelectorAll("h1");
    expect(headings.length).toBe(1);
  });

  it("section has min-h-[600px] for consistent hero height", () => {
    renderHero();
    const section = document.querySelector("section");
    expect(section).not.toBeNull();
    expect(section!.className).toMatch(/min-h-\[600px\]/);
  });
});
