import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--bg0)",
        color: "var(--t1)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <section
        style={{
          width: "min(520px, 100%)",
          border: "1px solid var(--line)",
          background: "var(--bg1)",
          borderRadius: 16,
          padding: "32px 28px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <span style={{ fontSize: 24 }}>🔒</span>
        </div>

        <p
          style={{
            color: "var(--gold)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Access Restricted
        </p>
        <h1
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 28,
            color: "var(--t1)",
            lineHeight: 1.15,
            marginBottom: 14,
          }}
        >
          Access restricted to administrators
        </h1>
        <p
          style={{
            color: "var(--t2)",
            lineHeight: 1.7,
            fontSize: 14,
            marginBottom: 28,
          }}
        >
          This area is only accessible to admin-level accounts. If you believe you should have access, please contact your administrator.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              border: "1px solid var(--gold)",
              color: "var(--gold)",
              textDecoration: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            ← Return Home
          </Link>
          <Link
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "var(--bg2)",
              border: "1px solid var(--line)",
              color: "var(--t2)",
              textDecoration: "none",
              borderRadius: 10,
              fontSize: 13,
            }}
          >
            Try Admin Login
          </Link>
        </div>
      </section>
    </main>
  );
}
