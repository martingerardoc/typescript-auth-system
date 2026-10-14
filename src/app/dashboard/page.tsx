
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  updateAccountProfile,
  type UserProfile,
} from "@/lib/auth-demo";
import { clearSession, getSession, setSession } from "@/lib/session";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentUser = getSession();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    setUser(currentUser);
    setFullName(currentUser.fullName);
    setEmail(currentUser.email);
  }, [router]);

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!user) return;

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = updateAccountProfile(user.id, {
        fullName,
        email,
      });

      setUser(updatedUser);
      setSession(updatedUser);
      setFullName(updatedUser.fullName);
      setEmail(updatedUser.email);
      setMessage("Your profile was updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p>Loading your profile...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link href="/" className="brand">
          TypeScript Auth
        </Link>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Sign out
        </button>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-heading">
          <p className="dashboard-eyebrow">ACCOUNT OVERVIEW</p>
          <h1>Welcome, {user.fullName}!</h1>
          <p>View and manage your personal account information.</p>
        </div>

        <div className="profile-card">
          <div className="profile-avatar" aria-hidden="true">
            {user.fullName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{user.fullName}</h2>
            <p className="profile-username">@{user.username}</p>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <section className="profile-form-card">
          <h2>Edit your profile</h2>
          <p className="section-description">
            Update your name or email address below.
          </p>

          {error && (
            <div className="message error-message" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className="message success-message" role="status">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} noValidate>
            <div className="form-field">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                value={user.username}
                readOnly
                disabled
              />
              <p className="input-hint">
                Your username cannot be changed here.
              </p>
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </section>
      </section>

      <footer className="home-footer">
        TypeScript Authentication System
      </footer>
    </main>
  );
}

