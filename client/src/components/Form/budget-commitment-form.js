import { useState, useMemo, useRef, useEffect } from "react";
import styles from "../Form/budget-commitment-form.module.css";
import ABIimage from "../../assets/images/angajament-bugetar-individual.jpg";
import DateInput from "../UI/DateInput/DateInput";
import { useFormEntries } from "../../context/FormEntriesContext";
import SimpleDropdown from "../UI/SimpleDropdown/SimpleDropdown";
import BeneficiaryDropdown from "../UI/Dropdown/Dropdown";

export default function BudgetCommitmentForm({
  formData,
  handleInputChange,
  handleDateKeyDown,
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const inputColor = "rgba(31, 129, 248, 0.52)";
  const { formEntries, getBeneficiaryByName } = useFormEntries();
  const [selectedCategoryText, setSelectedCategoryText] = useState("");

  const categoryOptions = useMemo(
    () => [
      { value: "MEDICAMENTATIE", label: "MEDICAMENTE" },
      { value: "MATERIALE SANITARE", label: "MATERIALE SANITARE" },
    ],
    []
  );

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

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    const prevValue = formData[name];

    handleInputChange(e);

    fillAutoFields(name, value, prevValue);
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    handleFormInputChange(e); // Update the form data state

    // Update selected text for print overlay
    const selectedOption = categoryOptions.find((opt) => opt.value === value);
    setSelectedCategoryText(selectedOption ? selectedOption.label : "");

    // Autofill logic for the three new inputs
    if (value === "MEDICAMENTATIE") {
      handleInputChange({ target: { name: "autofillInput1", value: "20." } });
      handleInputChange({ target: { name: "autofillInput2", value: "04." } });
      handleInputChange({ target: { name: "autofillInput3", value: "01" } });
    } else if (value === "MATERIALE SANITARE") {
      handleInputChange({ target: { name: "autofillInput1", value: "20." } });
      handleInputChange({ target: { name: "autofillInput2", value: "04." } });
      handleInputChange({ target: { name: "autofillInput3", value: "02" } });
    } else {
      // Clear if no specific option selected
      handleInputChange({ target: { name: "autofillInput1", value: "" } });
      handleInputChange({ target: { name: "autofillInput2", value: "" } });
      handleInputChange({ target: { name: "autofillInput3", value: "" } });
    }
  };

  const beneficiariesForDropdown = formEntries.map((entry) => ({
    id: entry.id || String(Math.random()),
    Nume_Furnizor: entry.Nume_Furnizor,
  }));

  useEffect(() => {
    // Update selected category text on initial load or form data change
    if (formData.category) {
      const option = categoryOptions.find(
        (opt) => opt.value === formData.category
      );
      if (option) {
        setSelectedCategoryText(option.label);
      }
    } else {
      setSelectedCategoryText("");
    }
  }, [formData.category, categoryOptions]);

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
          overlay.style.display = "none"; // Initially hidden, made visible by CSS

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
          overlay.style.display = "none"; // Initially hidden, made visible by CSS

          overlayContainer.appendChild(overlay);
        };

        createFixedOverlay("dateIssued", formData.dateIssued, 108, 520, 160);

        createFixedOverlay("shortText", formData.shortText, 146, 430, 240);

        // Category dropdown print overlay - using its actual position
        if (selectedCategoryText) {
          createFixedOverlay(
            "category",
            selectedCategoryText,
            200, // top from CSS
            247, // left from CSS
            300 // width from CSS
          );
        }

        // Autofill inputs print overlays - using their actual positions from CSS
        createFixedOverlay(
          "autofillInput1",
          formData.autofillInput1,
          385, // top from CSS
          248, // left from CSS (248 - 10)
          20 // width from CSS
        );
        createFixedOverlay(
          "autofillInput2",
          formData.autofillInput2,
          385, // top from CSS
          293, // left from CSS (295 - 10)
          20 // width from CSS
        );
        createFixedOverlay(
          "autofillInput3",
          formData.autofillInput3,
          385, // top from CSS
          340, // left from CSS (345 - 10)
          20 // width from CSS
        );

        createFixedOverlay(
          "beneficiaryName",
          formData.beneficiaryName,
          280,
          224,
          390
        );

        createFixedOverlay(
          "numericValue1",
          formData.numericValue1,
          392,
          428,
          195
        );

        createFixedOverlay(
          "numericValue2",
          formData.numericValue2,
          565,
          428,
          195
        );

        createFixedOverlayFromRight(
          "additionalDate",
          formData.additionalDate,
          635,
          200,
          100
        );

        let styleTag = document.getElementById("print-overlay-styles-budget");
        if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = "print-overlay-styles-budget";
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
              color: rgb(31 41 55) !important; /* Ensure text color is visible */
              -webkit-text-fill-color: rgb(31 41 55) !important;
              opacity: 1 !important; /* Ensure visibility */
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

            /* Hide the original printSelectText span, as the overlay div replaces it */
            .printSelectText {
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
      const styleTag = document.getElementById("print-overlay-styles-budget");
      if (styleTag) {
        styleTag.remove();
      }
    };
  }, [formData, selectedCategoryText]); // Add selectedCategoryText to dependencies

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
          src={ABIimage || "/placeholder.svg"}
          alt="Budget Commitment Form Template"
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
          placeholder="specialitate.."
          style={{
            backgroundColor: formData.shortText ? "transparent" : inputColor,
          }}
          autoComplete="off"
        />

        {/* New Category Dropdown */}
        <div
          className={`${styles.categoryContainer} ${
            !formData.category ? styles.empty : ""
          }`}
        >
          <SimpleDropdown
            name="category"
            value={formData.category || ""}
            onChange={handleCategoryChange} // Use the new handler
            options={categoryOptions}
            className={`${styles.inputField} ${styles.categoryDropdown}`}
            style={{
              backgroundColor: formData.category ? "transparent" : inputColor,
              color: "transparent", // Hide actual select text
            }}
            placeholder="Selectați categoria"
          />
          {/* Overlay for print and display of selected text */}
          <span className={styles.printSelectText}>
            {selectedCategoryText || "Selectați categoria"}
          </span>
        </div>

        {/* New Autofill Inputs */}
        <input
          type="text"
          name="autofillInput1"
          value={formData.autofillInput1 || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.autofillInput1}`}
          readOnly // Make it read-only as it's autofilled
          style={{
            top: "385px",
            left: "248px", // Moved 10px left
            width: "20px",
            textAlign: "center",
            backgroundColor: formData.autofillInput1
              ? "transparent"
              : inputColor,
          }}
        />
        <input
          type="text"
          name="autofillInput2"
          value={formData.autofillInput2 || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.autofillInput2}`}
          readOnly // Make it read-only
          style={{
            top: "385px",
            left: "293px", // Moved 10px left
            width: "20px",
            textAlign: "center",
            backgroundColor: formData.autofillInput2
              ? "transparent"
              : inputColor,
          }}
        />
        <input
          type="text"
          name="autofillInput3"
          value={formData.autofillInput3 || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.autofillInput3}`}
          readOnly // Make it read-only
          style={{
            top: "385px",
            left: "340px", // Moved 10px left
            width: "20px",
            textAlign: "center",
            backgroundColor: formData.autofillInput3
              ? "transparent"
              : inputColor,
          }}
        />

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
            top: "280px",
            right: "157px",
            width: "390px",
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
          onChange={handleFormInputChange}
          onKeyDown={handleDateKeyDown}
          className={`${styles.inputField} ${styles.additionalDateField}`}
          placeholder="DD/MM/YYYY"
          inputColor={inputColor}
        />
      </div>
    </div>
  );
}
