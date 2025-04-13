import { useEffect, useCallback, useState, useRef } from "react";
import {
  Printer,
  RotateCcw,
  FileDown,
  ClipboardList,
  FileCheck,
  CreditCard,
} from "lucide-react";
import html2pdf from "html2pdf.js";
import styles from "../SideBar/SideBar.module.css";
import ConfirmModal from "../confirm-modal/ConfirmModal";
export default function SideBar({
  onReset,
  currentFormType,
  onFormTypeChange,
}) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // State to track which tooltip is visible
  const [activeTooltip, setActiveTooltip] = useState(null);
  // Refs to track tooltip positions
  const tooltipRefs = useRef({});

  const closeModal = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // SIMPLIFIED PRINT FUNCTION - Direct equivalent to CTRL+P
  const handlePrint = () => {
    // Directly trigger print without any confirmation or preparation
    window.print();
  };

  // PDF DOWNLOAD FUNCTION - With confirmation modal
  const handleDownloadPDF = () => {
    // Show confirmation modal first
    setModalConfig({
      isOpen: true,
      title: "Descarca PDF",
      message: "Doriți să descărcați acest document ca PDF?",
      onConfirm: () => {
        // Close the modal
        closeModal();

        // Most direct implementation possible
        try {
          // Get the form container - try with a more general selector
          const element = document.querySelector("main").firstElementChild;

          if (!element) {
            alert("Could not find the form to convert to PDF");
            return;
          }

          // Generate PDF with improved options to prevent blank pages
          html2pdf(element, {
            margin: 0,
            filename: "medical-form.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              letterRendering: true,
              // Ensure we only capture what's visible
              height: element.clientHeight,
              windowHeight: element.clientHeight,
            },
            jsPDF: {
              unit: "mm",
              format: "a4",
              orientation: "portrait",
              compress: true,
              // Prevent automatic page breaks
              putOnlyUsedFonts: true,
              floatPrecision: 16,
            },
            // Prevent automatic page breaks
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
          });
        } catch (error) {
          console.error("PDF generation error:", error);
          alert("Error generating PDF: " + error.message);
        }
      },
    });
  };

  const handleReset = () => {
    setModalConfig({
      isOpen: true,
      title: "Resetează formularul",
      message:
        "Sigur doriți să ștergeți toate câmpurile formularului? Această acțiune nu poate fi anulată.",
      onConfirm: () => {
        onReset?.();
        closeModal();
      },
    });
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "F10") {
        event.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Function to show tooltip
  const showTooltip = (id, e) => {
    setActiveTooltip(id);
    if (tooltipRefs.current[id] && e.currentTarget) {
      const tooltip = tooltipRefs.current[id];
      const buttonRect = e.currentTarget.getBoundingClientRect();
      // Position tooltip centered with the button
      tooltip.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
      tooltip.style.opacity = "1";
    }
  };

  // Function to hide tooltip
  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  return (
    <>
      <div className={styles.sidebar}>
        {/* Form Type Selector Buttons */}
        <div className={styles.formTypeContainer}>
          <div className={styles.formTypeLabel}>Formulare</div>

          <div
            className={styles.tooltipContainer}
            onMouseEnter={(e) => showTooltip("payment_order", e)}
            onMouseLeave={hideTooltip}
          >
            <button
              onClick={() => onFormTypeChange("payment_order")}
              className={`${styles.formTypeButton} ${
                currentFormType === "payment_order" ? styles.active : ""
              }`}
              aria-label="Ordonanțare de Plată"
            >
              <CreditCard className={styles.icon} />
              <span className={styles.buttonText}>Ordonanțare de Plată</span>
            </button>
            <div
              className={styles.tooltip}
              ref={(el) => (tooltipRefs.current["payment_order"] = el)}
              style={{ opacity: activeTooltip === "payment_order" ? 1 : 0 }}
            >
              Ordonanțare de Plată
            </div>
          </div>

          <div
            className={styles.tooltipContainer}
            onMouseEnter={(e) => showTooltip("proposal", e)}
            onMouseLeave={hideTooltip}
          >
            <button
              onClick={() => onFormTypeChange("proposal")}
              className={`${styles.formTypeButton} ${
                currentFormType === "proposal" ? styles.active : ""
              }`}
              aria-label="Propunere de Angajare"
            >
              <ClipboardList className={styles.icon} />
              <span className={styles.buttonText}>Propunere de Angajare</span>
            </button>
            <div
              className={styles.tooltip}
              ref={(el) => (tooltipRefs.current["proposal"] = el)}
              style={{ opacity: activeTooltip === "proposal" ? 1 : 0 }}
            >
              Propunere de Angajare
            </div>
          </div>

          <div
            className={styles.tooltipContainer}
            onMouseEnter={(e) => showTooltip("budget_commitment", e)}
            onMouseLeave={hideTooltip}
          >
            <button
              onClick={() => onFormTypeChange("budget_commitment")}
              className={`${styles.formTypeButton} ${
                currentFormType === "budget_commitment" ? styles.active : ""
              }`}
              aria-label="Angajament Bugetar"
            >
              <FileCheck className={styles.icon} />
              <span className={styles.buttonText}>Angajament Bugetar</span>
            </button>
            <div
              className={styles.tooltip}
              ref={(el) => (tooltipRefs.current["budget_commitment"] = el)}
              style={{ opacity: activeTooltip === "budget_commitment" ? 1 : 0 }}
            >
              Angajament Bugetar
            </div>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.formTypeLabel}>Acțiuni</div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          {/* Print Button */}
          <div
            className={styles.tooltipContainer}
            onMouseEnter={(e) => showTooltip("print", e)}
            onMouseLeave={hideTooltip}
          >
            <button
              onClick={handlePrint}
              className={`${styles.button} ${styles.buttonPrint}`}
              aria-label="Print"
            >
              <Printer className={styles.icon} />
            </button>
            <div
              className={styles.tooltip}
              ref={(el) => (tooltipRefs.current["print"] = el)}
              style={{ opacity: activeTooltip === "print" ? 1 : 0 }}
            >
              Printeaza
            </div>
          </div>

          {/* Download PDF Button */}
          <div
            className={styles.tooltipContainer}
            onMouseEnter={(e) => showTooltip("pdf", e)}
            onMouseLeave={hideTooltip}
          >
            <button
              onClick={handleDownloadPDF}
              className={`${styles.button} ${styles.buttonPdf}`}
              aria-label="Download PDF"
            >
              <FileDown className={styles.icon} />
            </button>
            <div
              className={styles.tooltip}
              ref={(el) => (tooltipRefs.current["pdf"] = el)}
              style={{ opacity: activeTooltip === "pdf" ? 1 : 0 }}
            >
              Descarcare PDF
            </div>
          </div>

          {/* Reset Button */}
          <div
            className={styles.tooltipContainer}
            onMouseEnter={(e) => showTooltip("reset", e)}
            onMouseLeave={hideTooltip}
          >
            <button
              onClick={handleReset}
              className={`${styles.button} ${styles.buttonReset}`}
              aria-label="Reset"
            >
              <RotateCcw className={styles.icon} />
            </button>
            <div
              className={styles.tooltip}
              ref={(el) => (tooltipRefs.current["reset"] = el)}
              style={{ opacity: activeTooltip === "reset" ? 1 : 0 }}
            >
              Șterge câmpurile formularului
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onClose={closeModal}
      />
    </>
  );
}
