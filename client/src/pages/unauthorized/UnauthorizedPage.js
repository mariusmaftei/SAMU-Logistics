"use client";

import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Info } from "lucide-react";
import styles from "./UnauthorizedPage.module.css";

export default function UnauthorizedPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "your email";

  const handleBackToLogin = () => {
    navigate("/auth", { replace: true });
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent("Cerere de Acces - SAMU Logistics");
    const body = encodeURIComponent(
      `Bună ziua,\n\nSolicită acces la aplicația SAMU Logistics.\n\nEmail-ul meu: ${email}\n\nVă rog să luați în considerare acordarea accesului la sistem.\n\nMulțumesc.`
    );
    window.open(
      `mailto:softindexlabs@gmail.com?subject=${subject}&body=${body}`
    );
  };

  return (
    <div className={styles.unauthorizedContainer}>
      {/* Animated gradient background - same as home */}
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

        {/* Simple Access Card */}
        <div className={styles.accessCard}>
          <div className={styles.cardHeader}>
            <div className={styles.infoIcon}>
              <Info size={32} />
            </div>
            <h2 className={styles.cardTitle}>Acces Restricționat</h2>
            <p className={styles.cardSubtitle}>
              Această aplicație este disponibilă doar pentru utilizatorii
              autorizați
            </p>
          </div>

          <div className={styles.emailInfo}>
            <Mail className={styles.mailIcon} />
            <span className={styles.emailText}>
              Email încercat: <strong>{email}</strong>
            </span>
          </div>

          <div className={styles.messageBox}>
            <p className={styles.message}>
              Pentru a obține acces la aplicație, vă rugăm să contactați
              administratorul sistemului.
            </p>
          </div>

          <div className={styles.actionButtons}>
            <button onClick={handleBackToLogin} className={styles.backButton}>
              <ArrowLeft className={styles.buttonIcon} />
              Înapoi la Autentificare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
