import styles from "./LoadingSpinner.module.css";
import SAMULogo from "../../../assets/images/samu-logo.png";

export default function LoadingSpinner() {
  return (
    <div className={styles.spinner}>
      <div className={styles.logoContainer}>
        <img src={SAMULogo} alt="SAMU Logistics Logo" className={styles.logo} />
      </div>
      <div className={styles.ldsRoller}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={styles.loadingText}>Se Încarcă...</div>
    </div>
  );
}
