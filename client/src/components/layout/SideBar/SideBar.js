import { useEffect, useCallback, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Printer,
  RotateCcw,
  FileDown,
  ClipboardList,
  FileCheck,
  CreditCard,
  ZoomOut,
  ZoomIn,
  RefreshCw,
} from "lucide-react";
import html2pdf from "html2pdf.js";
import styles from "./SideBar.module.css";
import { useZoom } from "../../../context/ZoomContext";
import SamuLogo from "../../../assets/images/samu-logo.png";
import ConfirmModal from "../../UI/ConfirmModal/ConfirmModal";

export default function SideBar({
  onReset,
  currentFormType,
  onFormTypeChange,
  customActions = null,
  showFormTypes = true,
  showZoomControls = true,
  showFormActions = true,
}) {
  const sidebarRef = useRef(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useZoom();

  const [activeTooltip, setActiveTooltip] = useState(null);

  const tooltipRefs = useRef({});

  useEffect(() => {
    const enforceSidebarWidth = () => {
      if (sidebarRef.current) {
        sidebarRef.current.style.width = "64px";
        sidebarRef.current.style.minWidth = "64px";
        sidebarRef.current.style.maxWidth = "64px";
        sidebarRef.current.style.position = "fixed";
        sidebarRef.current.style.top = "0";
        sidebarRef.current.style.left = "0";
        sidebarRef.current.style.height = "100vh";
      }
    };

    enforceSidebarWidth();

    window.addEventListener("resize", enforceSidebarWidth);

    return () => {
      window.removeEventListener("resize", enforceSidebarWidth);
    };
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setModalConfig({
      isOpen: true,
      title: "Descarca PDF",
      message: "Doriți să descărcați acest document ca PDF?",
      onConfirm: () => {
        closeModal();

        try {
          const element = document.querySelector("main").firstElementChild;

          if (!element) {
            alert("Could not find the form to convert to PDF");
            return;
          }

          html2pdf(element, {
            margin: 0,
            filename: "medical-form.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              letterRendering: true,

              height: element.clientHeight,
              windowHeight: element.clientHeight,
            },
            jsPDF: {
              unit: "mm",
              format: "a4",
              orientation: "portrait",
              compress: true,

              putOnlyUsedFonts: true,
              floatPrecision: 16,
            },

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

  const showTooltip = (id, e) => {
    setActiveTooltip(id);
    if (tooltipRefs.current[id] && e.currentTarget) {
      const tooltip = tooltipRefs.current[id];
      const buttonRect = e.currentTarget.getBoundingClientRect();

      tooltip.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
      tooltip.style.opacity = "1";
    }
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  return (
    <>
      <div className={styles.sidebar} ref={sidebarRef}>
        <Link to="/" className={styles.logoContainer}>
          <img
            src={SamuLogo}
            alt="SAMU Logistics Logo"
            className={styles.logo}
          />
        </Link>

        {showFormTypes && (
          <>
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
                  <span className={styles.buttonText}>
                    Ordonanțare de Plată
                  </span>
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
                  <span className={styles.buttonText}>
                    Propunere de Angajare
                  </span>
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
                  style={{
                    opacity: activeTooltip === "budget_commitment" ? 1 : 0,
                  }}
                >
                  Angajament Bugetar
                </div>
              </div>
            </div>
            <div className={styles.divider}></div>
          </>
        )}

        {customActions && (
          <>
            {customActions}
            <div className={styles.divider}></div>
          </>
        )}

        {showFormActions && (
          <>
            <div className={styles.formTypeLabel}>Acțiuni</div>
            <div className={styles.buttonContainer}>
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
            <div className={styles.divider}></div>
          </>
        )}

        {showZoomControls && (
          <>
            <div className={styles.formTypeLabel}>Zoom</div>
            <div className={styles.buttonContainer}>
              <div
                className={styles.tooltipContainer}
                onMouseEnter={(e) => showTooltip("zoom-out", e)}
                onMouseLeave={hideTooltip}
              >
                <button
                  onClick={zoomOut}
                  className={`${styles.button}`}
                  aria-label="Zoom Out"
                  disabled={zoomLevel <= 0.5}
                >
                  <ZoomOut className={styles.icon} />
                </button>
                <div
                  className={styles.tooltip}
                  ref={(el) => (tooltipRefs.current["zoom-out"] = el)}
                  style={{ opacity: activeTooltip === "zoom-out" ? 1 : 0 }}
                >
                  Micșorează ({Math.round(zoomLevel * 100)}%)
                </div>
              </div>

              <div
                className={styles.tooltipContainer}
                onMouseEnter={(e) => showTooltip("zoom-in", e)}
                onMouseLeave={hideTooltip}
              >
                <button
                  onClick={zoomIn}
                  className={`${styles.button}`}
                  aria-label="Zoom In"
                  disabled={zoomLevel >= 1.5}
                >
                  <ZoomIn className={styles.icon} />
                </button>
                <div
                  className={styles.tooltip}
                  ref={(el) => (tooltipRefs.current["zoom-in"] = el)}
                  style={{ opacity: activeTooltip === "zoom-in" ? 1 : 0 }}
                >
                  Mărește ({Math.round(zoomLevel * 100)}%)
                </div>
              </div>

              <div
                className={styles.tooltipContainer}
                onMouseEnter={(e) => showTooltip("zoom-reset", e)}
                onMouseLeave={hideTooltip}
              >
                <button
                  onClick={resetZoom}
                  className={`${styles.button}`}
                  aria-label="Reset Zoom"
                >
                  <RefreshCw className={styles.icon} />
                </button>
                <div
                  className={styles.tooltip}
                  ref={(el) => (tooltipRefs.current["zoom-reset"] = el)}
                  style={{ opacity: activeTooltip === "zoom-reset" ? 1 : 0 }}
                >
                  Resetează zoom (100%)
                </div>
              </div>
            </div>
          </>
        )}
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
