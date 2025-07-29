"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Don't redirect if still checking auth status
    if (authLoading) return;

    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    // Check for error from URL params (failed auth)
    const authError = searchParams.get("error");
    const errorMessage = searchParams.get("message");

    if (authError === "auth_failed") {
      setError("Authentication failed. Please try again.");
    } else if (authError === "access_denied") {
      setError(
        errorMessage ||
          "Access denied. You are not authorized to access this application."
      );
    } else if (authError === "callback_error") {
      setError("Authentication error occurred. Please try again.");
    } else if (authError === "login_failed") {
      setError(errorMessage || "Failed to complete login. Please try again.");
    }
  }, [isAuthenticated, authLoading, navigate, searchParams]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await login();
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to initiate login. Please try again.");
      setLoading(false);
    }
  };

  // Show loading while checking initial auth status
  if (authLoading) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.gradientBackground}></div>
        <div className={styles.content}>
          <div className={styles.logoContainer}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SAMU%20Logistics%20logo%20transparent-v5BVPHaCcfUGWVDnjCUmmT1MTkhfKS.png"
              alt="SAMU Logistics Logo"
              className={styles.logo}
            />
          </div>
          <h1 className={styles.title}>SAMU Logistics</h1>
          <p className={styles.subtitle}>
            Sistem de Management pentru Logistică Medicală
          </p>
          <div className={styles.authCard}>
            <div className={styles.loadingSection}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>
                Se verifică autentificarea...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      {/* Animated gradient background */}
      <div className={styles.gradientBackground}></div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SAMU%20Logistics%20logo%20transparent-v5BVPHaCcfUGWVDnjCUmmT1MTkhfKS.png"
            alt="SAMU Logistics Logo"
            className={styles.logo}
          />
        </div>
        <h1 className={styles.title}>SAMU Logistics</h1>
        <p className={styles.subtitle}>
          Sistem de Management pentru Logistică Medicală
        </p>

        {/* Auth Card */}
        <div className={styles.authCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Autentificare</h2>
            <p className={styles.cardSubtitle}>
              Conectați-vă pentru a accesa aplicația
            </p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.errorIcon}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={styles.googleButton}
          >
            <div className={styles.buttonContent}>
              {loading ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className={styles.googleIcon}
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span className={styles.buttonText}>
                {loading ? "Se conectează..." : "Continuă cu Google"}
              </span>
            </div>
          </button>

          <div className={styles.restrictionNotice}>
            <p>
              Accesul este restricționat doar pentru utilizatorii autorizați
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
