import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock next/image as a plain <img> so tests work without Next.js runtime
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    const { priority, ...rest } = props;
    return <img data-priority={priority ? "true" : undefined} {...rest} />;
  },
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <section {...props}>{children}</section>,
  },
  useReducedMotion: () => false,
}));

// Import the component we want to test
// We test the HeroMosaic images specifically
describe("Hero Image Mosaic", () => {
  it("renders hero mosaic images with priority on the first image", async () => {
    // Dynamically import to pick up mocks
    const { HeroMosaic } = await import("../../app/components/HeroMosaic");
    render(<HeroMosaic />);

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(3);

    // First image should have priority
    const priorityImg = images.find((img) => img.getAttribute("data-priority") === "true");
    expect(priorityImg).toBeDefined();
  });

  it("all hero mosaic images have descriptive alt text", async () => {
    const { HeroMosaic } = await import("../../app/components/HeroMosaic");
    render(<HeroMosaic />);

    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img.getAttribute("alt")).toBeTruthy();
    });
  });

  it("renders an overlay div on hero background", async () => {
    const { HeroMosaic } = await import("../../app/components/HeroMosaic");
    const { container } = render(<HeroMosaic />);

    // The overlay should be present as a positioned div
    const overlay = container.querySelector("[data-testid='hero-overlay']");
    expect(overlay).toBeInTheDocument();
  });
});
