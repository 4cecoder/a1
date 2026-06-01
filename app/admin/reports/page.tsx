"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { createRevealVariants, revealItemVariants } from "@/lib/motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const containerVariants = createRevealVariants(0.07, 0);

type Period = "week" | "month";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function RevenueChart({ data, period }: { data: Record<string, number>; period: Period }) {
  const now = new Date();
  const days = period === "week" ? 7 : 30;

  const slots = useMemo(() => {
    const result: { label: string; valueCents: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const label = period === "week"
        ? DAY_LABELS[d.getDay()]!
        : String(d.getDate());
      result.push({ label, valueCents: data[key] ?? 0 });
    }
    return result;
  }, [data, period]);

  const max = Math.max(...slots.map((s) => s.valueCents), 1);
  const W = 560;
  const H = 160;
  const padX = 36;
  const padY = 14;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const points = slots.map((s, i) => {
    const x = padX + (i / (slots.length - 1)) * innerW;
    const y = padY + innerH - (s.valueCents / max) * innerH;
    return { x, y, ...s };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1]!.x} ${padY + innerH} L ${points[0]!.x} ${padY + innerH} Z`;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H + 28}`} style={{ width: "100%", minWidth: 320, height: "auto", display: "block" }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = padY + innerH * (1 - frac);
          const label = `$${((max * frac) / 100).toFixed(0)}`;
          return (
            <g key={frac}>
              <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={padX - 4} y={y + 4} fill="rgba(255,255,255,0.3)" fontSize={9} textAnchor="end">{label}</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#revenueGrad)" opacity={0.3} />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#C9A84C" strokeWidth={2} strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="#C9A84C" />
        ))}

        {/* X labels — show every nth */}
        {points.map((p, i) => {
          const showEvery = period === "week" ? 1 : 5;
          if (i % showEvery !== 0) return null;
          return (
            <text key={i} x={p.x} y={H + 20} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle">{p.label}</text>
          );
        })}

        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function DowChart({ counts }: { counts: number[] }) {
  const max = Math.max(...counts, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
      {counts.map((count, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: "var(--t3)" }}>{count}</span>
          <div
            style={{
              width: "100%",
              height: `${(count / max) * 80}px`,
              background: count === Math.max(...counts) ? "var(--gold)" : "rgba(201,168,76,0.35)",
              borderRadius: "4px 4px 0 0",
              minHeight: count > 0 ? 4 : 0,
              transition: "height 0.3s ease",
            }}
          />
          <span style={{ fontSize: 10, color: "var(--t2)" }}>{DAY_LABELS[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<Period>("month");
  const reportsData = useQuery(api.dashboard.getReportsData);

  const revenueByDay = reportsData?.revenueByDay ?? {};
  const topServices = reportsData?.topServices ?? [];
  const dowCounts = reportsData?.dowCounts ?? [0, 0, 0, 0, 0, 0, 0];

  const totalRevenueCents = Object.values(revenueByDay).reduce((a, b) => a + b, 0);
  const totalBookings = (reportsData?.topServices ?? []).reduce((a, s) => a + s.count, 0);
  const maxServices = topServices.reduce((a, s) => a + s.count, 1);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ display: "grid", gap: 20 }}>
      {/* Header */}
      <motion.div variants={revealItemVariants} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>Analytics</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: 28, color: "var(--t1)" }}>Reports</h1>
          <p style={{ color: "var(--t2)", fontSize: 14, marginTop: 4 }}>Revenue trends, service mix, and busiest days.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: period === p ? "1px solid var(--gold)" : "1px solid var(--line)",
                background: period === p ? "rgba(201,168,76,0.12)" : "var(--bg2)",
                color: period === p ? "var(--gold)" : "var(--t2)",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: period === p ? 600 : 400,
              }}
            >
              {p === "week" ? "Last 7 days" : "Last 30 days"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* KPI summary */}
      <motion.div variants={revealItemVariants} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        {[
          { label: "Total Revenue", value: `$${(totalRevenueCents / 100).toFixed(2)}`, accent: true },
          { label: "Total Bookings", value: String(totalBookings) },
          { label: "Top Service", value: topServices[0]?.name ?? "—" },
          { label: "Busiest Day", value: dowCounts.reduce((best, c, i) => c > dowCounts[best]! ? i : best, 0) !== undefined ? DAY_LABELS[dowCounts.reduce((best, c, i) => c > dowCounts[best]! ? i : best, 0)]! : "—" },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 16px" }}>
            <p style={{ color: "var(--t2)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{kpi.label}</p>
            <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 22, fontWeight: 700, color: kpi.accent ? "var(--gold)" : "var(--t1)" }}>{kpi.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Revenue chart */}
      <motion.div variants={revealItemVariants} style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 14, padding: "20px" }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 18, marginBottom: 16 }}>Revenue Trend</h2>
        {reportsData === undefined ? (
          <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t3)", fontSize: 13 }}>Loading…</div>
        ) : (
          <RevenueChart data={revenueByDay} period={period} />
        )}
      </motion.div>

      {/* Top services + busiest day */}
      <motion.div variants={revealItemVariants} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {/* Top services */}
        <div style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 18, marginBottom: 16 }}>Top Services</h2>
          {reportsData === undefined ? (
            <p style={{ color: "var(--t3)", fontSize: 13 }}>Loading…</p>
          ) : topServices.length === 0 ? (
            <p style={{ color: "var(--t3)", fontSize: 13 }}>No data yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {topServices.map((svc, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "var(--t1)", fontSize: 13 }}>{svc.name}</span>
                    <span style={{ color: "var(--t2)", fontSize: 12, fontFamily: "var(--font-mono), monospace" }}>{svc.count}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 4, background: "var(--bg1)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(svc.count / maxServices) * 100}%`, background: i === 0 ? "var(--gold)" : "rgba(201,168,76,0.4)", borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Busiest day of week */}
        <div style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 18, marginBottom: 16 }}>Busiest Day of Week</h2>
          {reportsData === undefined ? (
            <p style={{ color: "var(--t3)", fontSize: 13 }}>Loading…</p>
          ) : (
            <DowChart counts={dowCounts} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
