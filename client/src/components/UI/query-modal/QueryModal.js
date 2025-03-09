import { useState } from "react";
import { X } from "lucide-react";
import styles from "../query-modal/QueryModal.module.css";

export default function QueryModal({ isOpen, onClose, onQuery, formEntries }) {
  const [queryParams, setQueryParams] = useState({
    fullName: "",
    city: "",
    treasuryNumber: "",
    bankAccount: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQueryParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onQuery(queryParams);
    onClose();
  };

  // Populate dropdown options from form entries
  const nameOptions = [...new Set(formEntries.map((entry) => entry.fullName))];
  const cityOptions = [...new Set(formEntries.map((entry) => entry.city))];
  const treasuryOptions = [
    ...new Set(formEntries.map((entry) => entry.treasuryNumber)),
  ];
  const bankOptions = [
    ...new Set(formEntries.map((entry) => entry.bankAccount)),
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Query Inventory</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <select
              id="fullName"
              name="fullName"
              value={queryParams.fullName}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select a name</option>
              {nameOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              value={queryParams.city}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select a city</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="treasuryNumber">Treasury Number</label>
            <select
              id="treasuryNumber"
              name="treasuryNumber"
              value={queryParams.treasuryNumber}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select a treasury number</option>
              {treasuryOptions.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bankAccount">Bank Account</label>
            <select
              id="bankAccount"
              name="bankAccount"
              value={queryParams.bankAccount}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select a bank account</option>
              {bankOptions.map((account) => (
                <option key={account} value={account}>
                  {account}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dateRangeContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="dateFrom">Date From</label>
              <input
                type="text"
                id="dateFrom"
                name="dateFrom"
                value={queryParams.dateFrom}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dateTo">Date To</label>
              <input
                type="text"
                id="dateTo"
                name="dateTo"
                value={queryParams.dateTo}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.queryButton}>
              Run Query
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
