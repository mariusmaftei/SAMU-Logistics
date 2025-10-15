import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useFormEntries } from "../../context/FormEntriesContext";
import styles from "./FormEntriesPage.module.css";
import EntryModal from "../../components/UI/EntryModal/EntryModal";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";
import ConfirmModal from "../../components/UI/ConfirmModal/ConfirmModal";

export default function FormEntriesPage() {
  const { formEntries, loading, error, deleteEntry, refreshEntries } =
    useFormEntries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const tableContainerRef = useRef(null);
  const [columnWidths, setColumnWidths] = useState({
    0: "20%",
    1: "25%",
    2: "15%",
    3: "9%",
    4: "21%",
    5: "10%",
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleAddNew = () => {
    setCurrentEntry(null);
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

          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        } catch (err) {
          console.error("Error deleting entry:", err);

          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const closeConfirmModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveEntry = () => {
    setIsModalOpen(false);
  };

  // Sort entries by creation date (newest first)
  const sortedEntries = [...formEntries].sort((a, b) => {
    const dateA = new Date(a.createdAt || a._id);
    const dateB = new Date(b.createdAt || b._id);
    return dateB - dateA; // Descending order (newest first)
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = sortedEntries.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to first page when formEntries change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortedEntries.length]);

  useEffect(() => {
    window.handleAddEntry = handleAddNew;
  }, []);

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

  const handleResizeStart = (index, e) => {
    e.preventDefault();
    setResizing(index);

    const headerCell = tableRef.current.querySelector(
      `th:nth-child(${index + 1})`
    );
    const initialWidth = headerCell.getBoundingClientRect().width;

    setStartX(e.clientX);
    setStartWidth(initialWidth);

    if (resizeLineRef.current) {
      const headerRect = headerCell.getBoundingClientRect();
      const tableRect = tableRef.current.getBoundingClientRect();

      resizeLineRef.current.style.left = `${
        headerRect.right - tableRect.left
      }px`;
      resizeLineRef.current.classList.add(styles.active);
      resizeLineRef.current.style.opacity = 1;
    }

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

    const diff = e.clientX - startX;

    const limitedDiff = Math.max(
      Math.min(diff, 200),
      -Math.min(startWidth - 50, 200)
    );

    const newPosition = headerRect.right - tableRect.left + limitedDiff;

    resizeLineRef.current.style.left = `${newPosition}px`;
  };

  const handleResizeEnd = (e) => {
    if (resizing === null || !tableRef.current) return;

    const diff = e.clientX - startX;

    const limitedDiff = Math.max(
      Math.min(diff, 200),
      -Math.min(startWidth - 50, 200)
    );
    const newWidth = startWidth + limitedDiff;

    const tableWidth = tableRef.current.getBoundingClientRect().width;

    const percentWidth = `${Math.max(
      5,
      Math.min(80, (newWidth / tableWidth) * 100)
    )}%`;

    setColumnWidths((prev) => ({
      ...prev,
      [resizing]: percentWidth,
    }));

    if (resizeLineRef.current) {
      resizeLineRef.current.classList.remove(styles.active);
      resizeLineRef.current.style.opacity = 0;
    }

    setResizing(null);
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  useEffect(() => {
    const showInitialScrollIndicator = () => {
      if (window.innerWidth <= 1366 && tableContainerRef.current) {
        const hasScroll =
          tableContainerRef.current.scrollWidth >
          tableContainerRef.current.clientWidth;

        if (hasScroll) {
          let indicator = tableContainerRef.current.querySelector(
            `.${styles.scrollIndicator}`
          );

          if (!indicator) {
            indicator = document.createElement("div");
            indicator.className = styles.scrollIndicator;
            indicator.textContent = "Scroll pentru mai multe →";
            tableContainerRef.current.appendChild(indicator);
          }

          indicator.style.opacity = "0.8";

          setTimeout(() => {
            indicator.style.opacity = "";
          }, 3000);
        }
      }
    };

    if (!loading && formEntries.length > 0) {
      showInitialScrollIndicator();
    }
  }, [loading, formEntries]);

  return (
    <div className={styles.container}>
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
                    currentEntries.map((entry) => (
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

            {/* Pagination */}
            {formEntries.length > 0 && totalPages > 1 && (
              <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                  Afișez {startIndex + 1}-
                  {Math.min(endIndex, sortedEntries.length)} din{" "}
                  {sortedEntries.length} intrări
                </div>
                <div className={styles.paginationControls}>
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`${styles.paginationButton} ${styles.previousButton}`}
                    aria-label="Pagina anterioară"
                  >
                    <ChevronLeft className={styles.paginationIcon} />
                    Anterior
                  </button>

                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Show first page, last page, current page, and pages around current page
                        const shouldShow =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1;

                        if (!shouldShow) {
                          // Show ellipsis for gaps
                          if (page === 2 && currentPage > 4) {
                            return (
                              <span
                                key={`ellipsis-${page}`}
                                className={styles.ellipsis}
                              >
                                ...
                              </span>
                            );
                          }
                          if (
                            page === totalPages - 1 &&
                            currentPage < totalPages - 3
                          ) {
                            return (
                              <span
                                key={`ellipsis-${page}`}
                                className={styles.ellipsis}
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`${styles.pageButton} ${
                              page === currentPage ? styles.activePage : ""
                            }`}
                            aria-label={`Pagina ${page}`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`${styles.paginationButton} ${styles.nextButton}`}
                    aria-label="Pagina următoare"
                  >
                    Următor
                    <ChevronRight className={styles.paginationIcon} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Hidden button that can be triggered by the sidebar */}
      <button
        onClick={handleAddNew}
        style={{ display: "none" }}
        aria-label="Add Entry"
      />

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
