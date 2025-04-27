import { useState,useRef,useEffect } from "react";
import SideBar from "../../components/UI/SideBar/SideBar";
import ProposalForm from "../../components/Form/proposal-form";
import BudgetCommitmentForm from "../../components/Form/budget-commitment-form";
import PaymentOrderForm from "../../components/Form/payment-order-form";
import styles from "../form/form.module.css";
import ZoomControls from "../../components/zoomControls/ZoomControls";
import { useZoom } from "../../context/ZoomContext"

export default function Form() {
  const [currentFormType, setCurrentFormType] = useState("payment_order")
  const formContainerRef = useRef(null)
  const { zoomLevel } = useZoom()

  const [formData, setFormData] = useState({
    expenseNature: "",
    billDate: "",
    amountDue: "",
    beneficiaryName: "",
    accountNumber: "",
    bankNumber: "",
    address: "",
    treasury: "",
    treasuryNumber: "",
    roCode: "",
    amount: "",
  })

  // Apply zoom effect whenever zoomLevel changes
  useEffect(() => {
    if (formContainerRef.current) {
      console.log(`Applying zoom: ${zoomLevel * 100}%`)

      // Apply transform with !important to override any conflicting styles
      formContainerRef.current.style.setProperty("transform", `scale(${zoomLevel})`, "important")

      // Adjust margins to compensate for scaling
      const marginAdjustment = ((zoomLevel - 1) * 297) / 2
      formContainerRef.current.style.marginTop = zoomLevel > 1 ? `${marginAdjustment}mm` : "0"
      formContainerRef.current.style.marginBottom = zoomLevel > 1 ? `${marginAdjustment}mm` : "0"

      // Add transition for smooth zooming
      formContainerRef.current.style.transition = "transform 0.2s ease"
    }
  }, [zoomLevel])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleReset = () => {
    setFormData({
      dateIssued: "",
    })
  }

  const handleFormTypeChange = (formType) => {
    setCurrentFormType(formType)
  }

  const handleDateKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, numbers
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39) ||
      // Allow numbers
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      return
    }
    e.preventDefault()
  }

  // Add a useEffect to handle print preparation
  useEffect(() => {
    const handleBeforePrint = () => {
      // Store the current zoom level
      const currentZoom = formContainerRef.current.style.transform

      // Reset to 100% zoom for printing
      formContainerRef.current.style.setProperty("transform", "scale(1)", "important")
      formContainerRef.current.style.marginTop = "0"
      formContainerRef.current.style.marginBottom = "0"

      // Add a class to help with print-specific styling
      document.body.classList.add("printing")

      // After printing, restore the previous zoom level
      window.addEventListener("afterprint", function restoreZoom() {
        formContainerRef.current.style.setProperty("transform", currentZoom, "important")

        // Restore margins if needed
        if (zoomLevel > 1) {
          const marginAdjustment = ((zoomLevel - 1) * 297) / 2
          formContainerRef.current.style.marginTop = `${marginAdjustment}mm`
          formContainerRef.current.style.marginBottom = `${marginAdjustment}mm`
        }

        document.body.classList.remove("printing")
        window.removeEventListener("afterprint", restoreZoom)
      })
    }

    window.addEventListener("beforeprint", handleBeforePrint)
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint)
    }
  }, [zoomLevel])

  const renderForm = () => {
    switch (currentFormType) {
      case "proposal":
        return (
          <ProposalForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateKeyDown={handleDateKeyDown}
          />
        )
      case "budget_commitment":
        return (
          <BudgetCommitmentForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateKeyDown={handleDateKeyDown}
          />
        )
      default:
        return (
          <PaymentOrderForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateKeyDown={handleDateKeyDown}
          />
        )
    }
  }

  return (
    <div className={styles.container}>
      <SideBar onReset={handleReset} currentFormType={currentFormType} onFormTypeChange={handleFormTypeChange} />
      <main className={styles.main}>
        <div
          ref={formContainerRef}
          className={styles.formContainer}
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
          }}
        >
          {renderForm()}
        </div>
        <ZoomControls />
      </main>
    </div>
  )
}
