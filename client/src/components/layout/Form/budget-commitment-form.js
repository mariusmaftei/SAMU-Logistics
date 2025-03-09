import { useRef } from "react";
import styles from "../Form/budget-commitment-form.module.css";
import ABIimage from "../../../assets/images/angajament-bugetar-individual.jpg";

export default function BudgetCommitmentForm({
  formData,
  handleInputChange,
  handleDateKeyDown,
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  return (
    <div className={styles.formContainer} ref={containerRef}>
      <div className={styles.imageWrapper}>
        <img
          ref={imageRef}
          src={ABIimage}
          alt="Budget Commitment Form Template"
          className={styles.formImage}
        />
      </div>

      <div className={styles.formOverlay}>
        {/* Header Fields */}
        <input
          type="text"
          name="dateIssued"
          value={formData.dateIssued || ""}
          onChange={handleInputChange}
          onKeyDown={handleDateKeyDown}
          className={`${styles.inputField} ${styles.dateField}`}
          placeholder="DD/MM/YYYY"
          maxLength={10}
          inputMode="numeric"
        />

        <input
          type="text"
          name="number"
          value={formData.number || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.numberField}`}
        />

        {/* Main Content Fields */}
        <input
          type="text"
          name="beneficiary"
          value={formData.beneficiary || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.budgetBeneficiaryField}`}
        />

        <input
          type="text"
          name="budgetRegistration"
          value={formData.budgetRegistration || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.budgetRegistrationField}`}
        />

        <input
          type="text"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.descriptionField}`}
        />

        <input
          type="text"
          name="totalAmount"
          value={formData.totalAmount || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.totalAmountField}`}
        />

        {/* Signature Fields */}
        <input
          type="text"
          name="financialControlDate"
          value={formData.financialControlDate || ""}
          onChange={handleInputChange}
          onKeyDown={handleDateKeyDown}
          className={`${styles.inputField} ${styles.dateSignatureField} ${styles.budgetCfppDateField}`}
          placeholder="DD/MM/YYYY"
          maxLength={10}
          inputMode="numeric"
        />

        <input
          type="text"
          name="creditOfficerDate"
          value={formData.creditOfficerDate || ""}
          onChange={handleInputChange}
          onKeyDown={handleDateKeyDown}
          className={`${styles.inputField} ${styles.dateSignatureField} ${styles.budgetCreditorDateField}`}
          placeholder="DD/MM/YYYY"
          maxLength={10}
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
