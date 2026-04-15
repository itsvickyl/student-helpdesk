"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          color: "#1e293b",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "480px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              color: "#dc2626",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: "#64748b",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            {error?.message || "An unexpected error occurred. Please try again."}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#fff",
              background: "#3b82f6",
              border: "none",
              borderRadius: "0.75rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.background = "#2563eb")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.background = "#3b82f6")
            }
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
