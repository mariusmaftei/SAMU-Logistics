import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import styles from "./ProtectedRoute.module.css";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to auth page if not authenticated
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p className={styles.loadingText}>Checking authentication...</p>
      </div>
    );
  }

  // Show loading if not authenticated (while redirecting)
  if (!isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p className={styles.loadingText}>Redirecting to login...</p>
      </div>
    );
  }

  // Render protected content if authenticated
  return children;
}
