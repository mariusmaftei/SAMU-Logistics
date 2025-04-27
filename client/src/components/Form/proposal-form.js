import { useRef, useState, useEffect } from "react";
import styles from "./proposal-form.module.css";
import ProposalFormImage from "../../assets/images/propunere-de-angajare.jpg";
import DateInput from "../UI/DateInput/DateInput";
import SimpleDropdown from "../UI/SimpleDropdown/SimpleDropdown";
import BeneficiaryDropdown from "../UI/Dropdown/Dropdown";
import { useFormEntries } from "../../context/FormEntriesContext";

export default function ProposalForm({ formData, handleInputChange, handleDateKeyDown }) {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const inputColor = "rgba(31, 129, 248, 0.52)"
  const [selectedOptionText, setSelectedOptionText] = useState("")
  const { formEntries, getBeneficiaryByName } = useFormEntries()

  const categoryOptions = [
    { value: "MEDICAMENTATIE", label: "MEDICAMENTE" },
    { value: "MATERIALE SANITARE", label: "MATERIALE SANITARE" },
  ]

  const handleSelectChange = (e) => {
    const select = e.target
    const selectedOption = select.options[select.selectedIndex]
    setSelectedOptionText(selectedOption ? selectedOption.text : "")

    if (selectedOption && selectedOption.value) {
      select.style.backgroundColor = "transparent"
    } else {
      select.style.backgroundColor = "rgba(191, 219, 254, 0.3)"
    }

    handleInputChange(e)
  }

  useEffect(() => {
    if (formData.category) {
      const option = categoryOptions.find((opt) => opt.value === formData.category)
      if (option) {
        setSelectedOptionText(option.label)
      }
    } else {
      setSelectedOptionText("")
    }
  }, [formData.category, categoryOptions])

  const fillFormFields = (beneficiaryName) => {
    if (!beneficiaryName) return

    const beneficiary = getBeneficiaryByName(beneficiaryName)

    if (beneficiary) {
      const fieldUpdates = [
        {
          name: "beneficiaryAddress",
          value: beneficiary.Adresa_Furnizor || "",
        },
        { name: "treasuryNumber", value: beneficiary.CUI_CUI_CIF || "" },
        { name: "accountNumber", value: beneficiary.NR_CONT_IBAN || "" },
      ]

      fieldUpdates.forEach((field) => {
        handleInputChange({
          target: {
            name: field.name,
            value: field.value,
          },
        })
      })
    }
  }

  const handleBeneficiaryNameChange = (e) => {
    handleInputChange(e)

    const beneficiaryName = e.target.value

    if (beneficiaryName && beneficiaryName.includes(" ")) {
      fillFormFields(beneficiaryName)
    }
  }

  const handlePaste = (e) => {
    setTimeout(() => {
      const pastedName = e.target.value

      if (pastedName && pastedName.trim() !== "") {
        fillFormFields(pastedName)
      }
    }, 10)
  }

  const fillAutoFields = (name, value, prevValue) => {
    if (!prevValue && value) {
      const now = new Date()
      const day = String(now.getDate()).padStart(2, "0")
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const year = now.getFullYear()
      const currentDate = `${day}.${month}.${year}`

      // Auto-fill date if it's empty
      if (!formData.dateIssued) {
        handleInputChange({
          target: {
            name: "dateIssued",
            value: currentDate,
          },
        })
      }

      // Auto-fill shortText with "SAMU" if it's empty
      if (!formData.shortText) {
        handleInputChange({
          target: {
            name: "shortText",
            value: "SAMU",
          },
        })
      }

      // Auto-fill additionalDate with current date if it's empty
      if (!formData.additionalDate) {
        handleInputChange({
          target: {
            name: "additionalDate",
            value: currentDate,
          },
        })
      }
    }
  }

  const handleFormInputChange = (e) => {
    const { name, value } = e.target
    const prevValue = formData[name]

    handleInputChange(e)

    fillAutoFields(name, value, prevValue)
  }

  const beneficiariesForDropdown = formEntries.map((entry) => ({
    id: entry.id || String(Math.random()),
    Nume_Furnizor: entry.Nume_Furnizor,
  }))

  useEffect(() => {
    const handleBeforePrint = () => {
      if (containerRef.current) {
        // Store original styles to restore later
        const originalTransform = containerRef.current.style.transform
        const originalMarginTop = containerRef.current.style.marginTop
        const originalMarginBottom = containerRef.current.style.marginBottom

        // Force the form to be at 100% zoom for printing
        containerRef.current.style.transform = "none"
        containerRef.current.style.margin = "0"

        // Remove any existing overlays
        const existingOverlays = document.querySelectorAll(".print-text-overlay")
        existingOverlays.forEach((overlay) => overlay.remove())

        // Create a print overlay container
        const overlayContainer = document.createElement("div")
        overlayContainer.className = "print-overlay-container"
        containerRef.current.appendChild(overlayContainer)

        // Create fixed-position overlays for each input field
        // These positions are based on the original form layout, not the current DOM
        const createFixedOverlay = (name, value, top, left, width, textAlign = "center") => {
          if (!value) return

          const overlay = document.createElement("div")
          overlay.className = "print-text-overlay"
          overlay.textContent = value
          overlay.dataset.for = name

          // Use fixed positioning based on the form design
          overlay.style.position = "absolute"
          overlay.style.top = `${top}px`
          overlay.style.left = `${left}px`
          overlay.style.width = `${width}px`
          overlay.style.textAlign = textAlign
          overlay.style.fontSize = "11pt"
          overlay.style.fontFamily = "inherit"
          overlay.style.color = "rgb(31 41 55)"
          overlay.style.fontWeight = "500"
          overlay.style.zIndex = "1000"
          overlay.style.display = "none" // Will be shown in print

          overlayContainer.appendChild(overlay)
        }

        // Alternative function to position from the right side
        const createFixedOverlayFromRight = (name, value, top, right, width, textAlign = "center") => {
          if (!value) return

          const overlay = document.createElement("div")
          overlay.className = "print-text-overlay"
          overlay.textContent = value
          overlay.dataset.for = name

          // Use fixed positioning based on the form design
          overlay.style.position = "absolute"
          overlay.style.top = `${top}px`

          // Calculate position from the left to ensure it's all the way to the right
          // A4 width is 210mm ≈ 794px, subtract width and right margin
          const leftPosition = 794 - width - right
          overlay.style.left = `${leftPosition}px`

          // Also set right property as a fallback
          overlay.style.right = `${right}px`

          overlay.style.width = `${width}px`
          overlay.style.textAlign = textAlign
          overlay.style.fontSize = "11pt"
          overlay.style.fontFamily = "inherit"
          overlay.style.color = "rgb(31 41 55)"
          overlay.style.fontWeight = "500"
          overlay.style.zIndex = "1000"
          overlay.style.display = "none" // Will be shown in print

          overlayContainer.appendChild(overlay)
        }

        // Create overlays for each field with fixed positions
        // Date issued
        createFixedOverlayFromRight("dateIssued", formData.dateIssued, 98, 85, 160)

        // Short text
        createFixedOverlayFromRight("shortText", formData.shortText, 136, 80, 250)

        // Category - Use the existing printSelectText element instead of creating a new overlay
        if (formData.category) {
          // Find the existing printSelectText element
          const printSelectText = containerRef.current.querySelector(".printSelectText")
          if (printSelectText) {
            // Make sure it has the correct text
            printSelectText.textContent = selectedOptionText || ""

            // Create a style to ensure it's visible during print
            const printSelectStyle = document.createElement("style")
            printSelectStyle.id = "print-select-style-proposal"
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
            `
            document.head.appendChild(printSelectStyle)

            // Clean up the style after printing
            window.addEventListener("afterprint", function removeStyle() {
              const styleToRemove = document.getElementById("print-select-style-proposal")
              if (styleToRemove) {
                document.head.removeChild(styleToRemove)
              }
              window.removeEventListener("afterprint", removeStyle)
            })
          }
        }

        // Beneficiary name
        createFixedOverlay("beneficiaryName", formData.beneficiaryName, 300, 200, 392)

        // Numeric value 1
        createFixedOverlay("numericValue1", formData.numericValue1, 527, 580, 98)

        // Numeric value 2
        createFixedOverlay("numericValue2", formData.numericValue2, 641, 525, 154)

        // Additional date
        createFixedOverlayFromRight("additionalDate", formData.additionalDate, 750, 588, 120)

        // Add a style tag for print media
        let styleTag = document.getElementById("print-overlay-styles-proposal")
        if (!styleTag) {
          styleTag = document.createElement("style")
          styleTag.id = "print-overlay-styles-proposal"
          document.head.appendChild(styleTag)
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
        `

        // After printing, restore the original styles
        window.addEventListener("afterprint", function restoreStyles() {
          // Restore original styles
          containerRef.current.style.transform = originalTransform
          containerRef.current.style.marginTop = originalMarginTop
          containerRef.current.style.marginBottom = originalMarginBottom

          // Remove the print overlay container
          const overlayContainer = containerRef.current.querySelector(".print-overlay-container")
          if (overlayContainer) {
            containerRef.current.removeChild(overlayContainer)
          }

          window.removeEventListener("afterprint", restoreStyles)
        })
      }
    }

    window.addEventListener("beforeprint", handleBeforePrint)
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint)
      const styleTag = document.getElementById("print-overlay-styles-proposal")
      if (styleTag) {
        styleTag.remove()
      }
    }
  }, [formData, selectedOptionText])

  useEffect(() => {
    const styleElement = document.createElement("style")
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
`
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const isMobile = window.innerWidth <= 768

        if (isMobile) {
          containerRef.current.classList.add(styles.mobileView)

          const scale = Math.max(0.25, Math.min(0.6, window.innerWidth / 800))

          containerRef.current.style.transform = `scale(${scale})`

          const marginAdjustment = ((1 - scale) * 297) / 2
          containerRef.current.style.marginTop = `-${marginAdjustment}mm`
          containerRef.current.style.marginBottom = `-${marginAdjustment}mm`
        } else {
          containerRef.current.classList.remove(styles.mobileView)
          containerRef.current.style.transform = ""
          containerRef.current.style.marginTop = ""
          containerRef.current.style.marginBottom = ""
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

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
          placeholder="specialitate..."
          style={{
            backgroundColor: formData.shortText ? "transparent" : inputColor,
          }}
          autocomplete="off"
        />

        <div className={`${styles.categoryContainer} ${!formData.category ? styles.empty : ""}`}>
          <SimpleDropdown
            name="category"
            value={formData.category || ""}
            onChange={(e) => {
              handleSelectChange(e)
              fillAutoFields(e.target.name, e.target.value, formData[e.target.name])
            }}
            options={categoryOptions}
            className={`${styles.inputField} ${styles.categoryDropdown}`}
            style={{
              backgroundColor: formData.category ? "transparent" : inputColor,
              color: "transparent",
            }}
            placeholder="Select category"
          />

          <span className={styles.printSelectText}>{selectedOptionText || "Selectați categoria"}</span>
        </div>

        <BeneficiaryDropdown
          name="beneficiaryName"
          value={formData.beneficiaryName || ""}
          onChange={(e) => {
            handleBeneficiaryNameChange(e)
            fillAutoFields(e.target.name, e.target.value, formData[e.target.name])
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
            const value = e.target.value
            if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
              return
            }

            // Update both numeric fields with the same value
            handleInputChange({
              target: { name: "numericValue1", value },
            })
            handleInputChange({
              target: { name: "numericValue2", value },
            })

            fillAutoFields("numericValue1", value, formData.numericValue1)
          }}
          className={`${styles.inputField} ${styles.numericField1}`}
          placeholder="0.00"
          inputMode="decimal"
          maxLength={12}
          style={{
            backgroundColor: formData.numericValue1 ? "transparent" : inputColor,
          }}
          autocomplete="off"
        />

        <input
          type="text"
          name="numericValue2"
          value={formData.numericValue2 || ""}
          onChange={(e) => {
            const value = e.target.value
            if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
              return
            }

            // Update both numeric fields with the same value
            handleInputChange({
              target: { name: "numericValue1", value },
            })
            handleInputChange({
              target: { name: "numericValue2", value },
            })

            fillAutoFields("numericValue2", value, formData.numericValue2)
          }}
          className={`${styles.inputField} ${styles.numericField2}`}
          placeholder="0.00"
          inputMode="decimal"
          maxLength={12}
          style={{
            backgroundColor: formData.numericValue2 ? "transparent" : inputColor,
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
  )
}
