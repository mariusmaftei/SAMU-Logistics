import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useFormEntries } from "../../context/FormEntriesContext";
import AddEntryModal from "../../components/UI/from-entry-modal/FormEntryModal";
import styles from "../form-entries/form-entries.module.css";

export default function FormEntries() {
  const { formEntries, loading, error, deleteEntry } = useFormEntries();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleAddEntry = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.buttonContainer}>
          <div className={styles.tooltipContainer}>
            <button
              onClick={() => setIsAddModalOpen(true)}
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
                    <th>CUI/CIF</th>
                    <th>Trezorerie</th>
                    <th>IBAN</th>
                    <th>Editeaza/Sterge</th>
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

      <AddEntryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEntry}
      />
    </div>
  );
}
