import "./sign-in.css";
import { signInWithGoogle } from "@/lib/auth/actions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="signin-page signin-theme-dark">
      <section className="signin-visual" aria-label="Phil's Studio introduction">
        <div className="signin-ambient signin-ambient-one" aria-hidden="true" />
        <div className="signin-ambient signin-ambient-two" aria-hidden="true" />

        <div className="signin-brand">
          <div className="signin-brand-mark" aria-hidden="true">✦</div>
          <div>
            <strong>Phil&apos;s Studio</strong>
            <span>AI Tool Collection</span>
          </div>
        </div>

        <div className="signin-message">
          <h1>Every tool you need.<br />One beautiful workspace.</h1>
          <p>
            Save every useful tool, create a faster workflow, and keep your
            digital stack beautifully organized.
          </p>
        </div>

        <div className="signin-security-note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Your workspace, secured and synced.
        </div>
      </section>

      <section className="signin-form-col">
        <div className="signin-form-card">
          <div className="signin-mobile-brand">
            <span className="signin-brand-mark" aria-hidden="true">✦</span>
            Phil&apos;s Studio
          </div>
          <h2>Welcome back</h2>
          <p className="signin-form-description">
            Sign in with the authorized Google account to continue.
          </p>

          {error && (
            <div role="alert" className="signin-error">
              This Google account is not authorized to access the workspace.
            </div>
          )}

          <form action={signInWithGoogle}>
            <button type="submit" className="signin-google-button">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44c-.28 1.48-1.13 2.73-2.4 3.58v3h3.88c2.27-2.09 3.57-5.17 3.57-8.61z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09C3.25 21.3 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.29A7.19 7.19 0 0 1 4.9 12c0-.79.14-1.56.37-2.29V6.62H1.27A11.97 11.97 0 0 0 0 12c0 1.93.46 3.76 1.27 5.38l4-3.09z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.62l4 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="signin-access-note">
            Access is restricted to the configured Owner account.
          </p>
        </div>
      </section>
    </main>
  );
}
