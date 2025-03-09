import { useRef } from "react";
import styles from "../Form/proposal-form.module.css";
import PAimage from "../../../assets/images/propunere-de-angajare.jpg";

export default function ProposalForm({
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
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/form2.jpg-TiN2jHLZH36YZoHUVgdqWT5dVukF2w.jpeg"
          alt="Proposal Form Template"
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
          name="purpose"
          value={formData.purpose || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.purposeField}`}
        />

        <input
          type="text"
          name="beneficiary"
          value={formData.beneficiary || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.beneficiaryField}`}
        />

        {/* Table Fields */}
        <div className={styles.proposalTableContainer}>
          {[...Array(4)].map((_, rowIndex) => (
            <div key={rowIndex} className={styles.proposalTableRow}>
              <input
                type="text"
                name={`classification${rowIndex}`}
                value={formData[`classification${rowIndex}`] || ""}
                onChange={handleInputChange}
                className={`${styles.inputField} ${styles.proposalTableCell}`}
              />
              <input
                type="text"
                name={`approved${rowIndex}`}
                value={formData[`approved${rowIndex}`] || ""}
                onChange={handleInputChange}
                className={`${styles.inputField} ${styles.proposalTableCell}`}
              />
              <input
                type="text"
                name={`engaged${rowIndex}`}
                value={formData[`engaged${rowIndex}`] || ""}
                onChange={handleInputChange}
                className={`${styles.inputField} ${styles.proposalTableCell}`}
              />
              <input
                type="text"
                name={`available${rowIndex}`}
                value={formData[`available${rowIndex}`] || ""}
                onChange={handleInputChange}
                className={`${styles.inputField} ${styles.proposalTableCell}`}
              />
              <div className={styles.proposalAmountGroup}>
                <input
                  type="text"
                  name={`amountType${rowIndex}`}
                  value={formData[`amountType${rowIndex}`] || ""}
                  onChange={handleInputChange}
                  className={`${styles.inputField} ${styles.proposalTableCell}`}
                />
                <input
                  type="text"
                  name={`amount${rowIndex}`}
                  value={formData[`amount${rowIndex}`] || ""}
                  onChange={handleInputChange}
                  className={`${styles.inputField} ${styles.proposalTableCell}`}
                />
                <input
                  type="text"
                  name={`exchangeRate${rowIndex}`}
                  value={formData[`exchangeRate${rowIndex}`] || ""}
                  onChange={handleInputChange}
                  className={`${styles.inputField} ${styles.proposalTableCell}`}
                />
                <input
                  type="text"
                  name={`lei${rowIndex}`}
                  value={formData[`lei${rowIndex}`] || ""}
                  onChange={handleInputChange}
                  className={`${styles.inputField} ${styles.proposalTableCell}`}
                />
              </div>
              <input
                type="text"
                name={`remaining${rowIndex}`}
                value={formData[`remaining${rowIndex}`] || ""}
                onChange={handleInputChange}
                className={`${styles.inputField} ${styles.proposalTableCell}`}
              />
            </div>
          ))}
        </div>

        {/* Signature Fields */}
        <input
          type="text"
          name="departmentDate"
          value={formData.departmentDate || ""}
          onChange={handleInputChange}
          onKeyDown={handleDateKeyDown}
          className={`${styles.inputField} ${styles.dateSignatureField} ${styles.proposalDepartmentDateField}`}
          placeholder="DD/MM/YYYY"
          maxLength={10}
          inputMode="numeric"
        />

        <input
          type="text"
          name="accountingDate"
          value={formData.accountingDate || ""}
          onChange={handleInputChange}
          onKeyDown={handleDateKeyDown}
          className={`${styles.inputField} ${styles.dateSignatureField} ${styles.proposalAccountingDateField}`}
          placeholder="DD/MM/YYYY"
          maxLength={10}
          inputMode="numeric"
        />

        <input
          type="text"
          name="financialControlDate"
          value={formData.financialControlDate || ""}
          onChange={handleInputChange}
          onKeyDown={handleDateKeyDown}
          className={`${styles.inputField} ${styles.dateSignatureField} ${styles.proposalCfppDateField}`}
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
          className={`${styles.inputField} ${styles.dateSignatureField} ${styles.proposalCreditorDateField}`}
          placeholder="DD/MM/YYYY"
          maxLength={10}
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
