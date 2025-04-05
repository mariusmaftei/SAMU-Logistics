import { useState, useEffect } from "react";
import { Save, Pencil, Trash2, Plus } from "lucide-react";
import { useFormEntries } from "../../context/FormEntriesContext";
import AddEntryModal from "../../components/UI/from-entry-modal/FormEntryModal";
import styles from "../form-data/form-data.module.css";
import axios from "axios";

export default function FormData() {
  const { formEntries, getCurrentDate, loading, error, deleteEntry } =
    useFormEntries();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSave = () => {
    console.log("Saving data...");
  };

  const handleEdit = (id) => {
    console.log("Editing entry:", id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  const handleAddEntry = (newEntry) => {
    // The modal component will handle adding the entry to the context
    setIsAddModalOpen(false);
  };

  // Format date values consistently
  const formatDate = (dateString) => {
    if (!dateString) return getCurrentDate();

    // If the date already has the correct format (DD.MM.YYYY), return it
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
      return dateString;
    }

    // Otherwise, try to parse and format it
    try {
      const parts = dateString.split(/[/.-]/);
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
        return `${day}.${month}.${year}`;
      }
    } catch (e) {
      console.error("Error formatting date:", e);
    }

    // If all else fails, return the current date
    return getCurrentDate();
  };

  return (
    <div className={styles.container}>
      {/* Sidebar with buttons */}
      <div className={styles.sidebar}>
        <div className={styles.buttonContainer}>
          {/* Add Entry Button */}
          <div className={styles.tooltipContainer}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`${styles.button} ${styles.buttonAdd}`}
              aria-label="Add Entry"
            >
              <Plus className={styles.icon} />
            </button>
            <div className={styles.tooltip}>
              <div className={styles.tooltipContent}>Add New Entry</div>
            </div>
          </div>

          {/* Save Button */}
          <div className={styles.tooltipContainer}>
            <button
              onClick={handleSave}
              className={`${styles.button} ${styles.buttonSave}`}
              aria-label="Save"
            >
              <Save className={styles.icon} />
            </button>
            <div className={styles.tooltip}>
              <div className={styles.tooltipContent}>Save Changes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Intrări Formular</h1>

          {error && <div className={styles.errorMessage}>{error}</div>}

          {loading ? (
            <div className={styles.loadingMessage}>Loading entries...</div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nume</th>
                    <th>Adresa beneficiarului</th>
                    <th>Nr. cont</th>
                    <th>Trezorerie</th>
                    <th>Cod</th>
                    <th>Editeaza/Sterge</th>
                  </tr>
                </thead>
                <tbody>
                  {formEntries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className={styles.noEntries}>
                        No entries found. Add a new entry to get started.
                      </td>
                    </tr>
                  ) : (
                    formEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td title={entry.Nume_Furnizor}>
                          {entry.Nume_Furnizor}
                        </td>
                        <td title={entry.Adresa_Furnizor}>
                          {entry.Adresa_Furnizor}
                        </td>
                        <td title={entry.CUI_CUI_CIF}>{entry.CUI_CUI_CIF}</td>
                        <td title={entry.Trezorerie_Furnizor}>
                          {entry.Trezorerie_Furnizor}
                        </td>
                        <td title={entry.NR_CONT_IBAN}>{entry.NR_CONT_IBAN}</td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              onClick={() => handleEdit(entry.id)}
                              className={`${styles.actionButton} ${styles.editButton}`}
                              aria-label="Edit entry"
                              title="Edit"
                            >
                              <Pencil className={styles.actionIcon} />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              aria-label="Delete entry"
                              title="Delete"
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
          )}
        </div>
      </main>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEntry}
      />
    </div>
  );
}
