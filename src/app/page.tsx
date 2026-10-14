
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-page">
      <nav className="home-nav">
        <Link href="/" className="brand">
          TypeScript Auth
        </Link>

        <div className="nav-links">
          <Link href="/login" className="nav-login">
            Sign in
          </Link>

          <Link href="/register" className="nav-register">
            Create account
          </Link>
        </div>
      </nav>

      <section className="home-hero">
        <span className="hero-label">ACCOUNT MANAGEMENT</span>

        <h1>
          Your account.
          <br />
          <span>Your control.</span>
        </h1>

        <p>
          Create an account, sign in, and manage your personal profile
          through a simple TypeScript-powered web application.
        </p>

        <div className="hero-actions">
          <Link href="/register" className="hero-primary">
            Get started
          </Link>

          <Link href="/login" className="hero-secondary">
            I already have an account →
          </Link>
        </div>

        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-number">01</span>
            <h2>Registration</h2>
            <p>Create your personal account.</p>
          </div>

          <div className="feature-item">
            <span className="feature-number">02</span>
            <h2>Authentication</h2>
            <p>Sign in with your credentials.</p>
          </div>

          <div className="feature-item">
            <span className="feature-number">03</span>
            <h2>Profile</h2>
            <p>Manage your account information.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        TypeScript Authentication System · Learning project
      </footer>
    </main>
  );
}
