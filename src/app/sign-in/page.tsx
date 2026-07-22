import "./sign-in.css";
import { signInWithGoogle } from "@/lib/auth/actions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        minHeight: 640,
        display: "flex",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        className="signin-visual"
        style={{
          width: "44%",
          flexShrink: 0,
          position: "relative",
          padding: 40,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(160deg,#4F46E5 0%,#6366F1 42%,#67E8F9 100%)",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              flexShrink: 0,
              background: "rgba(255,255,255,.18)",
              border: "1px solid rgba(255,255,255,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            P
          </div>
          <span style={{ fontSize: 16, fontWeight: 700 }}>
            Phil&apos;s Studio
          </span>
        </div>

        <div>
          <div
            style={{
              fontSize: "clamp(30px,3.6vw,42px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            Every tool you need.
            <br />
            One beautiful workspace.
          </div>
          <div
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,.85)",
              marginTop: 16,
              maxWidth: 420,
              lineHeight: 1.5,
            }}
          >
            Save every useful tool, create a faster workflow, and keep your
            digital stack beautifully organized.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "rgba(255,255,255,.85)",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Your workspace, secured and synced.
        </div>
      </div>

      <div
        className="signin-form-col"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.01em",
            }}
          >
            Welcome back
          </div>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 8 }}>
            Sign in with the authorized Google account to continue.
          </div>

          {error && (
            <div
              role="alert"
              style={{
                marginTop: 18,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #FECACA",
                background: "#FEF2F2",
                color: "#B91C1C",
                fontSize: 13,
                lineHeight: 1.45,
              }}
            >
              This Google account is not authorized to access the workspace.
            </div>
          )}

          <form action={signInWithGoogle}>
            <button
              type="submit"
              style={{
                width: "100%",
                height: 48,
                marginTop: 28,
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
                cursor: "pointer",
                boxShadow: "0 8px 22px rgba(15,23,42,.08)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44c-.28 1.48-1.13 2.73-2.4 3.58v3h3.88c2.27-2.09 3.57-5.17 3.57-8.61z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09C3.25 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.29A7.19 7.19 0 0 1 4.9 12c0-.79.14-1.56.37-2.29V6.62H1.27A11.97 11.97 0 0 0 0 12c0 1.93.46 3.76 1.27 5.38l4-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.62l4 3.09C6.22 6.86 8.87 4.75 12 4.75z"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          <div
            style={{
              marginTop: 18,
              fontSize: 12,
              color: "#9CA3AF",
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            Access is restricted to the configured Owner account.
          </div>
        </div>
      </div>
    </div>
  );
}
