import { useRef, useEffect, useState } from "react";
import styles from "../Form/payment-order-form.module.css";
import { useFormEntries } from "../../context/FormEntriesContext";
import OPimage from "../../assets/images/ordonantare-de-plata.png";
import BeneficiaryDropdown from "../UI/Dropdown/Dropdown";
import SimpleDropdown from "../UI//SimpleDropdown/SimpleDropdown";
import DateInput from "../UI/DateInput/DateInput";

export default function PaymentOrderForm({ formData, handleInputChange }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [selectedOptionText, setSelectedOptionText] = useState("");

  const { getBeneficiaryByName, formEntries } = useFormEntries();

  const inputColor = "rgba(31, 129, 248, 0.52)";

  // Expense nature options for the dropdown
  const expenseOptions = [
    { value: "MEDICAMENTATIE", label: "MEDICAMENTE" },
    { value: "MATERIALE SANITARE", label: "MATERIALE SANITARE" },
  ];

  // Handle numeric input for expense nature, legal commitment, and amount due
  const handleNumericInput = (e) => {
    const { value } = e.target;
    // Allow only numbers and decimal point
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
      e.preventDefault();
      return;
    }
    handleFormInputChange(e);
  };

  // Custom handler for select to capture the displayed text
  const handleSelectChange = (e) => {
    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    setSelectedOptionText(selectedOption ? selectedOption.text : "");

    // Update the background color immediately
    if (selectedOption && selectedOption.value) {
      select.style.backgroundColor = "transparent";
    } else {
      select.style.backgroundColor = "rgba(191, 219, 254, 0.3)";
    }

    handleFormInputChange(e);
  };

  // Update selected option text when formData.number changes
  useEffect(() => {
    if (formData.number) {
      // Find the option text that corresponds to the current value
      const option = expenseOptions.find(
        (opt) => opt.value === formData.number
      );
      if (option) {
        setSelectedOptionText(option.label);
      }
    } else {
      setSelectedOptionText("");
    }
  }, [formData.number]);

  // Custom handler for date inputs to format as DD.MM.YYYY
  const handleDateInput = (e) => {
    const { name, value } = e.target;
    let formattedValue = value.replace(/\./g, ""); // Remove any existing dots

    // Only allow numbers
    if (!/^\d*$/.test(formattedValue)) {
      return;
    }

    // Format with dots
    if (formattedValue.length > 0) {
      // Add first dot after day (DD)
      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.slice(0, 2) + "." + formattedValue.slice(2);
      }

      // Add second dot after month (MM)
      if (formattedValue.length > 5) {
        formattedValue =
          formattedValue.slice(0, 5) + "." + formattedValue.slice(5);
      }

      // Limit to 10 characters (DD.MM.YYYY)
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }
    }

    // Create a synthetic event to pass to the original handler
    const syntheticEvent = {
      target: {
        name,
        value: formattedValue,
      },
    };

    handleFormInputChange(syntheticEvent);
  };

  // Function to get current date in DD.MM.YYYY format
  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Function to fill date fields with current date when any input is filled
  const fillDateFieldsOnInput = (name, value, prevValue) => {
    // Only proceed if:
    // 1. The field being changed is not already a date field
    // 2. The field is going from empty to having a value
    // 3. The field name is not beneficiaryName (which has its own special handling)
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
      // Get current date
      const currentDate = getCurrentDate();

      // Fill all date fields with current date
      dateFields.forEach((field) => {
        // Only fill date fields that are currently empty
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

  // Modify the handleInputChange function to use our new function
  // Replace the existing handleInputChange references with this custom handler
  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    const prevValue = formData[name];

    // First update the form data
    handleInputChange(e);

    // Then check if we should fill date fields
    fillDateFieldsOnInput(name, value, prevValue);
  };

  // Function to fill form fields based on beneficiary data
  const fillFormFields = (beneficiaryName) => {
    if (!beneficiaryName) return;

    const beneficiary = getBeneficiaryByName(beneficiaryName);

    if (beneficiary) {
      // Create an array of field updates with correct mappings
      const fieldUpdates = [
        // Map accountNumber from context to both accountNumber and bankNumber inputs
        {
          name: "Trezorerie_Furnizor",
          value: beneficiary.Trezorerie_Furnizor || "",
        },
        { name: "bankNumber", value: beneficiary.Trezorerie_Furnizor || "" },
        { name: "Adresa_Furnizor", value: beneficiary.Adresa_Furnizor || "" },
        // Map treasuryNumber from context to both treasury and treasuryNumber inputs
        { name: "treasury", value: beneficiary.treasuryNumber || "" },
        { name: "CUI_CUI_CIF", value: beneficiary.CUI_CUI_CIF || "" },
        { name: "NR_CONT_IBAN", value: beneficiary.NR_CONT_IBAN || "" },
      ];

      // Apply each field update one by one
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

  // Handle beneficiary name change
  const handleBeneficiaryNameChange = (e) => {
    // First update the form data with the new name
    handleFormInputChange(e);

    // Then check if we should fill other fields
    const beneficiaryName = e.target.value;

    // Only attempt to fill fields if we have a complete name (with space)
    if (beneficiaryName && beneficiaryName.includes(" ")) {
      fillFormFields(beneficiaryName);
    }
  };

  // Handle paste event for beneficiary name
  const handlePaste = (e) => {
    // Allow the paste to complete
    setTimeout(() => {
      const pastedName = e.target.value;

      // If we have a valid name, fill the form fields
      if (pastedName && pastedName.trim() !== "") {
        fillFormFields(pastedName);
      }
    }, 10);
  };

  // Add a custom print renderer for input values
  useEffect(() => {
    const handleBeforePrint = () => {
      if (containerRef.current) {
        // First, remove any existing print overlays to avoid duplication
        const existingOverlays = document.querySelectorAll(
          ".print-text-overlay"
        );
        existingOverlays.forEach((overlay) => overlay.remove());

        // Create print overlays for each input to ensure exact positioning
        const inputs = containerRef.current.querySelectorAll("input");

        // Create new overlays for each input
        inputs.forEach((input) => {
          if (input.value) {
            const rect = input.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            // Calculate position relative to the container
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
            overlay.style.display = "none"; // Only show during printing

            // Add a data attribute to identify which input this overlay belongs to
            overlay.dataset.for = input.name;

            containerRef.current.appendChild(overlay);
          }
        });

        // Handle the dropdown separately
        if (formData.number) {
          const selectContainer = containerRef.current.querySelector(
            `.${styles.expensesNatureContainer}`
          );
          if (selectContainer) {
            const rect = selectContainer.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            // Calculate position relative to the container
            const top = rect.top - containerRect.top;
            const left = rect.left - containerRect.left;

            // Make sure the printSelectText is properly positioned for printing
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
            }
          }
        }

        // Handle beneficiary dropdown for printing
        if (formData.beneficiaryName) {
          const beneficiaryInput = containerRef.current.querySelector(
            `[name="beneficiaryName"]`
          );
          if (beneficiaryInput) {
            const rect = beneficiaryInput.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            // Calculate position relative to the container
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
            overlay.style.display = "none"; // Only show during printing

            overlay.dataset.for = "beneficiaryName";
            containerRef.current.appendChild(overlay);
          }
        }

        // Add a style tag for print media
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
            }
            .formContainer {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100% !important;
            }
            .beneficiary-dropdown-container {
              background-color: transparent !important;
            }
            .beneficiary-dropdown-container button,
            .beneficiary-dropdown-container .dropdown-menu {
              display: none !important;
            }
          }
        `;
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
  }, [formData]);

  // Add a global style to override browser autofill styles
  useEffect(() => {
    // Create a style element to override autofill styles
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

  // Add useEffect to detect mobile devices and adjust the view
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Check if we're on a mobile device
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
          // On mobile, adjust the container to be scrollable
          containerRef.current.classList.add(styles.mobileView);

          // Calculate the appropriate scale based on screen width
          const scale = Math.max(0.25, Math.min(0.6, window.innerWidth / 800));

          // Apply the scale directly to maintain input field positions
          containerRef.current.style.transform = `scale(${scale})`;

          // Adjust margins to compensate for scaling
          const marginAdjustment = ((1 - scale) * 297) / 2;
          containerRef.current.style.marginTop = `-${marginAdjustment}mm`;
          containerRef.current.style.marginBottom = `-${marginAdjustment}mm`;
        } else {
          // On desktop, remove mobile-specific adjustments
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

  // Format beneficiaries data for the dropdown
  const beneficiariesForDropdown = formEntries.map((entry) => ({
    id: entry.id || String(Math.random()),
    Nume_Furnizor: entry.Nume_Furnizor,
  }));

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
        />

        {/* Number field as dropdown with visible text for printing */}
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

          {/* This span will be visible all the time */}
          <span className={styles.printSelectText}>
            {selectedOptionText || "Selectați opțiunea"}
          </span>
        </div>

        <input
          type="text"
          name="expenseNature"
          value={formData.expenseNature || ""}
          onChange={(e) => {
            handleNumericInput(e);
            fillDateFieldsOnInput(
              e.target.name,
              e.target.value,
              formData[e.target.name]
            );
          }}
          className={`${styles.inputField} ${styles.billNumber}`}
          style={{
            backgroundColor: formData.expenseNature
              ? "transparent"
              : `${inputColor}`,
          }}
          inputMode="decimal"
          autoComplete="off"
        />

        <DateInput
          name="billDate"
          value={formData.billDate || ""}
          onChange={handleDateInput}
          className={`${styles.inputField} ${styles.billDateField}`}
          inputColor={inputColor}
        />

        <input
          type="text"
          name="amount"
          value={formData.amount || ""}
          onChange={(e) => {
            handleNumericInput(e);
            fillDateFieldsOnInput(
              e.target.name,
              e.target.value,
              formData[e.target.name]
            );
          }}
          className={`${styles.inputField} ${styles.amount}`}
          style={{
            backgroundColor: formData.amount ? "transparent" : `${inputColor}`,
          }}
          inputMode="decimal"
          placeholder="0.00"
          autoComplete="off"
        />

        <input
          type="text"
          name="amountDue"
          value={formData.amount || ""}
          onChange={(e) => {
            // Update both amount and amountDue with the same value
            handleInputChange({
              target: {
                name: "amount",
                value: e.target.value,
              },
            });
            fillDateFieldsOnInput("amount", e.target.value, formData.amount);
          }}
          className={`${styles.inputField} ${styles.amountToPlay}`}
          style={{
            backgroundColor: formData.amount ? "transparent" : `${inputColor}`,
          }}
          inputMode="decimal"
          placeholder="0.00"
          autoComplete="off"
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

        {/* Replace the beneficiary name input with the dropdown component */}
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
      </div>
    </div>
  );
}
