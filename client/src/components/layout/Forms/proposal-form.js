import { useRef, useState, useEffect, useMemo } from "react";
import styles from "./proposal-form.module.css";

import { useFormEntries } from "../../../context/FormEntriesContext";

import ProposalFormImage from "../../../assets/images/propunere-de-angajare.jpg";
import DateInput from "../../UI/DateInput/DateInput";
import SimpleDropdown from "../../UI/SimpleDropdown/SimpleDropdown";
import BeneficiaryDropdown from "../../UI/BeneficiaryDropdown/BeneficiaryDropdown";

import InputNumber from "../../UI/InputNumber/InputNumber";

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

  const categoryOptions = useMemo(
    () => [
      { value: "MEDICAMENTATIE", label: "MEDICAMENTE" },
      { value: "MATERIALE SANITARE", label: "MATERIALE SANITARE" },
    ],
    []
  );

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

    // Autofill logic for the three new inputs (autofillInput4, 5, 6)
    if (e.target.value === "MEDICAMENTATIE") {
      handleInputChange({ target: { name: "autofillInput4", value: "20." } });
      handleInputChange({ target: { name: "autofillInput5", value: "04." } });
      handleInputChange({ target: { name: "autofillInput6", value: "01" } });
    } else if (e.target.value === "MATERIALE SANITARE") {
      handleInputChange({ target: { name: "autofillInput4", value: "20." } });
      handleInputChange({ target: { name: "autofillInput5", value: "04." } });
      handleInputChange({ target: { name: "autofillInput6", value: "02" } });
    } else {
      // Clear if no specific option selected
      handleInputChange({ target: { name: "autofillInput4", value: "" } });
      handleInputChange({ target: { name: "autofillInput5", value: "" } });
      handleInputChange({ target: { name: "autofillInput6", value: "" } });
    }
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

    if (beneficiaryName && beneficiaryName.trim() !== "") {
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

      if (!formData.dateIssued) {
        handleInputChange({
          target: {
            name: "dateIssued",
            value: currentDate,
          },
        });
      }

      if (!formData.shortText) {
        handleInputChange({
          target: {
            name: "shortText",
            value: "SAMU",
          },
        });
      }

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

  const handleDateInput = (e) => {
    const { name, value } = e.target;
    let formattedValue = value.replace(/\./g, "");

    if (!/^\d*$/.test(formattedValue)) {
      return;
    }

    if (formattedValue.length > 0) {
      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.slice(0, 2) + "." + formattedValue.slice(2);
      }

      if (formattedValue.length > 5) {
        formattedValue =
          formattedValue.slice(0, 5) + "." + formattedValue.slice(5);
      }

      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }
    }

    const syntheticEvent = {
      target: {
        name,
        value: formattedValue,
      },
    };

    handleFormInputChange(syntheticEvent);
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
        const originalTransform = containerRef.current.style.transform;
        const originalMarginTop = containerRef.current.style.marginTop;
        const originalMarginBottom = containerRef.current.style.marginBottom;

        containerRef.current.style.transform = "none";
        containerRef.current.style.margin = "0";

        const existingOverlays = document.querySelectorAll(
          ".print-text-overlay"
        );
        existingOverlays.forEach((overlay) => overlay.remove());

        const overlayContainer = document.createElement("div");
        overlayContainer.className = "print-overlay-container";
        containerRef.current.appendChild(overlayContainer);

        const createFixedOverlay = (
          name,
          value,
          top,
          left,
          width,
          textAlign = "center"
        ) => {
          if (!value) return;

          const overlay = document.createElement("div");
          overlay.className = "print-text-overlay";
          overlay.textContent = value;
          overlay.dataset.for = name;

          overlay.style.position = "absolute";
          overlay.style.top = `${top}px`;
          overlay.style.left = `${left}px`;
          overlay.style.width = `${width}px`;
          overlay.style.textAlign = textAlign;
          overlay.style.fontSize = "11pt";
          overlay.style.fontFamily = "inherit";
          overlay.style.color = "rgb(31 41 55)";
          overlay.style.fontWeight = "500";
          overlay.style.zIndex = "1000";
          overlay.style.display = "none";

          overlayContainer.appendChild(overlay);
        };

        const createFixedOverlayFromRight = (
          name,
          value,
          top,
          right,
          width,
          textAlign = "center"
        ) => {
          if (!value) return;

          const overlay = document.createElement("div");
          overlay.className = "print-text-overlay";
          overlay.textContent = value;
          overlay.dataset.for = name;

          overlay.style.position = "absolute";
          overlay.style.top = `${top}px`;

          const leftPosition = 794 - width - right;
          overlay.style.left = `${leftPosition}px`;

          overlay.style.right = `${right}px`;

          overlay.style.width = `${width}px`;
          overlay.style.textAlign = textAlign;
          overlay.style.fontSize = "11pt";
          overlay.style.fontFamily = "inherit";
          overlay.style.color = "rgb(31 41 55)";
          overlay.style.fontWeight = "500";
          overlay.style.zIndex = "1000";
          overlay.style.display = "none";

          overlayContainer.appendChild(overlay);
        };

        createFixedOverlayFromRight(
          "dateIssued",
          formData.dateIssued,
          101,
          85,
          160
        );

        createFixedOverlayFromRight(
          "shortText",
          formData.shortText,
          139,
          80,
          250
        );

        if (formData.category) {
          const printSelectText =
            containerRef.current.querySelector(".printSelectText");
          if (printSelectText) {
            printSelectText.textContent = selectedOptionText || "";

            const printSelectStyle = document.createElement("style");
            printSelectStyle.id = "print-select-style-proposal";
            printSelectStyle.textContent = `
              @media print {
                .printSelectText {
                  display: block !important;
                  visibility: visible !important;
                  opacity: 1 !important;
                  color: rgb(31 41 55) !important;
                  -webkit-text-fill-color: rgb(31 41 55) !important;
                  background: transparent !important;
                  position: absolute !important;
                  top: 264px !important;
                  left: 224px !important;
                  width: 392px !important;
                  text-align: center !important;
                  font-size: 11pt !important;
                  font-weight: 500 !important;
                  z-index: 1001 !important;
                }
              }
            `;
            document.head.appendChild(printSelectStyle);

            window.addEventListener("afterprint", function removeStyle() {
              const styleToRemove = document.getElementById(
                "print-select-style-proposal"
              );
              if (styleToRemove) {
                document.head.removeChild(styleToRemove);
              }
              window.removeEventListener("afterprint", removeStyle);
            });
          }
        }

        createFixedOverlay(
          "beneficiaryName",
          formData.beneficiaryName,
          300,
          224,
          392
        );

        createFixedOverlay(
          "numericValue1",
          formData.numericValue1,
          526,
          577,
          98
        );

        createFixedOverlay(
          "numericValue2",
          formData.numericValue2,
          642,
          523,
          154
        );

        createFixedOverlayFromRight(
          "additionalDate",
          formData.additionalDate,
          752,
          590,
          120
        );

        // New autofill inputs print overlays - matching PaymentOrderForm positions
        createFixedOverlay(
          "autofillInput4",
          formData.autofillInput4,
          520,
          50,
          30
        );
        createFixedOverlay(
          "autofillInput5",
          formData.autofillInput5,
          520,
          70,
          30
        );
        createFixedOverlay(
          "autofillInput6",
          formData.autofillInput6,
          520,
          90,
          30
        );

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
              font-weight: 500 !important;
            }
            
            input, select {
              color: transparent !important;
              -webkit-text-fill-color: transparent !important;
              background-color: transparent !important;
              opacity: 0 !important;
            }
            
            .formContainer {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              transform: none !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .print-overlay-container {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100% !important;
              z-index: 1000 !important;
            }
            
            .print-text-overlay[data-for="category"],
            .print-text-overlay.category-overlay {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
            }
          }
        `;

        window.addEventListener("afterprint", function restoreStyles() {
          containerRef.current.style.transform = originalTransform;
          containerRef.current.style.marginTop = originalMarginTop;
          containerRef.current.style.marginBottom = originalMarginBottom;

          const overlayContainer = containerRef.current.querySelector(
            ".print-overlay-container"
          );
          if (overlayContainer) {
            containerRef.current.removeChild(overlayContainer);
          }

          window.removeEventListener("afterprint", restoreStyles);
        });
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
  }, [formData, selectedOptionText]);

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
          src={ProposalFormImage || "/placeholder.svg"}
          alt="Proposal Form Template"
          className={styles.formImage}
        />
      </div>

      <div className={styles.formOverlay}>
        <DateInput
          name="dateIssued"
          value={formData.dateIssued || ""}
          onChange={handleDateInput}
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
          placeholder="specialitate..."
          style={{
            backgroundColor: formData.shortText ? "transparent" : inputColor,
          }}
          autoComplete="off"
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
          autoComplete="off"
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
          autoComplete="off"
        />

        <DateInput
          name="additionalDate"
          value={formData.additionalDate || ""}
          onChange={handleDateInput}
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
        {/* New Autofill Inputs - Matching PaymentOrderForm positions */}
        <InputNumber
          name="autofillInput4"
          value={formData.autofillInput4 || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.autofillInput}`}
          readOnly // Make it read-only as it's autofilled
          style={{
            top: "519px", // Matching PaymentOrderForm
            left: "50px", // Matching PaymentOrderForm
            width: "20px",
            textAlign: "center",
            backgroundColor: formData.autofillInput4
              ? "transparent"
              : inputColor,
          }}
        />
        <InputNumber
          name="autofillInput5"
          value={formData.autofillInput5 || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.autofillInput}`}
          readOnly // Make it read-only
          style={{
            top: "519px", // Matching PaymentOrderForm
            left: "70px", // Matching PaymentOrderForm
            width: "20px",
            textAlign: "center",
            backgroundColor: formData.autofillInput5
              ? "transparent"
              : inputColor,
          }}
        />
        <InputNumber
          name="autofillInput6"
          value={formData.autofillInput6 || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.autofillInput}`}
          readOnly // Make it read-only
          style={{
            top: "519px", // Matching PaymentOrderForm
            left: "90px", // Matching PaymentOrderForm
            width: "20px",
            textAlign: "center",
            backgroundColor: formData.autofillInput6
              ? "transparent"
              : inputColor,
          }}
        />
      </div>
    </div>
  );
}
