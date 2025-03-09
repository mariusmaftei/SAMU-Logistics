import React from "react";
import { useRef } from "react";
import styles from "../Form/DummyForm.module.css";

export default function DummyForm({
  formData,
  handleInputChange,
  handleDateKeyDown,
}) {
  const containerRef = useRef(null);

  return (
    <div className={styles.formContainer} ref={containerRef}>
      <div className={styles.a4Paper}>
        <div className={styles.innerContainer}>
          <div className={styles.formTitle}>
            <h3> SERVICIUL DE AMBULANŢĂ JUDEJEAN BRAȘOV</h3>
          </div>
          <div className={styles.formDateContainer}>
            <div>
              <p>Data emiterii....................................</p>
              <p>Compartimentul de specialitate</p>
              <p>SAMU</p>
              <p>Nr. .......................................................</p>
            </div>
          </div>
          <div className={styles.subtitleContainer}>
            <div className={styles.subtitleTable}>
              <h3>ORDONANTARE DE PLATA</h3>
            </div>
          </div>
          <p>
            Narura
            cheltuielilor..............................................................................................................................
          </p>
          <p>
            Lista documentelor
            justificative......................................................................................................
            .
          </p>
          <p>
            ......................................................................................................
          </p>
        </div>
      </div>
    </div>
  );
}
