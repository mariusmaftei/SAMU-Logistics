import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/entry";
const FormEntriesContext = createContext();

export function FormEntriesProvider({ children }) {
  const [formEntries, setFormEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch entries from the server
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setFormEntries(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching entries:", err);
        setError("Failed to load entries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Function to get beneficiary data by name
  const getBeneficiaryByName = (name) => {
    return formEntries.find((entry) => entry.fullName === name);
  };

  // Function to add a new entry
  const addEntry = async (newEntry) => {
    try {
      const response = await axios.post(API_URL, newEntry);
      setFormEntries([...formEntries, response.data.data]);
      return response.data.data;
    } catch (err) {
      console.error("Error adding entry:", err);
      throw err;
    }
  };

  // Function to update an entry
  const updateEntry = async (id, updatedEntry) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedEntry);
      setFormEntries(
        formEntries.map((entry) =>
          entry.id === id ? response.data.data : entry
        )
      );
      return response.data.data;
    } catch (err) {
      console.error("Error updating entry:", err);
      throw err;
    }
  };

  // Function to delete an entry
  const deleteEntry = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setFormEntries(formEntries.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error("Error deleting entry:", err);
      throw err;
    }
  };

  // Function to get current date in DD.MM.YYYY format
  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <FormEntriesContext.Provider
      value={{
        formEntries,
        setFormEntries,
        getBeneficiaryByName,
        getCurrentDate,
        loading,
        error,
        addEntry,
        updateEntry,
        deleteEntry,
      }}
    >
      {children}
    </FormEntriesContext.Provider>
  );
}

export function useFormEntries() {
  const context = useContext(FormEntriesContext);
  if (!context) {
    throw new Error("useFormEntries must be used within a FormEntriesProvider");
  }
  return context;
}
