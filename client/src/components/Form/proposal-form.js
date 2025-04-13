import { useRef, useState, useEffect } from "react";
import styles from "./proposal-form.module.css";
import ProposalFormImage from "../../assets/images/propunere-de-angajare.jpg";
import DateInput from "../UI/DateInput/DateInput";
import SimpleDropdown from "../UI/SimpleDropdown/SimpleDropdown";
import BeneficiaryDropdown from "../UI/Dropdown/Dropdown";
import { useFormEntries } from "../../context/FormEntriesContext";

export default function ProposalForm({
  formData,
  handleInputChange,
  handleDateKeyDown,
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const inputColor = "rgba(31, 129, 248, 0.52)";
  const [selectedOptionText, setSelectedOptionText] = useState("");
  const { formEntries, getBeneficiaryByName } = useFormEntries();

  const categoryOptions = [
    { value: "MEDICAMENTATIE", label: "MEDICAMENTE" },
    { value: "MATERIALE SANITARE", label: "MATERIALE SANITARE" },
  ];

  const handleSelectChange = (e) => {
    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    setSelectedOptionText(selectedOption ? selectedOption.text : "");

    if (selectedOption && selectedOption.value) {
      select.style.backgroundColor = "transparent";
    } else {
      select.style.backgroundColor = "rgba(191, 219, 254, 0.3)";
    }

    handleInputChange(e);
  };

  useEffect(() => {
    if (formData.category) {
      const option = categoryOptions.find(
        (opt) => opt.value === formData.category
      );
      if (option) {
        setSelectedOptionText(option.label);
      }
    } else {
      setSelectedOptionText("");
    }
  }, [formData.category, categoryOptions]);

  const fillFormFields = (beneficiaryName) => {
    if (!beneficiaryName) return;

    const beneficiary = getBeneficiaryByName(beneficiaryName);

    if (beneficiary) {
      const fieldUpdates = [
        {
          name: "beneficiaryAddress",
          value: beneficiary.Adresa_Furnizor || "",
        },
        { name: "treasuryNumber", value: beneficiary.CUI_CUI_CIF || "" },
        { name: "accountNumber", value: beneficiary.NR_CONT_IBAN || "" },
      ];

      fieldUpdates.forEach((field) => {
        handleInputChange({
          target: {
            name: field.name,
            value: field.value,
          },
        });
      });
    }
  };

  const handleBeneficiaryNameChange = (e) => {
    handleInputChange(e);

    const beneficiaryName = e.target.value;

    if (beneficiaryName && beneficiaryName.includes(" ")) {
      fillFormFields(beneficiaryName);
    }
  };

  const handlePaste = (e) => {
    setTimeout(() => {
      const pastedName = e.target.value;

      if (pastedName && pastedName.trim() !== "") {
        fillFormFields(pastedName);
      }
    }, 10);
  };

  const fillAutoFields = (name, value, prevValue) => {
    if (!prevValue && value) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const currentDate = `${day}.${month}.${year}`;

      // Auto-fill date if it's empty
      if (!formData.dateIssued) {
        handleInputChange({
          target: {
            name: "dateIssued",
            value: currentDate,
          },
        });
      }

      // Auto-fill shortText with "SAMU" if it's empty
      if (!formData.shortText) {
        handleInputChange({
          target: {
            name: "shortText",
            value: "SAMU",
          },
        });
      }

      // Auto-fill additionalDate with current date if it's empty
      if (!formData.additionalDate) {
        handleInputChange({
          target: {
            name: "additionalDate",
            value: currentDate,
          },
        });
      }
    }
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    const prevValue = formData[name];

    handleInputChange(e);

    fillAutoFields(name, value, prevValue);
  };

  const beneficiariesForDropdown = formEntries.map((entry) => ({
    id: entry.id || String(Math.random()),
    Nume_Furnizor: entry.Nume_Furnizor,
  }));

  useEffect(() => {
    const handleBeforePrint = () => {
      if (containerRef.current) {
        const existingOverlays = document.querySelectorAll(
          ".print-text-overlay"
        );
        existingOverlays.forEach((overlay) => overlay.remove());

        const inputs = containerRef.current.querySelectorAll("input");

        inputs.forEach((input) => {
          if (input.value) {
            const rect = input.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            const top = rect.top - containerRect.top;
            const left = rect.left - containerRect.left;

            const overlay = document.createElement("div");
            overlay.className = "print-text-overlay";
            overlay.textContent = input.value;
            overlay.style.position = "absolute";
            overlay.style.left = `${left}px`;
            overlay.style.top = `${top}px`;
            overlay.style.width = `${rect.width}px`;
            overlay.style.height = `${rect.height}px`;
            overlay.style.textAlign = window.getComputedStyle(input).textAlign;
            overlay.style.fontSize = window.getComputedStyle(input).fontSize;
            overlay.style.fontFamily =
              window.getComputedStyle(input).fontFamily;
            overlay.style.color = "rgb(31 41 55)";
            overlay.style.zIndex = "1000";
            overlay.style.pointerEvents = "none";
            overlay.style.display = "none";
            overlay.style.lineHeight = "1";
            overlay.style.padding = "0";
            overlay.style.margin = "0";
            overlay.style.fontWeight = "500";

            if (input.name === "shortText") {
              overlay.style.paddingTop = "3px";
            } else if (input.name === "numericValue1") {
              overlay.style.paddingTop = "6px";
            } else if (input.name === "numericValue2") {
              overlay.style.paddingTop = "3px";
            } else if (input.name === "additionalDate") {
              overlay.style.paddingTop = "3px";
            } else {
              overlay.style.paddingTop = "3px";
            }

            overlay.dataset.for = input.name;

            containerRef.current.appendChild(overlay);
          }
        });

        if (formData.category) {
          const selectContainer = containerRef.current.querySelector(
            `.${styles.categoryContainer}`
          );
          if (selectContainer) {
            const printText = selectContainer.querySelector(
              `.${styles.printSelectText}`
            );
            if (printText) {
              printText.style.position = "absolute";
              printText.style.left = "0";
              printText.style.top = "0";
              printText.style.width = "100%";
              printText.style.height = "100%";
              printText.style.zIndex = "1001";
              printText.style.display = "flex";
              printText.style.alignItems = "center";
              printText.style.justifyContent = "center";
              printText.style.textAlign = "center";
              printText.style.paddingTop = "8px";
            }
          }
        }

        if (formData.beneficiaryName) {
          const beneficiaryInput = containerRef.current.querySelector(
            `[name="beneficiaryName"]`
          );
          if (beneficiaryInput) {
            const rect = beneficiaryInput.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            const top = rect.top - containerRect.top;
            const left = rect.left - containerRect.left;

            const overlay = document.createElement("div");
            overlay.className = "print-text-overlay";
            overlay.textContent = formData.beneficiaryName;
            overlay.style.position = "absolute";
            overlay.style.left = `${left}px`;
            overlay.style.top = `${top}px`;
            overlay.style.width = `${rect.width}px`;
            overlay.style.height = `${rect.height}px`;
            overlay.style.textAlign = "center";
            overlay.style.fontSize = "11pt";
            overlay.style.fontFamily = "inherit";
            overlay.style.color = "rgb(31 41 55)";
            overlay.style.zIndex = "1000";
            overlay.style.pointerEvents = "none";
            overlay.style.display = "none";
            overlay.style.lineHeight = "1";
            overlay.style.padding = "0";
            overlay.style.margin = "0";
            overlay.style.paddingTop = "3px";
            overlay.style.fontWeight = "500";

            overlay.dataset.for = "beneficiaryName";
            containerRef.current.appendChild(overlay);
          }
        }

        let styleTag = document.getElementById("print-overlay-styles-proposal");
        if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = "print-overlay-styles-proposal";
          document.head.appendChild(styleTag);
        }

        styleTag.textContent = `
      @media print {
        .print-text-overlay {
          display: block !important;
          position: absolute !important;
          background: transparent !important;
          line-height: 1 !important;
          padding: 0 !important;
          margin: 0 !important;
          padding-top: 3px !important;
          font-weight: 500 !important;
        }
        input {
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
          background-color: transparent !important;
        }
        .printSelectText {
          display: block !important;
          color: rgb(31 41 55) !important;
          -webkit-text-fill-color: rgb(31 41 55) !important;
          background: transparent !important;
          z-index: 1001 !important;
          padding-top: 8px !important;
          font-weight: 500 !important;
        }
        .formContainer {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          transform: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .beneficiary-dropdown-container {
          background-color: transparent !important;
        }
        .beneficiary-dropdown-container button,
        .beneficiary-dropdown-container .dropdown-menu {
          display: none !important;
        }
        .print-text-overlay[data-for="numericValue1"] {
          padding-top: 6px !important;
        }
        .print-text-overlay[data-for="numericValue2"] {
          padding-top: 3px !important;
        }
        .print-text-overlay[data-for="additionalDate"] {
          padding-top: 3px !important;
        }
      }
    `;
      }
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      const styleTag = document.getElementById("print-overlay-styles-proposal");
      if (styleTag) {
        styleTag.remove();
      }
    };
  }, [formData]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px transparent inset !important;
    -webkit-text-fill-color: rgb(31 41 55) !important;
    transition: background-color 5000s ease-in-out 0s;
    background-color: transparent !important;
  }
  
  input:autofill {
    background-color: transparent !important;
    color: rgb(31 41 55) !important;
  }
  
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus,
  select:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px transparent inset !important;
    transition: background-color 5000s ease-in-out 0s;
    background-color: transparent !important;
  }
`;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
          containerRef.current.classList.add(styles.mobileView);

          const scale = Math.max(0.25, Math.min(0.6, window.innerWidth / 800));

          containerRef.current.style.transform = `scale(${scale})`;

          const marginAdjustment = ((1 - scale) * 297) / 2;
          containerRef.current.style.marginTop = `-${marginAdjustment}mm`;
          containerRef.current.style.marginBottom = `-${marginAdjustment}mm`;
        } else {
          containerRef.current.classList.remove(styles.mobileView);
          containerRef.current.style.transform = "";
          containerRef.current.style.marginTop = "";
          containerRef.current.style.marginBottom = "";
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.formContainer} ref={containerRef}>
      <div className={styles.imageWrapper}>
        <img
          ref={imageRef}
          src={ProposalFormImage}
          alt="Proposal Form Template"
          className={styles.formImage}
        />
      </div>

      <div className={styles.formOverlay}>
        <DateInput
          name="dateIssued"
          value={formData.dateIssued || ""}
          onChange={handleFormInputChange}
          onKeyDown={handleDateKeyDown}
          className={`${styles.inputField} ${styles.dateField}`}
          placeholder="DD/MM/YYYY"
          inputColor={inputColor}
        />

        <input
          type="text"
          name="shortText"
          value={formData.shortText || ""}
          onChange={handleFormInputChange}
          className={`${styles.inputField} ${styles.shortTextField}`}
          maxLength={15}
          placeholder="Max 15 characters"
          style={{
            backgroundColor: formData.shortText ? "transparent" : inputColor,
          }}
          autocomplete="off"
        />

        <div
          className={`${styles.categoryContainer} ${
            !formData.category ? styles.empty : ""
          }`}
        >
          <SimpleDropdown
            name="category"
            value={formData.category || ""}
            onChange={(e) => {
              handleSelectChange(e);
              fillAutoFields(
                e.target.name,
                e.target.value,
                formData[e.target.name]
              );
            }}
            options={categoryOptions}
            className={`${styles.inputField} ${styles.categoryDropdown}`}
            style={{
              backgroundColor: formData.category ? "transparent" : inputColor,
              color: "transparent",
            }}
            placeholder="Select category"
          />

          <span className={styles.printSelectText}>
            {selectedOptionText || "Selectați categoria"}
          </span>
        </div>

        <BeneficiaryDropdown
          name="beneficiaryName"
          value={formData.beneficiaryName || ""}
          onChange={(e) => {
            handleBeneficiaryNameChange(e);
            fillAutoFields(
              e.target.name,
              e.target.value,
              formData[e.target.name]
            );
          }}
          onPaste={handlePaste}
          className={`${styles.inputField} ${styles.beneficiaryNameField}`}
          style={{
            top: "296px",
            right: "197px",
            width: "392px",
            textAlign: "center",
            height: "auto",
          }}
          beneficiaries={beneficiariesForDropdown}
        />

        <input
          type="text"
          name="numericValue1"
          value={formData.numericValue1 || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
              return;
            }

            // Update both numeric fields with the same value
            handleInputChange({
              target: { name: "numericValue1", value },
            });
            handleInputChange({
              target: { name: "numericValue2", value },
            });

            fillAutoFields("numericValue1", value, formData.numericValue1);
          }}
          className={`${styles.inputField} ${styles.numericField1}`}
          placeholder="0.00"
          inputMode="decimal"
          maxLength={12}
          style={{
            backgroundColor: formData.numericValue1
              ? "transparent"
              : inputColor,
          }}
          autocomplete="off"
        />

        <input
          type="text"
          name="numericValue2"
          value={formData.numericValue2 || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
              return;
            }

            // Update both numeric fields with the same value
            handleInputChange({
              target: { name: "numericValue1", value },
            });
            handleInputChange({
              target: { name: "numericValue2", value },
            });

            fillAutoFields("numericValue2", value, formData.numericValue2);
          }}
          className={`${styles.inputField} ${styles.numericField2}`}
          placeholder="0.00"
          inputMode="decimal"
          maxLength={12}
          style={{
            backgroundColor: formData.numericValue2
              ? "transparent"
              : inputColor,
          }}
          autocomplete="off"
        />

        <DateInput
          name="additionalDate"
          value={formData.additionalDate || ""}
          onChange={handleFormInputChange}
          onKeyDown={handleDateKeyDown}
          className={`${styles.inputField} ${styles.additionalDateField}`}
          placeholder="DD/MM/YYYY"
          inputColor={inputColor}
          style={{
            position: "absolute",
            bottom: "355px",
            left: "150px",
            transform: "translateX(-50%)",
            width: "120px",
            textAlign: "center",
          }}
        />
      </div>
    </div>
  );
}
