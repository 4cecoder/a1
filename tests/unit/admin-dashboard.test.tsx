import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock next/link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string } & Record<string, unknown>) =>
    <a href={href} {...props}>{children}</a>,
}));

describe("Admin Dashboard", () => {
  it("renders without crashing", async () => {
    const { default: AdminOverviewPage } = await import("../../app/admin/page");
    const { container } = render(<AdminOverviewPage />);
    expect(container).toBeTruthy();
  });

  it("shows the Admin Overview heading", async () => {
    const { default: AdminOverviewPage } = await import("../../app/admin/page");
    render(<AdminOverviewPage />);
    expect(screen.getByText("Admin Overview")).toBeInTheDocument();
  });

  it("renders at least 3 module section headings", async () => {
    const { default: AdminOverviewPage } = await import("../../app/admin/page");
    render(<AdminOverviewPage />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.length).toBeGreaterThanOrEqual(3);
  });

  it("renders navigation links to sub-sections", async () => {
    const { default: AdminOverviewPage } = await import("../../app/admin/page");
    render(<AdminOverviewPage />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    // Expect links to key admin routes
    expect(hrefs.some((h) => h?.includes("/admin/"))).toBe(true);
  });

  it("includes a link to appointments", async () => {
    const { default: AdminOverviewPage } = await import("../../app/admin/page");
    render(<AdminOverviewPage />);
    const links = screen.getAllByRole("link", { name: /appointments/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("includes a link to staff", async () => {
    const { default: AdminOverviewPage } = await import("../../app/admin/page");
    render(<AdminOverviewPage />);
    expect(screen.getByRole("link", { name: /^staff$/i })).toBeInTheDocument();
  });

  it("includes a link to services", async () => {
    const { default: AdminOverviewPage } = await import("../../app/admin/page");
    render(<AdminOverviewPage />);
    expect(screen.getByRole("link", { name: /^services$/i })).toBeInTheDocument();
  });

  it("renders clients section", async () => {
    const { default: AdminOverviewPage } = await import("../../app/admin/page");
    render(<AdminOverviewPage />);
    expect(screen.getByRole("heading", { name: /^clients$/i })).toBeInTheDocument();
  });

  it("renders schedule section", async () => {
    const { default: AdminOverviewPage } = await import("../../app/admin/page");
    render(<AdminOverviewPage />);
    expect(screen.getByRole("heading", { name: /^schedule$/i })).toBeInTheDocument();
  });
});
