"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  // Subtle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Navigation handlers
  const navigateToForm = () => {
    navigate("/form");
  };

  const navigateToEntries = () => {
    navigate("/entries");
  };

  return (
    <div className={styles.homeContainer}>
      {/* Simple linear gradient background */}
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
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={navigateToForm}>
            Formular
          </button>
          <button className={styles.button} onClick={navigateToEntries}>
            Intrări Formular
          </button>
        </div>
      </div>
    </div>
  );
}
