import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock convex/react so components using useQuery/useMutation render without a provider
vi.mock("convex/react", () => ({
  useQuery: vi.fn(() => undefined),
  useMutation: vi.fn(() => vi.fn()),
  useAction: vi.fn(() => vi.fn()),
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
  ConvexReactClient: vi.fn(),
}));
