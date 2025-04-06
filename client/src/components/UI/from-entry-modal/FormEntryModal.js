import { useState } from "react";
import { X } from "lucide-react";
import styles from "../from-entry-modal/FormEntryModal.module.css";
import axios from "axios";

const API_URL = "https://samu-logistic-server.onrender.com/entry";

export default function AddEntryModal({ isOpen, onClose, onSave }) {
  const [newEntry, setNewEntry] = useState({
    Nume_Furnizor: "",
    Adresa_Furnizor: "",
    CUI_CUI_CIF: "",
    Trezorerie_Furnizor: "",
    NR_CONT_IBAN: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log(newEntry); // Add this to check if data is correct

    try {
      const response = await axios.post(API_URL, newEntry);
      onSave(response.data);
      setNewEntry({
        Nume_Furnizor: "",
        Adresa_Furnizor: "",
        CUI_CUI_CIF: "",
        Trezorerie_Furnizor: "",
        NR_CONT_IBAN: "",
      });
      onClose();
    } catch (err) {
      console.error("Error submitting entry:", err);
      setError(
        err.response?.data?.message || "Failed to save entry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Adaugă o nouă intrare</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            disabled={isSubmitting}
          >
            <X className={styles.closeIcon} />
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.compactFormLayout}>
            {/* Personal Information */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Informații personale</h3>

              <div className={styles.formGroup}>
                <label htmlFor="Nume_Furnizor">Nume</label>
                <input
                  type="text"
                  id="Nume_Furnizor"
                  name="Nume_Furnizor"
                  value={newEntry.Nume_Furnizor}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="Adresa_Furnizor">Adresa beneficiarului</label>
                <input
                  type="text"
                  id="address"
                  name="Adresa_Furnizor"
                  value={newEntry.Adresa_Furnizor}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Banking Information */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Informații bancare</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="CUI_CUI_CIF"> Trezorerie</label>
                  <input
                    type="text"
                    id="treasuryNumber"
                    name="CUI_CUI_CIF"
                    value={newEntry.CUI_CUI_CIF}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="NR_CONT_IBAN">CUI/CIF</label>
                  <input
                    type="text"
                    id="roCode"
                    name="NR_CONT_IBAN"
                    value={newEntry.NR_CONT_IBAN}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="RO123456789"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="Trezorerie_Furnizor">IBAN</label>
                <input
                  type="text"
                  id="accountNumber"
                  name="Trezorerie_Furnizor"
                  value={newEntry.Trezorerie_Furnizor}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="RO12TREZ..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Se salvează..." : "Salvează intrarea"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
