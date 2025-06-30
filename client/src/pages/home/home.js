import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import SAMULogo from "../../assets/images/samu-logo.png";

export default function Home() {
  const navigate = useNavigate();

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
            src={SAMULogo}
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
