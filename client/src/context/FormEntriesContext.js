import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import entryService from "../services/entryServices";

const FormEntriesContext = createContext();

export const useFormEntries = () => {
  const context = useContext(FormEntriesContext);
  if (!context) {
    throw new Error("useFormEntries must be used within a FormEntriesProvider");
  }
  return context;
};

export const FormEntriesProvider = ({ children }) => {
  const [formEntries, setFormEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshEntries = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await entryService.getAllEntries();
        setFormEntries(result.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching entries:", err);
        setError(err.response?.data?.error || "Failed to fetch entries");

        if (formEntries.length > 0) {
          setLoading(false);
        }
      }
    };

    fetchEntries();
  }, [refreshTrigger, formEntries.length]);

  const createEntry = async (entryData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await entryService.createEntry(entryData);
      setFormEntries((prev) => [...prev, result.data]);
      return result.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to create entry";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id, entryData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await entryService.updateEntry(id, entryData);

      setFormEntries((prev) =>
        prev.map((entry) =>
          entry._id === id || entry.id === id ? result.data : entry
        )
      );

      return result.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update entry";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await entryService.deleteEntry(id);
      setFormEntries((prev) =>
        prev.filter((entry) => entry._id !== id && entry.id !== id)
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete entry";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getBeneficiaryByName = (name) => {
    return formEntries.find((entry) => entry.Nume_Furnizor === name) || null;
  };

  const value = {
    formEntries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshEntries,
    getBeneficiaryByName,
  };

  return (
    <FormEntriesContext.Provider value={value}>
      {children}
    </FormEntriesContext.Provider>
  );
};
