import Entry from "../models/Entry.js";

// Get all entries
export const getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.findAll();
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
    const entry = await Entry.findByPk(req.params.id);

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
    const { fullName, address, treasuryNumber, accountNumber, roCode } =
      req.body;

    // Validate required fields
    if (!fullName || !address || !treasuryNumber || !accountNumber || !roCode) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    // Create entry in database
    const entry = await Entry.create({
      fullName,
      address,
      treasuryNumber,
      accountNumber,
      roCode,
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
    const entry = await Entry.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: "Entry not found",
      });
    }

    // Update entry
    await entry.update(req.body);

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error updating entry:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Delete entry
export const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: "Entry not found",
      });
    }

    // Delete entry
    await entry.destroy();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
