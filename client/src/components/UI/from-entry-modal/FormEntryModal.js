import { useState, useEffect } from "react";
import { X } from "lucide-react";
import styles from "../from-entry-modal/FormEntryModal.module.css";
import axios from "axios";

const API_URL = "http://localhost:8080/entry";

export default function AddEntryModal({ isOpen, onClose, onSave }) {
  const [newEntry, setNewEntry] = useState({
    fullName: "",
    address: "",
    treasuryNumber: "",
    accountNumber: "",
    roCode: "",
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
        fullName: "",
        address: "",
        treasuryNumber: "",
        accountNumber: "",
        roCode: "",
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
          <h2 className={styles.title}>Add New Entry</h2>
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
              <h3 className={styles.sectionTitle}>Personal Information</h3>

              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={newEntry.fullName}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newEntry.address}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Banking Information */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Banking Information</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="treasuryNumber">Treasury Number</label>
                  <input
                    type="text"
                    id="treasuryNumber"
                    name="treasuryNumber"
                    value={newEntry.treasuryNumber}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="roCode">RO Code</label>
                  <input
                    type="text"
                    id="roCode"
                    name="roCode"
                    value={newEntry.roCode}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="RO123456789"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="accountNumber">Account Number</label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={newEntry.accountNumber}
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
              {isSubmitting ? "Saving..." : "Save Entry"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
