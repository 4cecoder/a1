import Link from "next/link";

type ModuleStateProps = {
  title: string;
  description: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryNote?: string;
};

export default function ModuleState({
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryNote,
}: ModuleStateProps) {
  return (
    <section
      style={{
        border: "1px solid var(--line)",
        background: "var(--bg2)",
        padding: "20px",
        borderRadius: 12,
      }}
    >
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, color: "var(--t1)", marginBottom: 8 }}>{title}</h2>
      <p style={{ color: "var(--t2)", lineHeight: 1.6, marginBottom: 18 }}>{description}</p>

      {primaryCtaLabel && primaryCtaHref ? (
        <Link
          href={primaryCtaHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            border: "1px solid var(--gold)",
            color: "var(--gold)",
            textDecoration: "none",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {primaryCtaLabel}
        </Link>
      ) : null}

      {secondaryNote ? <p style={{ color: "var(--t3)", marginTop: 14, fontSize: 13 }}>{secondaryNote}</p> : null}
    </section>
  );
}
