"use client";

import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { useZoom } from "../../context/ZoomContext";
import styles from "./ZoomControls.module.css";

export default function ZoomControls() {
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useZoom();

  return (
    <div className={styles.zoomControls}>
      <button
        onClick={zoomOut}
        className={styles.zoomButton}
        aria-label="Zoom out"
        title="Zoom out"
        disabled={zoomLevel <= 0.5}
      >
        <ZoomOut className={styles.icon} size={20} />
      </button>

      <div className={styles.zoomLevel}>
        {Math.round(zoomLevel * 100)}%
        {zoomLevel >= 1.5 && (
          <span className={styles.zoomLimitIndicator}>Max</span>
        )}
      </div>

      <button
        onClick={zoomIn}
        className={styles.zoomButton}
        aria-label="Zoom in"
        title="Zoom in"
        disabled={zoomLevel >= 1.5}
      >
        <ZoomIn className={styles.icon} size={20} />
      </button>

      <button
        onClick={resetZoom}
        className={styles.zoomButton}
        aria-label="Reset zoom"
        title="Reset zoom"
      >
        <RefreshCw className={styles.icon} size={20} />
      </button>
    </div>
  );
}
