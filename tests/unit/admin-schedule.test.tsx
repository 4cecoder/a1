import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Admin Schedule Page", () => {
  it("renders without crashing", async () => {
    const { default: AdminSchedulePage } = await import("../../app/admin/schedule/page");
    const { container } = render(<AdminSchedulePage />);
    expect(container).toBeTruthy();
  });

  it("shows 'Admin · Schedule' heading", async () => {
    const { default: AdminSchedulePage } = await import("../../app/admin/schedule/page");
    render(<AdminSchedulePage />);
    expect(screen.getByRole("heading", { name: /Admin · Schedule/i })).toBeInTheDocument();
  });

  it("renders capacity overview panel", async () => {
    const { default: AdminSchedulePage } = await import("../../app/admin/schedule/page");
    render(<AdminSchedulePage />);
    expect(screen.getByText(/Capacity overview/i)).toBeInTheDocument();
  });

  it("shows the 4 capacity metric labels", async () => {
    const { default: AdminSchedulePage } = await import("../../app/admin/schedule/page");
    render(<AdminSchedulePage />);
    expect(screen.getByText("Total shift")).toBeInTheDocument();
    expect(screen.getByText("Utilization")).toBeInTheDocument();
    // "Blocked" and "Booked" may appear in multiple staff cards too
    expect(screen.getAllByText(/^Blocked$/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/^Booked$/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders conflict feed section", async () => {
    const { default: AdminSchedulePage } = await import("../../app/admin/schedule/page");
    render(<AdminSchedulePage />);
    expect(screen.getByText(/Conflict feed/i)).toBeInTheDocument();
  });

  it("renders a schedule board with all staff columns", async () => {
    const { default: AdminSchedulePage } = await import("../../app/admin/schedule/page");
    render(<AdminSchedulePage />);
    expect(screen.getAllByText("Marcus").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("DeShawn").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Ray").length).toBeGreaterThanOrEqual(1);
  });

  it("shows shift window ranges for barbers", async () => {
    const { default: AdminSchedulePage } = await import("../../app/admin/schedule/page");
    render(<AdminSchedulePage />);
    expect(screen.getByText("09:00 - 17:00")).toBeInTheDocument();
  });

  it("shows appointment client names", async () => {
    const { default: AdminSchedulePage } = await import("../../app/admin/schedule/page");
    render(<AdminSchedulePage />);
    expect(screen.getAllByText(/Jordan K\./).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Myles R\./).length).toBeGreaterThanOrEqual(1);
  });
});

describe("ScheduleBoard component", () => {
  it("renders cards for each staff member", async () => {
    const { default: ScheduleBoard } = await import("../../components/admin/schedule/ScheduleBoard");
    const shiftWindows = [
      { id: "s1", staffId: "alice", staffName: "Alice", range: { start: "09:00", end: "17:00" } },
    ];
    render(
      <ScheduleBoard
        shiftWindows={shiftWindows}
        blockedSlots={[]}
        appointments={[]}
        conflicts={[]}
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("09:00 - 17:00")).toBeInTheDocument();
  });

  it("shows 'No blocked slots' when there are none", async () => {
    const { default: ScheduleBoard } = await import("../../components/admin/schedule/ScheduleBoard");
    const shiftWindows = [
      { id: "s1", staffId: "bob", staffName: "Bob", range: { start: "10:00", end: "18:00" } },
    ];
    render(
      <ScheduleBoard
        shiftWindows={shiftWindows}
        blockedSlots={[]}
        appointments={[]}
        conflicts={[]}
      />
    );
    expect(screen.getByText(/No blocked slots/i)).toBeInTheDocument();
  });
});

describe("CapacityPanel component", () => {
  it("renders utilization percentage and total shift hours", async () => {
    const { default: CapacityPanel } = await import("../../components/admin/schedule/CapacityPanel");
    const snapshot = {
      totalShiftMinutes: 480,
      totalBlockedMinutes: 60,
      totalAvailableMinutes: 420,
      totalBookedMinutes: 120,
      overallUtilization: 0.25,
      perStaff: [],
    };
    render(<CapacityPanel snapshot={snapshot} />);
    expect(screen.getByText("25.0%")).toBeInTheDocument();
    expect(screen.getByText("8.0h")).toBeInTheDocument(); // 480 min = 8h
  });
});
