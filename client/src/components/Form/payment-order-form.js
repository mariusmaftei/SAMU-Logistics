"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import styles from "../Form/payment-order-form.module.css";
import { useFormEntries } from "../../context/FormEntriesContext";
import OPimage from "../../assets/images/ordonantare-de-plata.png";
import BeneficiaryDropdown from "../UI/Dropdown/Dropdown";
import SimpleDropdown from "../UI//SimpleDropdown/SimpleDropdown";
import DateInput from "../UI/DateInput/DateInput";
import InputNumber from "../UI/InputNumber/InputNumber";

export default function PaymentOrderForm({ formData, handleInputChange }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [selectedOptionText, setSelectedOptionText] = useState("");

  const { getBeneficiaryByName, formEntries } = useFormEntries();

  const inputColor = "rgba(31, 129, 248, 0.52)";

  const expenseOptions = useMemo(
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

    handleFormInputChange(e);

    // Autofill logic for the three new inputs
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
    if (formData.number) {
      const option = expenseOptions.find(
        (opt) => opt.value === formData.number
      );
      if (option) {
        setSelectedOptionText(option.label);
      }
    } else {
      setSelectedOptionText("");
    }
  }, [formData.number, expenseOptions]);

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

  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const fillDateFieldsOnInput = (name, value, prevValue) => {
    const dateFields = [
      "dateIssued",
      "billDate",
      "departmentDate",
      "accountingDate",
      "financialControlDate",
      "creditOfficerDate",
    ];

    if (
      !dateFields.includes(name) &&
      name !== "beneficiaryName" &&
      !prevValue &&
      value
    ) {
      const currentDate = getCurrentDate();

      dateFields.forEach((field) => {
        if (!formData[field]) {
          handleInputChange({
            target: {
              name: field,
              value: currentDate,
            },
          });
        }
      });
    }
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    const prevValue = formData[name];

    handleInputChange(e);

    fillDateFieldsOnInput(name, value, prevValue);
  };

  const fillFormFields = (beneficiaryName) => {
    if (!beneficiaryName) return;

    const beneficiary = getBeneficiaryByName(beneficiaryName);

    if (beneficiary) {
      const fieldUpdates = [
        {
          name: "Trezorerie_Furnizor",
          value: beneficiary.Trezorerie_Furnizor || "",
        },
        { name: "bankNumber", value: beneficiary.Trezorerie_Furnizor || "" },
        { name: "Adresa_Furnizor", value: beneficiary.Adresa_Furnizor || "" },
        { name: "treasury", value: beneficiary.treasuryNumber || "" },
        { name: "CUI_CUI_CIF", value: beneficiary.CUI_CUI_CIF || "" },
        { name: "NR_CONT_IBAN", value: beneficiary.NR_CONT_IBAN || "" },
      ];

      fieldUpdates.forEach((field) => {
        handleFormInputChange({
          target: {
            name: field.name,
            value: field.value,
          },
        });
      });
    }
  };

  const handleBeneficiaryNameChange = (e) => {
    handleFormInputChange(e);

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

        createFixedOverlayFromRight(
          "dateIssued",
          formData.dateIssued,
          116,
          155,
          150
        );

        // Category dropdown print overlay - positioned exactly where the dropdown is
        if (selectedOptionText) {
          const categoryOverlay = document.createElement("div");
          categoryOverlay.className =
            "print-text-overlay category-print-overlay"; // Add specific class
          categoryOverlay.textContent = selectedOptionText;
          categoryOverlay.dataset.for = "category";

          // Use the exact same positioning as the dropdown container
          categoryOverlay.style.position = "absolute";
          categoryOverlay.style.top = "244px"; // Same as .categoryContainer top
          categoryOverlay.style.left = "284px"; // Same as .categoryContainer left
          categoryOverlay.style.width = "350px"; // Same as .categoryContainer width
          categoryOverlay.style.textAlign = "center";
          categoryOverlay.style.fontSize = "11pt";
          categoryOverlay.style.fontFamily = "inherit";
          categoryOverlay.style.color = "rgb(31 41 55)";
          categoryOverlay.style.fontWeight = "500";
          categoryOverlay.style.zIndex = "1001"; // Higher z-index to ensure visibility
          categoryOverlay.style.display = "none"; // Initially hidden, made visible by CSS
          categoryOverlay.style.lineHeight = "1";
          categoryOverlay.style.paddingTop = "2px"; // Match the printSelectText padding

          overlayContainer.appendChild(categoryOverlay);
        }

        createFixedOverlay(
          "expenseNature",
          formData.expenseNature,
          299,
          325,
          200
        );

        createFixedOverlay(
          "additionalInput1",
          formData.additionalInput1,
          299,
          435,
          200
        );
        createFixedOverlay(
          "additionalInput2",
          formData.additionalInput2,
          317,
          170,
          200
        );
        createFixedOverlay(
          "additionalInput3",
          formData.additionalInput3,
          317,
          276,
          200
        );
        createFixedOverlay(
          "additionalInput4",
          formData.additionalInput4,
          317,
          382,
          200
        );

        // New autofill inputs print overlays - NOW ON LEFT SIDE
        createFixedOverlay(
          "autofillInput4",
          formData.autofillInput4,
          582,
          190,
          30
        );
        createFixedOverlay(
          "autofillInput5",
          formData.autofillInput5,
          582,
          210,
          30
        );
        createFixedOverlay(
          "autofillInput6",
          formData.autofillInput6,
          582,
          230,
          30
        );

        createFixedOverlayFromRight(
          "billDate",
          formData.billDate,
          317,
          132,
          140
        );

        createFixedOverlayFromRight("amount", formData.amount, 414, 210, 122);

        createFixedOverlayFromRight(
          "amountDue",
          formData.amount,
          582,
          267,
          122
        );

        createFixedOverlayFromRight(
          "bankNumber",
          formData.bankNumber,
          698,
          90,
          184,
          "left"
        );

        createFixedOverlayFromRight(
          "CUI_CUI_CIF",
          formData.CUI_CUI_CIF,
          726,
          90,
          170,
          "left"
        );

        createFixedOverlayFromRight(
          "NR_CONT_IBAN",
          formData.NR_CONT_IBAN,
          750,
          90,
          207,
          "left"
        );

        createFixedOverlay(
          "beneficiaryName",
          formData.beneficiaryName,
          725,
          160,
          226
        );
        if (formData.Adresa_Furnizor) {
          const addressOverlay = document.createElement("div");
          addressOverlay.className = "print-text-overlay address-multiline";
          addressOverlay.textContent = formData.Adresa_Furnizor;
          addressOverlay.dataset.for = "Adresa_Furnizor";

          addressOverlay.style.position = "absolute";
          addressOverlay.style.top = "748px";
          addressOverlay.style.left = "160px";
          addressOverlay.style.width = "226px";
          addressOverlay.style.minHeight = "40px";
          addressOverlay.style.maxHeight = "50px";
          addressOverlay.style.textAlign = "center";
          addressOverlay.style.fontSize = "11pt";
          addressOverlay.style.fontFamily = "inherit";
          addressOverlay.style.color = "rgb(31 41 55)";
          addressOverlay.style.fontWeight = "500";
          addressOverlay.style.zIndex = "1000";
          addressOverlay.style.display = "none";
          addressOverlay.style.whiteSpace = "normal";
          addressOverlay.style.wordBreak = "break-word";
          addressOverlay.style.lineHeight = "1.2";
          addressOverlay.style.overflow = "hidden";

          overlayContainer.appendChild(addressOverlay);
        }

        if (formData.bottomDate1) {
          const bottomDate1Overlay = document.createElement("div");
          bottomDate1Overlay.className = "print-text-overlay";
          bottomDate1Overlay.textContent = formData.bottomDate1;
          bottomDate1Overlay.dataset.for = "bottomDate1";
          bottomDate1Overlay.style.position = "absolute";
          bottomDate1Overlay.style.bottom = "285px";
          bottomDate1Overlay.style.left = "180px";
          bottomDate1Overlay.style.width = "120px";
          bottomDate1Overlay.style.textAlign = "center";
          bottomDate1Overlay.style.fontSize = "10pt";
          bottomDate1Overlay.style.fontFamily = "inherit";
          bottomDate1Overlay.style.color = "rgb(31 41 55)";
          bottomDate1Overlay.style.fontWeight = "500";
          bottomDate1Overlay.style.zIndex = "1001";
          bottomDate1Overlay.style.display = "none";
          overlayContainer.appendChild(bottomDate1Overlay);
        }

        if (formData.bottomDate2) {
          const bottomDate2Overlay = document.createElement("div");
          bottomDate2Overlay.className = "print-text-overlay";
          bottomDate2Overlay.textContent = formData.bottomDate2;
          bottomDate2Overlay.dataset.for = "bottomDate2";
          bottomDate2Overlay.style.position = "absolute";
          bottomDate2Overlay.style.bottom = "285px";
          bottomDate2Overlay.style.left = "300px";
          bottomDate2Overlay.style.width = "120px";
          bottomDate2Overlay.style.textAlign = "center";
          bottomDate2Overlay.style.fontSize = "11pt";
          bottomDate2Overlay.style.fontFamily = "inherit";
          bottomDate2Overlay.style.color = "rgb(31 41 55)";
          bottomDate2Overlay.style.fontWeight = "500";
          bottomDate2Overlay.style.zIndex = "1001";
          bottomDate2Overlay.style.display = "none";
          overlayContainer.appendChild(bottomDate2Overlay);
        }

        let styleTag = document.getElementById("print-overlay-styles");
        if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = "print-overlay-styles";
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
    visibility: visible !important; /* Ensure visibility */
  }
  
  /* Special styles for bottom date overlays */
  .print-text-overlay.bottom-date-overlay {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    z-index: 1001 !important;
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
  
  /* Make the printSelectText visible during print with correct positioning */
  .printSelectText {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    color: rgb(31 41 55) !important;
    -webkit-text-fill-color: rgb(31 41 55) !important;
    background: transparent !important;
    position: absolute !important;
    top: 244px !important;
    left: 284px !important;
    width: 350px !important;
    text-align: center !important;
    font-size: 11pt !important;
    font-weight: 500 !important;
    z-index: 1001 !important;
  }

  .print-text-overlay.address-multiline {
    display: block !important;
    white-space: normal !important;
    word-break: break-word !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    line-height: 1.2 !important;
    text-align: center !important;
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
      const styleTag = document.getElementById("print-overlay-styles");
      if (styleTag) {
        styleTag.remove();
      }
    };
  }, [formData, selectedOptionText]); // Added selectedOptionText to dependencies

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

    // Clean up
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
          containerRef.current.style.marginBottom = `-${marginAdjustment}mm`;
        } else {
          containerRef.current.classList.remove(styles.mobileView);
          containerRef.current.style.transform = "";
          containerRef.current.style.marginTop = "";
          containerRef.current.style.marginBottom = "";
        }
      }
    };

    // Run on mount and when window resizes
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const beneficiariesForDropdown = formEntries.map((entry) => ({
    id: entry.id || String(Math.random()),
    Nume_Furnizor: entry.Nume_Furnizor,
  }));

  const additionalInputPositions = [
    {
      name: "expenseNature",
      top: 297,
      left: 360,
      className: styles.billNumber,
      placeholder: "ex. 00648763",
    },
    {
      name: "additionalInput1",
      top: 297,
      left: 470,
      className: styles.additionalInput2,
      placeholder: "optional",
      inputColor: "rgba(189, 200, 204, 0.5)",
    },
    {
      name: "additionalInput2",
      top: 315,
      left: 220,
      className: styles.additionalInput3,
      placeholder: "optional",
      inputColor: "rgba(189, 200, 204, 0.5)",
    },
    {
      name: "additionalInput3",
      top: 315,
      left: 330,
      className: styles.additionalInput3,
      placeholder: "optional",
      inputColor: "rgba(189, 200, 204, 0.5)",
    },
    {
      name: "additionalInput4",
      top: 315,
      left: 440,
      className: styles.additionalInput4,
      placeholder: "optional",
      inputColor: "rgba(189, 200, 204, 0.5)",
    },
  ];

  return (
    <div className={styles.formContainer} ref={containerRef}>
      <div className={styles.imageWrapper}>
        <img
          ref={imageRef}
          src={OPimage || "/placeholder.svg"}
          alt="Payment Order Form Template"
          className={styles.formImage}
        />
      </div>

      <div className={styles.formOverlay}>
        <DateInput
          name="dateIssued"
          value={formData.dateIssued || ""}
          onChange={handleDateInput}
          className={`${styles.inputField} ${styles.fromEmittingDate}`}
          inputColor={inputColor}
          placeholder="DD.MM.YYYY"
        />

        {/* New Category Dropdown */}
        <div
          className={`${styles.expensesNatureContainer} ${
            !formData.number ? styles.empty : ""
          }`}
        >
          <SimpleDropdown
            name="number"
            value={formData.number || ""}
            onChange={(e) => {
              handleSelectChange(e);
              fillDateFieldsOnInput(
                e.target.name,
                e.target.value,
                formData[e.target.name]
              );
            }}
            options={expenseOptions}
            className={`${styles.expensesNature}`}
            style={{
              backgroundColor: formData.number
                ? "transparent"
                : `${inputColor}`,
            }}
            autoComplete="off"
          />

          <span className={styles.printSelectText}>
            {selectedOptionText || "Selectați opțiunea"}
          </span>
        </div>

        {additionalInputPositions.map((position) => (
          <InputNumber
            key={position.name}
            name={position.name}
            value={formData[position.name] || ""}
            onChange={handleFormInputChange}
            className={position.className}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: "calc(100% - 690px)",
              height: "17px",
            }}
            inputColor={position.inputColor}
            placeholder={position.placeholder}
            fillDateFieldsOnInput={fillDateFieldsOnInput}
          />
        ))}

        <InputNumber
          name="amount"
          value={formData.amount || ""}
          onChange={handleFormInputChange}
          className={styles.amount}
          style={{
            top: "410px",
            right: "210px",
            width: "122px",
            textAlign: "center",
          }}
          inputColor={inputColor}
          fillDateFieldsOnInput={fillDateFieldsOnInput}
        />

        <InputNumber
          name="amountDue"
          value={formData.amount || ""}
          onChange={(e) => {
            handleInputChange({
              target: {
                name: "amount",
                value: e.target.value,
              },
            });
            fillDateFieldsOnInput("amount", e.target.value, formData.amount);
          }}
          className={styles.amountToPlay}
          style={{
            top: "578px",
            right: "267px",
            width: "122px",
            textAlign: "center",
          }}
          inputColor={inputColor}
        />

        {/* New Autofill Inputs - NOW ON LEFT SIDE */}
        <InputNumber
          name="autofillInput4"
          value={formData.autofillInput4 || ""}
          onChange={handleInputChange}
          className={`${styles.inputField} ${styles.autofillInput}`}
          readOnly // Make it read-only as it's autofilled
          style={{
            top: "578px",
            left: "190px", // Changed from right
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
            top: "578px",
            left: "210px", // Changed from right
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
            top: "578px",
            left: "230px", // Changed from right
            width: "20px",
            textAlign: "center",
            backgroundColor: formData.autofillInput6
              ? "transparent"
              : inputColor,
          }}
        />

        <DateInput
          name="billDate"
          value={formData.billDate || ""}
          onChange={handleDateInput}
          className={`${styles.inputField} ${styles.billDateField}`}
          inputColor={inputColor}
          placeholder="DD.MM.YYYY"
        />

        <input
          type="text"
          name="bankNumber"
          value={formData.bankNumber || ""}
          onChange={(e) => {
            handleInputChange(e);
            fillDateFieldsOnInput(
              e.target.name,
              e.target.value,
              formData[e.target.name]
            );
          }}
          className={`${styles.inputField} ${styles.bankNumber}`}
          style={{
            backgroundColor: formData.bankNumber
              ? "transparent"
              : `${inputColor}`,
          }}
          autoComplete="off"
        />

        <input
          type="text"
          name="CUI_CUI_CIF"
          value={formData.CUI_CUI_CIF || ""}
          onChange={(e) => {
            handleInputChange(e);
            fillDateFieldsOnInput(
              e.target.name,
              e.target.value,
              formData[e.target.name]
            );
          }}
          className={`${styles.inputField} ${styles.treasuryNumber}`}
          style={{
            backgroundColor: formData.CUI_CUI_CIF
              ? "transparent"
              : `${inputColor}`,
          }}
          autoComplete="off"
        />

        <input
          type="text"
          name="NR_CONT_IBAN"
          value={formData.NR_CONT_IBAN || ""}
          onChange={(e) => {
            handleInputChange(e);
            fillDateFieldsOnInput(
              e.target.name,
              e.target.value,
              formData[e.target.name]
            );
          }}
          className={`${styles.inputField} ${styles.bankCodeField}`}
          style={{
            backgroundColor: formData.NR_CONT_IBAN
              ? "transparent"
              : `${inputColor}`,
          }}
          autoComplete="off"
        />

        <BeneficiaryDropdown
          name="beneficiaryName"
          value={formData.beneficiaryName || ""}
          onChange={handleBeneficiaryNameChange}
          onPaste={handlePaste}
          className={`${styles.inputField} ${styles.beneficiaryName}`}
          style={{
            top: "721px",
            left: "160px",
            width: "226px",
            textAlign: "center",
            height: "auto",
          }}
          beneficiaries={beneficiariesForDropdown}
        />

        <input
          type="text"
          name="Adresa_Furnizor"
          value={formData.Adresa_Furnizor || ""}
          onChange={(e) => {
            handleInputChange(e);
            fillDateFieldsOnInput(
              e.target.name,
              e.target.value,
              formData[e.target.name]
            );
          }}
          className={`${styles.inputField} ${styles.beneficiaryAddress}`}
          style={{
            backgroundColor: formData.Adresa_Furnizor
              ? "transparent"
              : `${inputColor}`,
          }}
          autoComplete="off"
        />
        <DateInput
          name="bottomDate1"
          value={formData.bottomDate1 || ""}
          onChange={handleDateInput}
          className={`${styles.inputField} ${styles.dateSignatureField}`}
          inputColor="rgba(189, 200, 204, 0.5)"
          placeholder="DD.MM.YYYY"
          style={{
            position: "absolute",
            bottom: "285px",
            left: "200px",
            width: "75px",
            height: "15px",
            textAlign: "center",
          }}
        />

        <DateInput
          name="bottomDate2"
          value={formData.bottomDate2 || ""}
          onChange={handleDateInput}
          className={`${styles.inputField} ${styles.dateSignatureField}`}
          inputColor="rgba(189, 200, 204, 0.5)"
          placeholder="DD.MM.YYYY"
          style={{
            position: "absolute",
            bottom: "285px",
            left: "325px",
            width: "75px",
            height: "15px",
            textAlign: "center",
          }}
        />
      </div>
    </div>
  );
}
