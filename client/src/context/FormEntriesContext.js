"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import entryService from "../services/entryServices";

// Create the context
const FormEntriesContext = createContext();

// Custom hook to use the context
export const useFormEntries = () => {
  const context = useContext(FormEntriesContext);
  if (!context) {
    throw new Error("useFormEntries must be used within a FormEntriesProvider");
  }
  return context;
};

// Provider component
export const FormEntriesProvider = ({ children }) => {
  const [formEntries, setFormEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to refresh the data
  const refreshEntries = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Fetch all entries
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await entryService.getAllEntries();
        setFormEntries(result.data || []);
        setLoading(false); // Only set loading to false after successful data fetch
      } catch (err) {
        console.error("Error fetching entries:", err);
        setError(err.response?.data?.error || "Failed to fetch entries");
        // Keep loading true if there's an error during initial load (empty entries)
        if (formEntries.length > 0) {
          setLoading(false);
        }
      }
    };

    fetchEntries();
  }, [refreshTrigger]);

  // Create a new entry
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

  // Update an existing entry
  const updateEntry = async (id, entryData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await entryService.updateEntry(id, entryData);

      // Update the entry in the local state
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

  // Delete an entry
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

  // Helper function to find a beneficiary by name
  const getBeneficiaryByName = (name) => {
    return formEntries.find((entry) => entry.Nume_Furnizor === name) || null;
  };

  // Value object to be provided by the context
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
