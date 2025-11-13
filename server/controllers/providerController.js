import Provider from "../models/Provider.js";

// Get all entries
export const getAllEntries = async (req, res) => {
  try {
    const entries = await Provider.find();

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Get single entry
export const getEntry = async (req, res) => {
  try {
    const entry = await Provider.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: "Entry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error fetching entry:", error);

    // Handle invalid ObjectId format
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Entry not found",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Create new entry
export const createEntry = async (req, res) => {
  try {
    // Extract data from request body
    const { providers, address, cui_cif, treasury, iban } = req.body;

    // Validate required fields
    if (!providers || !address || !cui_cif || !treasury || !iban) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    // Create entry in database
    const entry = await Provider.create({
      providers,
      address,
      cui_cif,
      treasury,
      iban,
    });

    res.status(201).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error creating entry:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Update entry
export const updateEntry = async (req, res) => {
  try {
    // Find and update entry with the new data, and return the updated document
    const entry = await Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run model validators
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: "Entry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error updating entry:", error);

    // Handle invalid ObjectId format
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Entry not found",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Delete entry
export const deleteEntry = async (req, res) => {
  try {
    const entry = await Provider.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: "Entry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error deleting entry:", error);

    // Handle invalid ObjectId format
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Entry not found",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
