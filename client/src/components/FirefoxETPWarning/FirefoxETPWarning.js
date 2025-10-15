import React, { useState } from "react";
import styles from "./FirefoxETPWarning.module.css";

const FirefoxETPWarning = ({ onDismiss }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleRetry = () => {
    // Clear any cached data and retry authentication
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className={styles.warningContainer}>
      <div className={styles.warningContent}>
        <div className={styles.icon}>⚠️</div>
        <div className={styles.text}>
          <h3>Firefox Enhanced Tracking Protection Detected</h3>
          <p>
            Your Firefox browser has Enhanced Tracking Protection enabled, which
            may interfere with authentication. If you're experiencing login
            issues, please try one of these solutions:
          </p>
          <ul>
            <li>Click "Retry Authentication" below</li>
            <li>Disable Enhanced Tracking Protection temporarily</li>
            <li>Add this site to your Firefox exceptions</li>
            <li>Use Chrome or Edge for the best experience</li>
          </ul>
        </div>
        <div className={styles.actions}>
          <button onClick={handleRetry} className={styles.retryButton}>
            Retry Authentication
          </button>
          <button onClick={handleDismiss} className={styles.dismissButton}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirefoxETPWarning;
