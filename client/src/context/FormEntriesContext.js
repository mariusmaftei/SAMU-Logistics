"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import entryService from "../services/entryServices";
import { useAuth } from "./AuthContext";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isAuthenticated } = useAuth();

  // Function to refresh the data
  const refreshEntries = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Fetch all entries - only when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setFormEntries([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await entryService.getAllEntries();
        setFormEntries(result.data || []);
      } catch (err) {
        console.error("Error fetching entries:", err);
        if (err.response?.status === 401) {
          // Authentication error - don't show as error, just clear entries
          setFormEntries([]);
        } else {
          setError(err.response?.data?.error || "Failed to fetch entries");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [refreshTrigger, isAuthenticated]);

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
    return formEntries.find((entry) => entry.providers === name) || null;
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
