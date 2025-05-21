"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useFormEntries } from "../../context/FormEntriesContext";
import styles from "../form-entries/form-entries.module.css";
import SAMULogo from "../../assets/images/samu-logo.png";
import EntryModal from "../../components/UI/entry-modal/EntryModal";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";
import ConfirmModal from "../../components/UI/confirm-modal/ConfirmModal";
import { Link } from "react-router-dom";

export default function FormEntries() {
  const { formEntries, loading, error, deleteEntry, refreshEntries } =
    useFormEntries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const tableContainerRef = useRef(null);
  const [columnWidths, setColumnWidths] = useState({
    0: "20%", // Name
    1: "25%", // Address
    2: "15%", // CUI/CIF
    3: "9%", // IBAN (reduced by 40% from 15%)
    4: "21%", // Treasury (increased to compensate)
    5: "10%", // Actions
  });
  const [resizing, setResizing] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const tableRef = useRef(null);
  const resizeLineRef = useRef(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleAddNew = () => {
    setCurrentEntry(null); // Reset current entry to ensure we're in "add" mode
    setIsModalOpen(true);
  };

  const handleEdit = (entry) => {
    setCurrentEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      title: "Confirmare ștergere",
      message:
        "Sigur doriți să ștergeți această intrare? Această acțiune nu poate fi anulată.",
      onConfirm: async () => {
        try {
          await deleteEntry(id);
          // Close the modal after successful deletion
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        } catch (err) {
          console.error("Error deleting entry:", err);
          // You could show an error notification here
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleSaveEntry = () => {
    setIsModalOpen(false);
    // The context will automatically refresh the entries
  };

  const closeConfirmModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Check if table has horizontal scroll
  useEffect(() => {
    const checkForHorizontalScroll = () => {
      if (tableContainerRef.current) {
        const hasScroll =
          tableContainerRef.current.scrollWidth >
          tableContainerRef.current.clientWidth;
        setHasHorizontalScroll(hasScroll);
      }
    };

    checkForHorizontalScroll();
    window.addEventListener("resize", checkForHorizontalScroll);

    return () => {
      window.removeEventListener("resize", checkForHorizontalScroll);
    };
  }, [formEntries, columnWidths]);

  // Column resizing handlers
  const handleResizeStart = (index, e) => {
    e.preventDefault();
    setResizing(index);

    // Get the current width of the column
    const headerCell = tableRef.current.querySelector(
      `th:nth-child(${index + 1})`
    );
    const initialWidth = headerCell.getBoundingClientRect().width;

    setStartX(e.clientX);
    setStartWidth(initialWidth);

    // Show resize line at initial position
    if (resizeLineRef.current) {
      const headerRect = headerCell.getBoundingClientRect();
      const tableRect = tableRef.current.getBoundingClientRect();

      resizeLineRef.current.style.left = `${
        headerRect.right - tableRect.left
      }px`;
      resizeLineRef.current.classList.add(styles.active);
      resizeLineRef.current.style.opacity = 1;
    }

    // Add event listeners for resize
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeMove = (e) => {
    if (resizing === null || !tableRef.current || !resizeLineRef.current)
      return;

    const tableRect = tableRef.current.getBoundingClientRect();
    const headerCell = tableRef.current.querySelector(
      `th:nth-child(${resizing + 1})`
    );
    const headerRect = headerCell.getBoundingClientRect();

    // Calculate the difference from the start position
    const diff = e.clientX - startX;

    // Limit the resize range to ±200px from original size
    const limitedDiff = Math.max(
      Math.min(diff, 200),
      -Math.min(startWidth - 50, 200)
    );

    // Calculate new position
    const newPosition = headerRect.right - tableRect.left + limitedDiff;

    // Update resize line position
    resizeLineRef.current.style.left = `${newPosition}px`;
  };

  const handleResizeEnd = (e) => {
    if (resizing === null || !tableRef.current) return;

    // Calculate new width with limits
    const diff = e.clientX - startX;

    // Limit the resize range to ±200px from original size
    const limitedDiff = Math.max(
      Math.min(diff, 200),
      -Math.min(startWidth - 50, 200)
    );
    const newWidth = startWidth + limitedDiff;

    // Get table width
    const tableWidth = tableRef.current.getBoundingClientRect().width;

    // Calculate percentage width
    const percentWidth = `${Math.max(
      5,
      Math.min(80, (newWidth / tableWidth) * 100)
    )}%`;

    // Update column widths
    setColumnWidths((prev) => ({
      ...prev,
      [resizing]: percentWidth,
    }));

    // Hide resize line
    if (resizeLineRef.current) {
      resizeLineRef.current.classList.remove(styles.active);
      resizeLineRef.current.style.opacity = 0;
    }

    // Clean up
    setResizing(null);
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  // Add a useEffect to handle initial scroll indicator visibility for 1366x768 screens
  useEffect(() => {
    // Show scroll indicator initially on smaller screens
    const showInitialScrollIndicator = () => {
      if (window.innerWidth <= 1366 && tableContainerRef.current) {
        const hasScroll =
          tableContainerRef.current.scrollWidth >
          tableContainerRef.current.clientWidth;

        if (hasScroll) {
          // Find or create the scroll indicator
          let indicator = tableContainerRef.current.querySelector(
            `.${styles.scrollIndicator}`
          );

          if (!indicator) {
            indicator = document.createElement("div");
            indicator.className = styles.scrollIndicator;
            indicator.textContent = "Scroll pentru mai multe →";
            tableContainerRef.current.appendChild(indicator);
          }

          // Make it visible initially
          indicator.style.opacity = "0.8";

          // Hide after 3 seconds
          setTimeout(() => {
            indicator.style.opacity = "";
          }, 3000);
        }
      }
    };

    // Run after component mounts and table data is loaded
    if (!loading && formEntries.length > 0) {
      showInitialScrollIndicator();
    }
  }, [loading, formEntries, styles.scrollIndicator]);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {/* Logo at the top of sidebar */}
        <Link to="/" className={styles.logoContainer}>
          <img
            src={SAMULogo || "/placeholder.svg"}
            alt="SAMU Logistics Logo"
            className={styles.logo}
          />
        </Link>

        <div className={styles.buttonContainer}>
          <div className={styles.buttonLabel}>Adaugă</div>
          <div className={styles.tooltipContainer}>
            <button
              onClick={handleAddNew}
              className={`${styles.button} ${styles.buttonAdd}`}
              aria-label="Add Entry"
            >
              <Plus className={styles.icon} />
            </button>
            <div className={styles.tooltip}>
              <div className={styles.tooltipContent}>Adaugă o nouă intrare</div>
            </div>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        {loading || (!formEntries.length && error) ? (
          <div className={styles.centeredSpinner}>
            <LoadingSpinner />
          </div>
        ) : (
          <div className={styles.content}>
            <h1 className={styles.title}>Intrări Formular</h1>

            {error && (
              <div className={styles.errorMessage}>
                {error}
                <button onClick={refreshEntries} className={styles.retryButton}>
                  Încearcă din nou
                </button>
              </div>
            )}

            <div className={styles.tableContainer} ref={tableContainerRef}>
              {hasHorizontalScroll && (
                <div className={styles.scrollIndicator}>
                  Scroll pentru mai multe →
                </div>
              )}
              <div
                className={`${styles.resizeLine} ${
                  resizing !== null ? styles.active : ""
                }`}
                ref={resizeLineRef}
                style={{ left: "0px", opacity: resizing !== null ? 1 : 0 }}
              ></div>
              <table className={styles.table} ref={tableRef}>
                <thead>
                  <tr>
                    {[
                      "Nume",
                      "Adresa beneficiarului",
                      "Trezorerie",
                      "CUI/CIF",
                      "IBAN",
                      "Acțiuni",
                    ].map((header, index) => (
                      <th key={index} style={{ width: columnWidths[index] }}>
                        {header}
                        {index < 5 && (
                          <div
                            className={`${styles.resizeHandle} ${
                              resizing === index ? styles.active : ""
                            }`}
                            onMouseDown={(e) => handleResizeStart(index, e)}
                          >
                            <div></div> {/* Middle bar */}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formEntries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className={styles.noEntries}>
                        Nicio intrare găsită. Adaugă o nouă intrare pentru a
                        începe.
                      </td>
                    </tr>
                  ) : (
                    formEntries.map((entry) => (
                      <tr key={entry._id || entry.id}>
                        <td
                          title={entry.Nume_Furnizor}
                          style={{ width: columnWidths[0] }}
                        >
                          {entry.Nume_Furnizor}
                        </td>
                        <td
                          title={entry.Adresa_Furnizor}
                          style={{ width: columnWidths[1] }}
                        >
                          {entry.Adresa_Furnizor}
                        </td>
                        <td
                          title={entry.CUI_CUI_CIF}
                          style={{ width: columnWidths[2] }}
                        >
                          {entry.CUI_CUI_CIF}
                        </td>
                        <td
                          title={entry.NR_CONT_IBAN}
                          style={{ width: columnWidths[3] }}
                        >
                          {entry.NR_CONT_IBAN}
                        </td>
                        <td
                          title={entry.Trezorerie_Furnizor}
                          style={{ width: columnWidths[4] }}
                        >
                          {entry.Trezorerie_Furnizor}
                        </td>
                        <td style={{ width: columnWidths[5] }}>
                          <div className={styles.actions}>
                            <button
                              onClick={() => handleEdit(entry)}
                              className={`${styles.actionButton} ${styles.editButton}`}
                              aria-label="Edit entry"
                              title="Editează"
                            >
                              <Pencil className={styles.actionIcon} />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(entry._id || entry.id)
                              }
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              aria-label="Delete entry"
                              title="Șterge"
                            >
                              <Trash2 className={styles.actionIcon} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <EntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
        editEntry={currentEntry}
      />
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onClose={closeConfirmModal}
      />
    </div>
  );
}
