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
    providers: "",
    address: "",
    cui_cif: "",
    treasury: "",
    iban: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editEntry && isOpen) {
      setEntry({
        providers: editEntry.providers || "",
        address: editEntry.address || "",
        cui_cif: editEntry.cui_cif || "",
        treasury: editEntry.treasury || "",
        iban: editEntry.iban || "",
      });
    } else if (!editEntry && isOpen) {
      setEntry({
        providers: "",
        address: "",
        cui_cif: "",
        treasury: "",
        iban: "",
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
        providers: "",
        address: "",
        cui_cif: "",
        treasury: "",
        iban: "",
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
                <label htmlFor="providers">Nume</label>
                <input
                  type="text"
                  id="providers"
                  name="providers"
                  value={entry.providers}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Numele complet al furnizorului"
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Adresa beneficiarului</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={entry.address}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Strada, numărul, orașul, județul"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Banking Information */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Informații bancare</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="treasury">Trezorerie</label>
                  <input
                    type="text"
                    id="treasuryNumber"
                    name="treasury"
                    value={entry.treasury}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Ex: 1234567890"
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cui_cif">CUI/CIF</label>
                  <input
                    type="text"
                    id="roCode"
                    name="cui_cif"
                    value={entry.cui_cif}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="RO123456789"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="iban">IBAN</label>
                <input
                  type="text"
                  id="accountNumber"
                  name="iban"
                  value={entry.iban}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="RO12TREZ1234567890123456"
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
