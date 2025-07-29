import { useState, useEffect } from "react";
import { X } from "lucide-react";
import styles from "./EntryModal.module.css";
import { useFormEntries } from "../../../context/FormEntriesContext";

export default function EntryModal({
  isOpen,
  onClose,
  onSave,
  editEntry = null,
}) {
  const { createEntry, updateEntry } = useFormEntries();
  const isEditMode = !!editEntry;

  const [entry, setEntry] = useState({
    Nume_Furnizor: "",
    Adresa_Furnizor: "",
    CUI_CUI_CIF: "",
    Trezorerie_Furnizor: "",
    NR_CONT_IBAN: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editEntry && isOpen) {
      setEntry({
        Nume_Furnizor: editEntry.Nume_Furnizor || "",
        Adresa_Furnizor: editEntry.Adresa_Furnizor || "",
        CUI_CUI_CIF: editEntry.CUI_CUI_CIF || "",
        Trezorerie_Furnizor: editEntry.Trezorerie_Furnizor || "",
        NR_CONT_IBAN: editEntry.NR_CONT_IBAN || "",
      });
    } else if (!editEntry && isOpen) {
      setEntry({
        Nume_Furnizor: "",
        Adresa_Furnizor: "",
        CUI_CUI_CIF: "",
        Trezorerie_Furnizor: "",
        NR_CONT_IBAN: "",
      });
    }
  }, [editEntry, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (isEditMode) {
        result = await updateEntry(editEntry._id || editEntry.id, entry);
        console.log("Entry updated successfully:", result);
      } else {
        result = await createEntry(entry);
        console.log("Entry created successfully:", result);
      }

      setEntry({
        Nume_Furnizor: "",
        Adresa_Furnizor: "",
        CUI_CUI_CIF: "",
        Trezorerie_Furnizor: "",
        NR_CONT_IBAN: "",
      });

      onSave(result);

      onClose();
    } catch (err) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} entry:`,
        err
      );
      setError(
        err.message ||
          `Failed to ${isEditMode ? "update" : "save"} entry. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>
            {isEditMode ? "Editează intrarea" : "Adaugă o nouă intrare"}
          </h2>
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
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Informații personale</h3>

              <div className={styles.formGroup}>
                <label htmlFor="Nume_Furnizor">Nume</label>
                <input
                  type="text"
                  id="Nume_Furnizor"
                  name="Nume_Furnizor"
                  value={entry.Nume_Furnizor}
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
                  value={entry.Adresa_Furnizor}
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
                  <label htmlFor="CUI_CUI_CIF">Trezorerie</label>
                  <input
                    type="text"
                    id="treasuryNumber"
                    name="CUI_CUI_CIF"
                    value={entry.CUI_CUI_CIF}
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
                    value={entry.NR_CONT_IBAN}
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
                  value={entry.Trezorerie_Furnizor}
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
              {isSubmitting
                ? isEditMode
                  ? "Se actualizează..."
                  : "Se salvează..."
                : isEditMode
                ? "Actualizează intrarea"
                : "Salvează intrarea"}
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
