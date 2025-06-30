import api from "./api";

const ENDPOINT = "/entry";

const entryService = {
  getAllEntries: async () => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error) {
      console.error("Error fetching entries:", error);
      throw error;
    }
  },

  getEntryById: async (id) => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching entry ${id}:`, error);
      throw error;
    }
  },

  createEntry: async (entryData) => {
    try {
      const response = await api.post(ENDPOINT, entryData);
      return response.data;
    } catch (error) {
      console.error("Error creating entry:", error);
      throw error;
    }
  },

  updateEntry: async (id, entryData) => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, entryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating entry ${id}:`, error);
      throw error;
    }
  },

  deleteEntry: async (id) => {
    try {
      const response = await api.delete(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting entry ${id}:`, error);
      throw error;
    }
  },
};

export default entryService;
