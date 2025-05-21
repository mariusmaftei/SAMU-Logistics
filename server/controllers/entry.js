import Entry from "../models/Entry.js";

// Get all entries
export const getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.find();

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
    const entry = await Entry.findById(req.params.id);

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
    const {
      Nume_Furnizor,
      Adresa_Furnizor,
      CUI_CUI_CIF,
      Trezorerie_Furnizor,
      NR_CONT_IBAN,
    } = req.body;

    // Validate required fields
    if (
      !Nume_Furnizor ||
      !Adresa_Furnizor ||
      !CUI_CUI_CIF ||
      !Trezorerie_Furnizor ||
      !NR_CONT_IBAN
    ) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    // Create entry in database
    const entry = await Entry.create({
      Nume_Furnizor,
      Adresa_Furnizor,
      CUI_CUI_CIF,
      Trezorerie_Furnizor,
      NR_CONT_IBAN,
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
    const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
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
    const entry = await Entry.findByIdAndDelete(req.params.id);

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
